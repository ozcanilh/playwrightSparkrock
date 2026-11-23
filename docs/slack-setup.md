# Slack report delivery setup

The workflow uses a Slack Incoming Webhook to publish test results and report download links to one channel. Delivery is opt-in.

## Repository settings

1. Enable **Incoming Webhooks** for a Slack app. Choose **Add New Webhook to Workspace** and select the destination channel. [Slack webhook setup](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks/)
2. In the GitHub repository, open **Settings → Secrets and variables → Actions → Secrets**. Create the repository secret `SLACK_WEBHOOK_URL` and paste the URL for the selected channel. [GitHub Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
3. When the channel is ready to receive reports, open the **Variables** tab in the same settings page. Create the repository variable `SPARKROCK_SLACK_REPORTS_ENABLED` with the value `true`. Keep the variable unset to leave delivery disabled.

## Check delivery

Run **Actions → Playwright E2E → Run workflow** after enabling delivery. **Notify Slack** sends one message after the browser jobs finish. The message includes the result, trigger, browsers, workflow run link and available report bundle links. A bundle contains `playwright-report/` and `allure-report/`. The scheduled run publishes a Chrome bundle.

The GitHub Actions artifacts are retained for 14 days. Download them from the Slack links using an account with access to the repository. Check the **Notify Slack** job log for delivery errors or a missing webhook value. [Workflow](../.github/workflows/playwright.yml) · [Node.js delivery script](../scripts/send-slack-message.mjs)
