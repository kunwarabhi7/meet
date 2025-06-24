import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", () => {
  const url = process.env.API_URL;
  if (!url) {
    console.error("API_URL is not defined in environment variables");
    return;
  }

  https
    .get(url, (res) => {
      if (res.statusCode === 200) {
        console.log("✅ Ping successful to", url);
      } else {
        console.error("❌ Ping failed with status:", res.statusCode);
      }
    })
    .on("error", (e) => console.error("❌ Error during ping:", e.message));
});

export default job;
