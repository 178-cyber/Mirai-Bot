module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "MIRAI-BOT",
  description: "إشعار عند دخول البوت أو الأشخاص للمجموعة بدون وسائط"
};

module.exports.onLoad = () => {}; // لم يعد هناك حاجة لكاش الصور المتحركة/الفيديو

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  // إذا قام شخص بإضافة البوت إلى المجموعة
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "MIRAI-BOT-LOVER"}`, threadID, api.getCurrentUserID());
    return api.sendMessage(
      `╭╭•┄┅═══❁🌺❁═══┅┄•╮\n🖤 السلام عليكم 🖤\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n┏━━━━━━━━━━━━━━━━━┓\n┃ 🤗 شكرًا جزيلًا  ┃\n┃ لإضافتي إلى     ┃\n┃ 🫶 عائلتكم في المجموعة! ┃\n┗━━━━━━━━━━━━━━━━━┛\n\n📿 *إن شاء الله سأكون دائمًا في خدمتكم.*\n🌸 *بالمعاملة الجيدة ستحصلون على خدمة أفضل.*\n\n╭─🎯 𝐔𝐒𝐄𝐅𝐔𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ─╮\n│ ℹ️ ${global.config.PREFIX}info – معلومات عن البوت  \n│ 💬 ${global.config.PREFIX}jan – التحدث مع الذكاء الاصطناعي  \n│ ⏱️ ${global.config.PREFIX}uptime – عرض مدة تشغيل البوت  \n╰────────────────────────╯\n\n🔧 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : *MIRAI-BOT*\n🧑‍💻 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐃 𝐁𝐘 : *Aminul Sordar*\n\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`, 
      threadID
    );
  } else {
    try {
      const { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const nameArray = [];
      const mentions = [];

      for (const p of event.logMessageData.addedParticipants) {
        nameArray.push(p.fullName);
        mentions.push({ tag: p.fullName, id: p.userFbId });
      }

      const memberCount = participantIDs.length;
      let msg = threadData.customJoin || 
`╭•┄┅═══❁🌺❁═══┅┄•╮\n   السلام عليكم 🖤\n╰•┄┅═══❁🌺❁═══┅┄•╯ \n\n✨🆆🅴🅻🅻 🅲🅾🅼🅴 ✨\n\n❥ العضو الجديد : {name}\n\n🌸 مرحبًا بك في مجموعتنا –\n{threadName} –!\n\nأنت الآن العضو رقم {soThanhVien} 🥰\n\n╭•┄┅═══❁🌺❁═══┅┄•╮\n     🌸  MIRAI-BOT  🌸\n╰•┄┅═══❁🌺❁═══┅┄•╯`;

      msg = msg
        .replace(/\{name}/g, nameArray.join(', '))
        .replace(/\{soThanhVien}/g, memberCount)
        .replace(/\{threadName}/g, threadName);

      return api.sendMessage({ body: msg, mentions }, threadID);
    } catch (e) {
      console.error("JoinNoti Error:", e);
    }
  }
};
