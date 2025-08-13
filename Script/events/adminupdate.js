module.exports.config = {
	name: "adminUpdate",
	eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname"],
	version: "1.0.1",
	credits: "Mirai Team - Arabic by ChatGPT",
	description: "تحديث معلومات المجموعة بسرعة",
    envConfig: {
        autoUnsend: true,
        sendNoti: true,
        timeToUnsend: 10
    }
};

module.exports.run = async function ({ event, api, Threads }) { 
    const { threadID, logMessageType, logMessageData } = event;
    const { setData, getData } = Threads;

    try {
        let dataThread = (await getData(threadID)).threadInfo;
        switch (logMessageType) {

            case "log:thread-admins": {
                // إضافة أدمن
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
                    if (global.configModule[this.config.name].sendNoti) 
                        api.sendMessage(`[ تحديث المجموعة ] 🎉 تم إضافة أدمن جديد: ${logMessageData.TARGET_ID}`, threadID, async (error, info) => {
                            if (global.configModule[this.config.name].autoUnsend) {
                                await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                                return api.unsendMessage(info.messageID);
                            }
                        });
                }
                // إزالة أدمن
                else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                    if (global.configModule[this.config.name].sendNoti) 
                        api.sendMessage(`[ تحديث المجموعة ] ❌ تمت إزالة الأدمن: ${logMessageData.TARGET_ID}`, threadID, async (error, info) => {
                            if (global.configModule[this.config.name].autoUnsend) {
                                await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                                return api.unsendMessage(info.messageID);
                            }
                        });
                }
                break;
            }

            case "log:user-nickname": {
                // تغيير اللقب
                dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
                if (typeof global.configModule["nickname"] != "undefined" && 
                    !global.configModule["nickname"].allowChange.includes(threadID) && 
                    !dataThread.adminIDs.some(item => item.id == event.author) || 
                    event.author == api.getCurrentUserID()) return;

                if (global.configModule[this.config.name].sendNoti) 
                    api.sendMessage(`[ تحديث المجموعة ] ✏️ قام ${logMessageData.participant_id} بتغيير اللقب إلى: ${(logMessageData.nickname.length == 0) ? "الاسم الأصلي" : logMessageData.nickname}`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        }
                    });
                break;
            }

            case "log:thread-name": {
                // تغيير اسم المجموعة
                dataThread.threadName = event.logMessageData.name || "بدون اسم";
                if (global.configModule[this.config.name].sendNoti) 
                    api.sendMessage(`[ تحديث المجموعة ] 📛 تم تغيير اسم المجموعة إلى: ${dataThread.threadName}`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        }
                    });
                break;
            }
        }
        await setData(threadID, { threadInfo: dataThread });
    } catch (e) { 
        console.log(e);
    }
};
