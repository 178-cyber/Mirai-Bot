module.exports.config = {
	name: "اشعار", // إرسال إشعار
	version: "1.0.2",
	hasPermssion: 2, // 2 = صلاحيات الأدمن
	credits: "AMINUL-SORDAR",
	description: "إرسال إعلان من المسؤول",
	commandCategory: "الإدارة",
	usages: "[النص]",
	cooldowns: 5
};
 
module.exports.languages = {
	"ar": {
		"sendSuccess": "✅ تم إرسال الرسالة إلى %1 مجموعة!",
		"sendFail": "❌ لم يتمكن من إرسال الرسالة إلى %1 مجموعة"
	},
	"en": {
		"sendSuccess": "Sent message to %1 thread!",
		"sendFail": "[!] Can't send message to %1 thread"
	}
}
 
module.exports.run = async ({ api, event, args, getText, Users }) => {
	const name = await Users.getNameUser(event.senderID);
	const moment = require("moment-timezone");
	const gio = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:s");

	// إذا كانت الرسالة رد على رسالة تحتوي على مرفق
	if (event.type == "message_reply") {
		const request = global.nodemodule["request"];
		const fs = require('fs');
		const axios = require('axios');

		const getURL = await request.get(event.messageReply.attachments[0].url);
		const pathname = getURL.uri.pathname;
		const ext = pathname.substring(pathname.lastIndexOf(".") + 1);
		const path = __dirname + `/cache/snoti.${ext}`;
		const abc = event.messageReply.attachments[0].url;

		let getdata = (await axios.get(`${abc}`, { responseType: 'arraybuffer' })).data;
		fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));

		var allThread = global.data.allThreadID || [];
		var count = 1, cantSend = [];
		for (const idThread of allThread) {
			if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
			else {
				api.sendMessage({
					body: `${args.join(" ")}\n\n📢 من المسؤول: ${name}`,
					attachment: fs.createReadStream(path)
				}, idThread, (error) => {
					if (error) cantSend.push(idThread);
				});
				count++;
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}

		return api.sendMessage(
			getText("sendSuccess", count),
			event.threadID,
			() => (cantSend.length > 0)
				? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID)
				: "",
			event.messageID
		);
	}

	// إذا لم يكن هناك رد على رسالة
	else {
		var allThread = global.data.allThreadID || [];
		var count = 1, cantSend = [];
		for (const idThread of allThread) {
			if (isNaN(parseInt(idThread)) || idThread == event.threadID) continue;
			else {
				api.sendMessage(
					`${args.join(" ")}\n\n📢 من المسؤول: ${name}`,
					idThread,
					(error) => {
						if (error) cantSend.push(idThread);
					}
				);
				count++;
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}

		return api.sendMessage(
			getText("sendSuccess", count),
			event.threadID,
			() => (cantSend.length > 0)
				? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID)
				: "",
			event.messageID
		);
	}
};
