module.exports.config = {
  name: "ريست",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "AMINULSORDAR",
  description: "Restart Bot",
  commandCategory: "system",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  return api.sendMessage(`${global.config.BOTNAME} Bot is now restarting...`, threadID, () => process.exit(1));
};

module.exports.languages = {
  en: {
    restarting: "يتم اعادة تشغيل البوت..."
  },
  vi: {
    restarting: "Bot đang được khởi động lại..."
  }
};
