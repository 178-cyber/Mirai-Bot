const ITEMS_PER_PAGE = 15;

module.exports.config = {
  name: "مساعدة", // اسم الأمر: مساعدة
  version: "2.0.0",
  hasPermssion: 0, // مستوى الصلاحيات: 0 = مستخدم عادي
  credits: "Aminul Sordar", // المبرمج
  description: "📚 عرض جميع الأوامر مع تقسيم الصفحات والتفاصيل", 
  commandCategory: "🛠 النظام",
  usages: "[رقم الصفحة | اسم الأمر]",
  cooldowns: 5 // وقت التهدئة بين الاستخدامات بالثواني
};

module.exports.languages = {
  en: {
    helpList:
      "📖 𝗠𝗘𝗡𝗨 المساعدة (صفحة %1/%2)\n━━━━━━━━━━━━━━━\n%3\n━━━━━━━━━━━━━━━\n📌 عدد الأوامر: %4\n📂 عدد الأحداث: %5\n🧑‍💻 تم الإنشاء بواسطة: Aminul Sordar\n💡 %6",
    moduleInfo:
      "🔹 الأمر: %1\n📖 الوصف: %2\n\n🛠 الاستخدام: %3\n📁 التصنيف: %4\n⏱ وقت التهدئة: %5 ثانية\n🔐 الصلاحيات: %6\n👨‍💻 المبرمج: %7",
    user: "مستخدم 👤",
    adminGroup: "مشرف المجموعة 👮",
    adminBot: "مشرف البوت 🤖"
  }
};

const tips = [
  "جرّب: help uptime لمعرفة كيفية عمله!",
  "استخدم اسم الأمر مثل 'help info'.",
  "هل تريد التحديثات؟ انضم إلى مجموعة دعم AminulBot!",
  "يمكنك تغيير البادئة لكل مجموعة.",
  "استخدم الأوامر بحكمة ولا تقم بالإزعاج.",
  "تحتاج مساعدة في الصور؟ اكتب help photo!"
];

module.exports.run = async function ({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const { commands, events } = global.client;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  // إذا طلب المستخدم مساعدة أمر محدد
  if (args[0] && commands.has(args[0].toLowerCase())) {
    const cmd = commands.get(args[0].toLowerCase());
    const perm =
      cmd.config.hasPermssion === 0
        ? getText("user")
        : cmd.config.hasPermssion === 1
        ? getText("adminGroup")
        : getText("adminBot");

    return api.sendMessage(
      getText(
        "moduleInfo",
        cmd.config.name,
        cmd.config.description,
        `${prefix}${cmd.config.name} ${cmd.config.usages || ""}`,
        cmd.config.commandCategory,
        cmd.config.cooldowns,
        perm,
        cmd.config.credits
      ),
      threadID,
      messageID
    );
  }

  // عرض قائمة الأوامر مع تقسيم الصفحات
  const allCmds = Array.from(commands.values()).map(
    (cmd, i) => `🔹 ${i + 1}. ${cmd.config.name}`
  );
  const totalCmds = allCmds.length;
  const totalEvts = global.client.events.size;
  const totalPages = Math.ceil(totalCmds / ITEMS_PER_PAGE);
  const page = Math.max(1, parseInt(args[0]) || 1);

  if (page > totalPages)
    return api.sendMessage(
      `❌ الصفحة ${page} غير موجودة! عدد الصفحات الكلي: ${totalPages}`,
      threadID,
      messageID
    );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageCmds = allCmds.slice(start, end).join("\n");
  const tip = tips[Math.floor(Math.random() * tips.length)];

  const msg = getText(
    "helpList",
    page,
    totalPages,
    pageCmds,
    totalCmds,
    totalEvts,
    tip
  );

  return api.sendMessage(msg, threadID, messageID);
};
