# OpenStatus | Vercel Edge Ping

We want to provide you a lightweight version of [OpenStatus](https://openstatus.dev) to monitor your services. No library. No UI. No maintenance.

Therefore, we will be using Vercel Edge runtime to monitor your services across 18 regions as simple as possible.

Choose your [configuration](#configuration) and be ready in 5min to monitor your website or API services.

You can even one-click deploy the service by adding the stringified array to the `REQUESTS` environment variables. (see [here](#environment-variables))

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FopenstatusHQ%2Fvercel-edge-ping&env=CRON_SECRET,PING_SECRET)

Currently supported [notification channels](#notification-channels) are:

- Slack
- Discord
- Campsite
- Telegram

## Getting Started

To work/test it locally:

```bash
pnpm install
pnpm start
```

### Vercel CLI

Make sure to have the [Vercel CLI](https://vercel.com/docs/cli) running on your machine. When you first start the project, you will get asked to connect it to your vercel account.

Checkout `.env.example` for the (required) environment variables. Use the Vercel CLI and the [`add env`](https://vercel.com/docs/cli/env) command:

```bash
vercel env add
```

### Tinybird CLI (optional)

If you want to ingest the data and keep track of the response times, add the `TINYBIRD_TOKEN` to your environment variables.

Include the [Tinybird CLI](https://www.tinybird.co/docs/cli) as well to easily set the pipe and datasource to ingest and get the data:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install tinybird-cli
tb auth -i
```

Add `--dry-run` to the commands if you want to first test them:

```bash
tb push tb/datasources/http_ping_responses.datasource
tb push tb/pipes/endpoint__get_http.pipe
```

## Configuration

### Monitors

A `PingRequest` includes the below props:

| **Property** | **Type**                 | **Description**                                                         |
| ------------ | ------------------------ | ----------------------------------------------------------------------- |
| `url`        | `string`                 | The URL to send the ping request to.                                    |
| `method`     | `string`                 | The HTTP method to use for the request (e.g., GET, POST).               |
| `body?`      | `string`                 | Optional request body.                                                  |
| `headers?`   | `Record<string, string>` | Optional headers to include in the request.                             |
| `timeout?`   | `number`                 | Optional timeout in milliseconds for the request. Defaults to 50_000ms. |
| `prewarm?`   | `boolean`                | Optional flag to prewarm the endpoint before timing the next request.   |

There are multiple ways to add your monitors:

- via `./api/resources.json` file _but that would require a fork + changes_
- via a fetch call using the `REQUEST_GET_URL` returning a type of `PingRequest[]` _but that would require you to maintain that connection_
- via `.env` where we stringify the `PingRequest[]` array and read it out

All three options can work parallely.

We _roughly_ validate the external input. If they don't match the expected type, you'll see a `console.error` in your logs.

#### File reading

Add your endpoints statically to the list `./api/resources.json` file.

For example:

```json
[{ "url": "https://openstat.us/200", "method": "GET", "prewarm": true }]
```

#### Fetching resources

Create an endpoint that returns the list. Use the `EXTERNAL_REQUESTS_URL` to fetch the list dynamically on every ping.

To secure your endpoint, we provide the `EXTERNAL_REQUESTS_SECRET` environment variable that gets passed as property to the header `Authorization: Bearer EXTERNAL_REQUESTS_SECRET`.

#### Environment variables

The **fastest way to get started** without having to commit any code changes is to add the stringified list to your environment variables.

For example:

```
[{"url":"https://openstat.us/200","method":"GET", "prewarm":true}]
```

> [!NOTE]
> Whenever you change the environment variable, you'll need to rebuild/redeploy the app to included the latest changes.

### vercel.json

We have made some configurations within `vercel.json`. Let's break them down.

The [maximum duration](https://vercel.com/docs/functions/configuring-functions/duration) of the serverless functions are set to the max of the _free plan_:

```
  "functions": {
    "api/cron.ts": {
      "maxDuration": 60
    }
  }
```

The [cron jobs](https://vercel.com/docs/cron-jobs) are set to the maximum of the _free plan_ which is daily:

```
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 0 * * *"
    }
  ]
```

If you are on a _pro plan_, update it to the cron expression you'd like to use.

The cron endpoint is automatically secured by including the [`CRON_SECRET`](https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs) environment variable.

### GitHub Workflows (optional)

Optionally, if you want to keep the vercel _free plan_ and increase the periodicity of the cron job, you can work it out by using github actions.

Go to your _GitHub repository → Settings → Secrets and variables → Actions → New repository secret_ and add:

- `CRON_SECRET` - the same one as in vercel envs
- `BASE_URL` - the production URL from vercel

You can either trigger it manually via `workflow_dispatch` or update the `schedule.cron` to the cron expression you'd like to periodically run the attached curl.

## Notification Channels

If set, we will send a message if >50% of the regions of a specific endpoint are failing. An endpoint fails, if the response status code **doesn't start with `2` or `3`**.

Notifications to the different services will be send only if the environment variables are set.

### Slack Webhook (optional)

If you want to get notified whenever an endpoint is not healthy, add the `SLACK_WEBHOOK_URL` to your environment variables.

To create a webhook for a specific channel you'd like to post the messages to, [follow the guide](https://api.slack.com/messaging/webhooks).

### Discord Webhook (optional)

If you want to get notified whenever an endpoint is not healthy, add the `DISCORD_WEBHOOK_URL` to your environment variables.

To create a webhook for a specific channel you'd like to post the messages to, [follow the guide](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

### Campsite Post (optional)

If you want to get notified whenever an endpoint is not healthy, add the `CAMPSITE_API_KEY` and `CAMPSITE_CHANNEL_ID` to your environment variables.

To create an API key, [follow the docs](https://developers.campsite.com/api-reference/introduction). You will need to connect your integration to a channel and copy the channel id as well.

### Telegram Bot (optional)

If you want to get notified whenever an endpoint is not healthy, add the `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to your environment variables.

To create a telegram bot, [follow the gist](https://gist.github.com/nafiesl/4ad622f344cd1dc3bb1ecbe468ff9f8a#how-to-get-telegram-bot-chat-id).

## Deployment

Check the Vercel CLI docs regarding [`deploy`](https://vercel.com/docs/cli/deploy) commands if you want to learn more. Otherwise:

```bash
# deploy to preview
vercel
# deploy to production
vercel --prod
```

## More

> [!NOTE]  
> If you host your services on Vercel and want to make sure the provider is up, this is a bad idea as the edge ping depends on Vercel itself. Instead, it is good to keep uptime of your own services like hosted APIs, getting latency over time, or be informed whenever your services are not responding as expected.

If you are on a pro plan on vercel, you are allowed for _Unlimited cron invocations_ instead of _Triggered once a day_. Fork and change the `vercel.json` content to whatevery cron you'd like to. Use [crontab.guru](https://crontab.guru) to quickly edit and validate the cron expression.
