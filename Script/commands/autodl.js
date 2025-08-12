const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const path = require("path");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
  config: {
    name: "تنزيل_تلقائي",
    version: "0.0.2",
    hasPermssion: 0,
    credits: "SHAON",
    description: "تحميل الفيديوهات تلقائياً عند إرسال رابط",
    commandCategory: "المستخدم",
    usages: "",
    cooldowns: 5
  },

  languages: {
    en: {
      downloading: "⏳ الرجاء الانتظار، يتم الآن تحميل الفيديو...",
      success: "🎬 استمتع بمشاهدة الفيديو!",
      error: "❌ فشل تحميل الفيديو."
    },
    ar: {
      downloading: "⏳ Please wait, downloading your video...",
      success: "🎬 Enjoy your video!",
      error: "❌ Failed to download video."
    }
  },

  run: async function ({ api, event, args }) {
    // هذا الأمر لا يحتاج إلى تشغيل يدوي
    return api.sendMessage("⚠️ هذا الأمر يعمل تلقائياً عند إرسال رابط فيديو.", event.threadID, event.messageID);
  },

  handleEvent: async function ({ api, event, getText }) {
    const content = event.body || '';
    const body = content.toLowerCase();

    if (!body.startsWith("https://")) return;

    try {
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);
      api.sendMessage(getText("downloading"), event.threadID, event.messageID);

      const data = await alldown(content);
      const videoUrl = data.url;

      api.setMessageReaction("☢️", event.messageID, () => {}, true);

      const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;

      const filePath = path.join(__dirname, "cache", "auto.mp4");
      fs.writeFileSync(filePath, Buffer.from(videoBuffer, "utf-8"));

      return api.sendMessage({
        body: `🔥🚀 MIRAI-BOT | 🔥💻\n📥⚡𝗔𝘂𝘁𝗼 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿⚡📂\n${getText("success")}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (err) {
      console.error("❌ Error:", err);
      api.sendMessage(getText("error"), event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};
