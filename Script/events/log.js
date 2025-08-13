module.exports.config = {
	name: "log",
	eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
	version: "1.0.0",
	credits: "MIRAI-BOT - ترجمة عربية",
	description: "تسجيل إشعارات أنشطة البوت!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;
    
    var formReport =  "=== إشعار من البوت ===" +
                        "\n\n» رقم المجموعة (Thread ID): " + event.threadID +
                        "\n» العملية: {task}" +
                        "\n» تمت بواسطة (User ID): " + event.author +
                        "\n» " + Date.now() + " «",
        task = "";
    
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "لا يوجد اسم سابق",
                  newName = event.logMessageData.name || "لا يوجد اسم جديد";
            task = "قام المستخدم بتغيير اسم المجموعة من: '" + oldName + "' إلى '" + newName + "'";
            await Threads.setData(event.threadID, { name: newName });
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) 
                task = "قام مستخدم بإضافة البوت إلى مجموعة جديدة!";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) 
                task = "قام مستخدم بطرد البوت من المجموعة!";
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport.replace(/\{task}/g, task);

    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger(formReport, "[ تسجيل حدث ]");
    });
}
