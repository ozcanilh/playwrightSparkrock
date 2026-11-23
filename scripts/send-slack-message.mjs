const requestTimeoutMs = 15_000;
const reportArtifactNames = new Set(['reports-chrome', 'reports-firefox']);

async function getReportLinks(artifactsUrl, runUrl, githubToken) {
  try {
    const response = await fetch(artifactsUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${githubToken}`,
      },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });

    if (!response.ok) {
      throw new Error(`GitHub returned HTTP ${response.status}`);
    }

    const { artifacts } = await response.json();
    return artifacts
      .filter(({ name, expired }) => !expired && reportArtifactNames.has(name))
      .map(
        ({ id, name }) =>
          `<${runUrl}/artifacts/${id}|${name} · Playwright and Allure>`,
      );
  } catch {
    console.warn(
      'Unable to look up report artifacts. The Slack message will link to the workflow run.',
    );
    return [];
  }
}

async function sendSlackMessage() {
  const {
    SPARKROCK_SLACK_REPORTS_ENABLED,
    SLACK_WEBHOOK_URL,
    GITHUB_API_URL,
    GITHUB_EVENT_NAME,
    GITHUB_REPOSITORY,
    GITHUB_RUN_ID,
    GITHUB_SERVER_URL,
    GITHUB_TOKEN,
    TEST_RESULT,
  } = process.env;

  if (SPARKROCK_SLACK_REPORTS_ENABLED !== 'true' || !SLACK_WEBHOOK_URL) {
    console.log(
      'Slack delivery skipped. Enable it and configure the repository webhook to send reports.',
    );
    return;
  }

  if (
    ![
      GITHUB_API_URL,
      GITHUB_EVENT_NAME,
      GITHUB_REPOSITORY,
      GITHUB_RUN_ID,
      GITHUB_SERVER_URL,
      GITHUB_TOKEN,
      TEST_RESULT,
    ].every(Boolean)
  ) {
    console.error('Slack delivery requires the GitHub Actions run context.');
    process.exitCode = 1;
    return;
  }

  const runPath = `${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
  const runUrl = `${GITHUB_SERVER_URL}/${runPath}`;
  const artifactsUrl = `${GITHUB_API_URL}/repos/${runPath}/artifacts`;
  const browsers =
    GITHUB_EVENT_NAME === 'schedule' ? 'Chrome' : 'Chrome, Firefox';
  const reportLinks = await getReportLinks(artifactsUrl, runUrl, GITHUB_TOKEN);
  const text = [
    `*Sparkrock Playwright E2E* · *${TEST_RESULT}*`,
    `Trigger: ${GITHUB_EVENT_NAME} · Browsers: ${browsers}`,
    `<${runUrl}|Workflow run>`,
    ...reportLinks,
  ].join('\n');

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    redirect: 'error',
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  if (!response.ok || (await response.text()).trim() !== 'ok') {
    console.error(`Slack did not confirm delivery (HTTP ${response.status}).`);
    process.exitCode = 1;
    return;
  }

  console.log('Slack notification delivered.');
}

try {
  await sendSlackMessage();
} catch {
  console.error(
    'Slack delivery failed. Check the webhook configuration and runner connectivity.',
  );
  process.exitCode = 1;
}
