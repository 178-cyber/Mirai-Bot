module.exports.config = {
  name: "اوامر",
  version: "3.0-onlyAll",
  hasPermssion: 0,
  credits: "Aminul Sordar - Simplified by ChatGPT",
  description: "📚 عرض جميع الأوامر بشكل مزخرف",
  commandCategory: "🛠 النظام",
  usages: "all",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    allCmds:
`📚  جـمـيـع الأوامــر
━━━━━━━━━━━━━━━━━━━━
%1
━━━━━━━━━━━━━━━━━━━━
📌 المجموع: %2 أمر
📂 الأحداث: %3
🧑‍💻 صانع البوت: القروي`
  },
  ar: {
    allCmds:
`📚 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
━━━━━━━━━━━━━━━━━━━━
%1
━━━━━━━━━━━━━━━━━━━━
📌 Total: %2 commands
📂 Events: %3
🧑‍💻 Made by: Aminul Sordar`
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const { commands, events } = global.client;

  if (args[0] !== "all")
    return api.sendMessage("❌ يرجى استخدام: help all", threadID, messageID);

  const allCmds = Array.from(commands.values()).map((cmd, i) =>
`━❮●❯━━━━━❪❤💙💚❫━━━━━❮●❯━
【•${i + 1} ★اسـم الأمـر★【•${cmd.config.name}•】`
  ).join("\n");

  const msg = getText(
    "allCmds",
    allCmds,
    commands.size,
    events.size
  );

  return api.sendMessage(msg, threadID, messageID);
};
