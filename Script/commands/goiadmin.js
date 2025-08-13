module.exports.config = {
  name: "مناداة_الادمن",
  version: "1.0.0-beta-fixbyDungUwU",
  hasPermssion: 0,
  credits: "ZyrosGenZ - تعديل بواسطة DungUwU",
  description: "البوت سيرد عندما يقوم شخص بعمل منشن للأدمن أو للبوت",
  commandCategory: "أخرى",
  usages: "",
  cooldowns: 1
};

module.exports.languages = {
  ar: {
    message: "لا تذكر الأدمن بدون داعٍ!"
  }
};

module.exports.handleEvent = function({ api, event }) {
  const adminIDs = ["61567181097397", "61567181097397"]; // أرقام تعريف الأدمن
  const mentionIDs = Object.keys(event.mentions || {});
  
  // التحقق إذا كانت الرسالة تحتوي على منشن لأي أدمن
  if (mentionIDs.some(id => adminIDs.includes(id))) {
    const responses = [
      "الزعيم مشغول حاليًا، لا تزعجه 🥺",
      "إذا منحت الزعيم منشن مرة أخرى سأضربك 😡",
      "توقف عن مناداة الزعيم وإلا سيكون هناك مشاكل! 😠",
      "الزعيم الآن مشغول جدًا، لا تزعجه 🥰😍😏",
      "لا تعمل منشن للزعيم مرة أخرى 😡😡😡"
    ];
    
    const randomMsg = responses[Math.floor(Math.random() * responses.length)];
    return api.sendMessage(randomMsg, event.threadID, event.messageID);
  }
};

module.exports.run = async function() {};
