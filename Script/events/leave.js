const moment = require("moment-timezone");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "ترجمة وتزيين بواسطة Aminul Sordar بالاعتماد على MIRAI-BOT",
  description: "إرسال رسالة وداع مزخرفة عند مغادرة شخص من المجموعة.",
  dependencies: {}
};

module.exports.onLoad = () => {
  // لا حاجة لأي مجلدات — تم حذف الوسائط
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  // إذا غادر البوت نفسه، لا يتم إرسال رسالة
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;

  // الحصول على الوقت الحالي والفترة
  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
  const hour = parseInt(moment.tz("Asia/Dhaka").format("HH"));
  const session =
    hour < 10 ? "🌅 صباحًا" :
    hour <= 12 ? "🌤️ ظهرًا" :
    hour <= 18 ? "🌇 مساءً" :
    "🌙 ليلًا";

  // جلب بيانات المجموعة واسم المستخدم
  const threadData = global.data.threadData.get(threadID) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "غادر بنفسه" : "تمت إزالته";

  // الرسالة الافتراضية المزخرفة
  let msg = typeof threadData.customLeave === "undefined"
    ? `╭───────────────╮\n` +
      ` 🙋‍♂️ إشعار مغادرة عضو\n` +
      `╰───────────────╯\n\n` +
      `👤 الاسم: ✨ ${name} ✨\n` +
      `📤 الحالة: ${type}\n` +
      `🕒 الوقت: ${time}\n` +
      `📆 الفترة: ${session}\n\n` +
      `💌 نتمنى أن تتذكر دائمًا الأوقات الجميلة هنا.\n` +
      `🔕 لا تتبع طريقه إذا كان على خطأ.\n\n` +
      `🕌 لنبقَ متحدين في هذه المجموعة الإسلامية 💙`
    : threadData.customLeave;

  // استبدال العناصر في الرسالة المخصصة
  msg = msg
    .replace(/\{name}/g, name)
    .replace(/\{type}/g, type)
    .replace(/\{time}/g, time)
    .replace(/\{session}/g, session);

  return api.sendMessage({ body: msg }, threadID);
};
