module.exports.config = {
    name: "log",
    eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
    version: "1.0.0",
    credits: "MIRAI-BOT",
    description: "تسجيل إشعارات نشاط البوت!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;
    var formReport =  "=== إشعار البوت ===" +
                        "\n\n» معرف المجموعة: " + event.threadID +
                        "\n» العملية: {task}" +
                        "\n» العملية أنشأها معرف المستخدم: " + event.author +
                        "\n» " + Date.now() +" «",
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "الاسم غير موجود",
                  newName = event.logMessageData.name || "الاسم غير موجود";
            task = "قام المستخدم بتغيير اسم المجموعة من: '" + oldName + "' إلى '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) 
                task = "قام المستخدم بإضافة البوت إلى مجموعة جديدة!";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) 
                task = "قام المستخدم بطرد البوت من المجموعة!";
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport.replace(/\{task}/g, task);

    var god = "61567181097397";

    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger(formReport, "[ حدث التسجيل ]");
    });
}
