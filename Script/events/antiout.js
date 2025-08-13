module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "0.0.1",
  credits: "MIRAI-BOT - ترجمة عربية",
  description: "إشعار عند مغادرة عضو ومحاولة إضافته مرة أخرى مع صورة أو فيديو أو GIF عشوائي"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.antiout == false) return;

  // تجاهل إذا كان البوت نفسه هو الذي تم إزالته
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "غادر بنفسه" : "تمت إزالته بواسطة الأدمن";

  if (type == "غادر بنفسه") {
    api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
      if (error) {
        api.sendMessage(
          `عذرًا 😞\nتعذرت إعادة إضافة ${name}.\nقد يكون قد حظر البوت أو قام بإيقاف الماسنجر الخاص به.\n⋆✦⎯⎯⎯⎯⎯⎯⎯⎯✦⋆\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ AMINUL-SORDAR`,
          event.threadID
        );
      } else {
        api.sendMessage(
          `${name} غادر المجموعة وتمت إعادته بنجاح ✅\n⋆✦⎯⎯⎯⎯⎯⎯⎯⎯✦⋆\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ AMINUL-SORDAR`,
          event.threadID
        );
      }
    });
  }
};
