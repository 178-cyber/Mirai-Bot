module.exports.config = {
  name: 'مجموعات',
  version: '1.0.0',
  credits: 'فريق Mirai',
  hasPermssion: 2,
  description: 'عرض قائمة المجموعات التي انضم إليها البوت',
  commandCategory: 'النظام',
  usages: 'قائمة_المجموعات',
  cooldowns: 15
};

module.exports.handleReply = async function({ api, event, Threads, handleReply }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  const args = event.body.trim().split(/\s+/);
  const action = args[0].toLowerCase();
  const index = parseInt(args[1]);

  if (isNaN(index) || index < 1 || index > handleReply.groupid.length)
    return api.sendMessage('❌ رقم غير صالح.', event.threadID, event.messageID);

  const threadID = handleReply.groupid[index - 1];

  switch (handleReply.type) {
    case 'reply': {
      if (action === 'ban') {
        const threadData = (await Threads.getData(threadID)).data || {};
        threadData.banned = 1;
        await Threads.setData(threadID, { data: threadData });
        global.data.threadBanned.set(parseInt(threadID), 1);
        return api.sendMessage(`✅ تم حظر المجموعة [${threadID}]!`, event.threadID, event.messageID);
      }

      if (action === 'out') {
        try {
          await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
          const { name } = await Threads.getData(threadID);
          return api.sendMessage(`✅ تم الخروج من المجموعة: ${name || 'غير معروف'}\n🧩 معرف المجموعة: ${threadID}`, event.threadID, event.messageID);
        } catch (err) {
          return api.sendMessage(`❌ فشل الخروج من المجموعة [${threadID}]: ${err.message}`, event.threadID, event.messageID);
        }
      }

      return api.sendMessage('❌ أمر غير معروف. استخدم "ban" أو "out".', event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function({ api, event, Threads }) {
  const inbox = await api.getThreadList(100, null, ['INBOX']);
  const groups = inbox.filter(thread => thread.isSubscribed && thread.isGroup);
  const resultList = [];

  for (const thread of groups) {
    const threadInfo = await api.getThreadInfo(thread.threadID);
    resultList.push({
      id: thread.threadID,
      name: thread.name || 'مجموعة بدون اسم',
      memberCount: threadInfo.userInfo.length
    });
  }

  resultList.sort((a, b) => b.memberCount - a.memberCount);

  let msg = '📦 قائمة المجموعات التي يتواجد فيها البوت:\n\n';
  const groupid = [];

  resultList.forEach((group, index) => {
    msg += `${index + 1}. ${group.name}\n🧩 معرف المجموعة: ${group.id}\n👥 عدد الأعضاء: ${group.memberCount}\n\n`;
    groupid.push(group.id);
  });

  msg += '💬 قم بالرد بـ:\n👉 "out <الرقم>" للخروج من المجموعة\n👉 "ban <الرقم>" لحظر المجموعة';

  api.sendMessage(msg, event.threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: module.exports.config.name,
      author: event.senderID,
      messageID: info.messageID,
      groupid,
      type: 'reply'
    });
  });
};

module.exports.languages = {
  ar: {
    // يمكن إضافة الردود العربية هنا إذا لزم الأمر
  },
  en: {
    // يمكن إضافة الردود الإنجليزية هنا إذا لزم الأمر
  },
  vi: {
    // يمكن إضافة الردود الفيتنامية هنا إذا لزم الأمر
  },
  bn: {
    // يمكن إضافة الردود البنغالية هنا إذا لزم الأمر
  }
};
