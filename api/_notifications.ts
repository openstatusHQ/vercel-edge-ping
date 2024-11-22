export async function sendSlackMessage(message: string) {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  return fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message }),
  });
}

export async function sendDiscordMessage(message: string) {
  if (!process.env.DISCORD_WEBHOOK_URL) return;
  return fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message }),
  });
}

export async function sendCampsiteMessage(message: string) {
  if (!process.env.CAMPSITE_API_KEY || !process.env.CAMPSITE_CHANNEL_ID) return;
  return fetch("https://api.campsite.com/v2/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CAMPSITE_API_KEY}`,
    },
    body: JSON.stringify({
      channel_id: process.env.CAMPSITE_CHANNEL_ID,
      content_markdown: message,
    }),
  });
}

export async function sendTelegramMessage(message: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
  return fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${message}`
  );
}
