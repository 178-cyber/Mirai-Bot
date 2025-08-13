module.exports.config = {
	name: "طرد",
	version: "1.0.1", 
	hasPermssion: 1,
	credits: "فريق Mirai",
	description: "طرد الشخص الذي تريد إخراجه من المجموعة عن طريق الإشارة (Tag)",
	commandCategory: "أوامر أخرى", 
	usages: "[إشارة]", 
	cooldowns: 0,
};

module.exports.languages = {
	"ar": {
		"error": "حدث خطأ، يرجى المحاولة لاحقًا!",
		"needPermssion": "يجب أن يكون البوت أدمن في المجموعة\nالرجاء منحه الصلاحيات ثم حاول مجددًا!",
		"missingTag": "يجب عليك الإشارة إلى الشخص الذي تريد طرده"
	}
}

module.exports.run = async function({ api, event, getText, Threads }) {
	var mention = Object.keys(event.mentions);
	try {
		let dataThread = (await Threads.getData(event.threadID)).threadInfo;

		// التحقق من أن البوت أدمن
		if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID())) 
			return api.sendMessage(getText("needPermssion"), event.threadID, event.messageID);

		// التحقق من وجود إشارة
		if(!mention[0]) 
			return api.sendMessage(getText("missingTag"), event.threadID);

		// التحقق من أن الشخص الذي ينفذ الأمر أدمن
		if (dataThread.adminIDs.some(item => item.id == event.senderID)) {
			for (const o in mention) {
				setTimeout(() => {
					api.removeUserFromGroup(mention[o], event.threadID);
				}, 3000);
			}
		}
	}
	catch (e) {
		api.sendMessage(getText("error"), event.threadID, event.messageID);
	}
}
