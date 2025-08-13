module.exports.config = {
    name: "طرد",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "فريق Mirai",
    description: "حذف الشخص الذي تريد طرده من المجموعة عن طريق الإشارة إليه",
    commandCategory: "أخرى",
    usages: "[إشارة]",
    cooldowns: 0,
};

module.exports.languages = {
    "vi": {
        "error": "حدث خطأ، يرجى المحاولة لاحقًا",
        "needPermssion": "تحتاج إلى صلاحية مشرف المجموعة\nيرجى الإضافة والمحاولة مرة أخرى!",
        "missingTag": "يجب عليك الإشارة إلى الشخص الذي تريد طرده"
    },
    "en": {
        "error": "خطأ! حدث خطأ، يرجى المحاولة لاحقًا!",
        "needPermssion": "تحتاج إلى أن تكون مشرف المجموعة\nيرجى الإضافة والمحاولة مرة أخرى!",
        "missingTag": "يجب عليك الإشارة إلى الشخص الذي تريد طرده"
    }
}

module.exports.run = async function({ api, event, getText, Threads }) {
    var mention = Object.keys(event.mentions);
    try {
        let dataThread = (await Threads.getData(event.threadID)).threadInfo;
        if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID())) 
            return api.sendMessage(getText("needPermssion"), event.threadID, event.messageID);
        if (!mention[0]) 
            return api.sendMessage("يجب عليك الإشارة إلى الشخص الذي تريد طرده", event.threadID);
        if (dataThread.adminIDs.some(item => item.id == event.senderID)) {
            for (const o in mention) {
                setTimeout(() => {
                    api.removeUserFromGroup(mention[o], event.threadID)
                }, 3000)
            }
        }
    } catch (e) {
        return api.sendMessage(getText("error"), event.threadID, event.messageID);
    }
}
