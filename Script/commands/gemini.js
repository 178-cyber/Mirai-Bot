const axios = require("axios");

// رابط API آريا
const ARIA_API_URL = "https://haji-mix-api.gleeze.com/api/aria";
const API_KEY = "2ad1b6fc3d11354ea82d809b9f6b6864ff32d64f75bbd0d10d1b7a487c6f09cb";

module.exports.config = {
  name: "اريا",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ArYAN - تم التحديث لآريا AI",
  description: "🤖 تحدث مع آريا AI المساعدة الذكية من أوبرا!",
  commandCategory: "🤖 محادثة-ذكية",
  usages: "[سؤالك] | رد على صورة",
  cooldowns: 5,
  dependencies: {
    axios: ""
  },
  envConfig: {}
};

module.exports.languages = {
  "en": {
    noPrompt: "⚠️ يرجى كتابة سؤالك أو الرد على صورة!",
    errorAPI: "❌ فشل في الاتصال بـ آريا AI.",
    noResponse: "🤖 لا توجد استجابة من آريا.",
    imageFailed: "🖼️ فشل في معالجة الصورة مع آريا.",
    thinking: "🤔 آريا تفكر..."
  }
};

module.exports.onLoad = function () {
  console.log("✅ تم تحميل وحدة آريا AI بنجاح.");
};

module.exports.handleReaction = function () { };
module.exports.handleReply = async function ({ api, event, handleReply, getText }) {
  // معالجة الرد على رسائل آريا
  const prompt = event.body.trim();
  
  if (!prompt) {
    return api.sendMessage("💡 " + getText("noPrompt"), event.threadID, event.messageID);
  }

  // إرسال رسالة أن آريا تفكر
  const thinkingMessage = await api.sendMessage("🤔 " + getText("thinking"), event.threadID);

  try {
    const response = await axios.get(ARIA_API_URL, {
      params: {
        ask: prompt,
        stream: false,
        api_key: API_KEY
      },
      timeout: 30000 // مهلة زمنية 30 ثانية
    });

    // إزالة رسالة التفكير
    api.unsendMessage(thinkingMessage.messageID);

    const data = response.data;
    
    if (!data || !data.answer) {
      return api.sendMessage("🤖 " + getText("noResponse"), event.threadID, event.messageID);
    }

    // تنسيق الرد
    const reply = data.answer.trim();
    
    const messageInfo = await api.sendMessage(reply, event.threadID, event.messageID);
    
    // إضافة معرف الرسالة للردود
    if (messageInfo && messageInfo.messageID && global.client && global.client.handleReply) {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: messageInfo.messageID,
        author: event.senderID,
        type: "reply"
      });
    }
    
    return messageInfo;

  } catch (err) {
    console.error("❌ خطأ في آريا AI:", err.message);
    
    // إزالة رسالة التفكير
    api.unsendMessage(thinkingMessage.messageID);
    
    // رسائل خطأ مفصلة
    let errorMessage = "🚫 " + getText("errorAPI");
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = "⏰ انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.";
    } else if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        errorMessage = "🔑 خطأ في مفتاح API. يرجى التحقق من صحة المفتاح.";
      } else if (status === 429) {
        errorMessage = "🚫 تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.";
      } else if (status >= 500) {
        errorMessage = "🔧 خطأ في الخادم. يرجى المحاولة لاحقاً.";
      }
    }
    
    return api.sendMessage(errorMessage, event.threadID, event.messageID);
  }
};
module.exports.handleEvent = function () { };
module.exports.handleSchedule = function () { };

module.exports.run = async function ({ api, event, args, getText }) {
  const prompt = args.join(" ").trim();

  const isImageReply =
    event.type === "message_reply" &&
    event.messageReply.attachments?.length > 0 &&
    event.messageReply.attachments[0].type === "photo";

  // 🧩 التحقق من وجود سؤال أو صورة
  if (!prompt && !isImageReply) {
    return api.sendMessage("💡 " + getText("noPrompt"), event.threadID, event.messageID);
  }

  // إرسال رسالة أن آريا تفكر
  const thinkingMessage = await api.sendMessage("🤔 " + getText("thinking"), event.threadID);

  // 🖼️ معالجة الصور (ملاحظة: API آريا الحالي لا يدعم الصور، لكن يمكن إضافة هذه الميزة لاحقاً)
  if (isImageReply) {
    try {
      // إزالة رسالة التفكير
      api.unsendMessage(thinkingMessage.messageID);
      
      return api.sendMessage(
        "🖼️ عذراً، آريا لا تدعم معالجة الصور حالياً. يرجى كتابة سؤالك نصياً.",
        event.threadID,
        event.messageID
      );
    } catch (err) {
      console.error("❌ خطأ في معالجة الصورة:", err.message);
      api.unsendMessage(thinkingMessage.messageID);
      return api.sendMessage("🚫 " + getText("imageFailed"), event.threadID, event.messageID);
    }
  }

  // 💬 معالجة النصوص
  try {
    const response = await axios.get(ARIA_API_URL, {
      params: {
        ask: prompt,
        stream: false,
        api_key: API_KEY
      },
      timeout: 30000 // مهلة زمنية 30 ثانية
    });

    // إزالة رسالة التفكير
    api.unsendMessage(thinkingMessage.messageID);

    const data = response.data;
    
    if (!data || !data.answer) {
      return api.sendMessage("🤖 " + getText("noResponse"), event.threadID, event.messageID);
    }

    // تنسيق الرد
    const reply = data.answer.trim();
    
    return api.sendMessage(
      reply,
      event.threadID,
      event.messageID,
      (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "reply"
          });
        }
      }
    );

  } catch (err) {
    console.error("❌ خطأ في آريا AI:", err.message);
    
    // إزالة رسالة التفكير
    api.unsendMessage(thinkingMessage.messageID);
    
    // رسائل خطأ مفصلة
    let errorMessage = "🚫 " + getText("errorAPI");
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = "⏰ انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.";
    } else if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        errorMessage = "🔑 خطأ في مفتاح API. يرجى التحقق من صحة المفتاح.";
      } else if (status === 429) {
        errorMessage = "🚫 تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.";
      } else if (status >= 500) {
        errorMessage = "🔧 خطأ في الخادم. يرجى المحاولة لاحقاً.";
      }
    }
    
    return api.sendMessage(errorMessage, event.threadID, event.messageID);
  }
};
