const axios = require("axios");

// إعدادات API
const API_URL = "https://haji-mix-api.gleeze.com/api/aria";
const API_KEY = "2ad1b6fc3d11354ea82d809b9f6b6864ff32d64f75bbd0d10d1b7a487c6f09cb";

module.exports.config = {
  name: "اريا",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "مطور عربي",
  description: "🤖 تحدث مع الذكي الاصطناعي آريا",
  commandCategory: "🤖 الذكاء الاصطناعي",
  usages: "[رسالة]",
  cooldowns: 3,
  dependencies: {
    axios: ""
  },
  envConfig: {}
};

module.exports.languages = {
  "en": {
    noPrompt: "⚠️ يرجى كتابة رسالة للتحدث مع آريا!",
    errorAPI: "❌ فشل في الاتصال بخدمة آريا.",
    noResponse: "🤖 لم أحصل على رد من آريا.",
    processing: "⏳ آريا تفكر في إجابتك..."
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const prompt = args.join(" ").trim();

  // التحقق من وجود رسالة
  if (!prompt) {
    return api.sendMessage("💡 " + getText("noPrompt"), event.threadID, event.messageID);
  }

  // إرسال رسالة معالجة
  
  try {
    // إرسال الطلب للـ API
    const response = await axios.get(API_URL, {
      params: {
        ask: prompt,
        stream: false,
        api_key: API_KEY
      }
    });

    // استخراج الإجابة
    const reply = response.data?.answer || getText("noResponse");
    const usage = response.data?.usage || "";

    // حذف رسالة المعالجة
    
    // إرسال الرد
    const finalMessage = `${reply}` : ""}`;
    
    return api.sendMessage(finalMessage, event.threadID, event.messageID);

  } catch (err) {
    console.error("❌ خطأ في آريا:", err.message);
    
    // حذف رسالة المعالجة في حالة الخطأ
    api.unsendMessage(processingMsg.messageID);
    
    return api.sendMessage("🚫 " + getText("errorAPI"), event.threadID, event.messageID);
  }
};
