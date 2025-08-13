module.exports.config = {
	name: "ترقية_المستوى",
	version: "1.0.1",
	hasPermssion: 1,
	credits: "فريق Mirai",
	description: "إشعار بالترقية في المستوى لكل مجموعة أو مستخدم",
	commandCategory: "النظام",
	dependencies: {
		"fs-extra": ""
	},
	cooldowns: 5,
	envConfig: {
		autoUnsend: true,
		unsendMessageAfter: 5
	}
};

module.exports.handleEvent = async function({ api, event, Currencies, Users, getText }) {
	var {threadID, senderID } = event;
	const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];

	threadID = String(threadID);
	senderID = String(senderID);

	const thread = global.data.threadData.get(threadID) || {};

	let exp = (await Currencies.getData(senderID)).exp;
	exp = exp += 1;

	if (isNaN(exp)) return;

	if (typeof thread["rankup"] != "undefined" && thread["rankup"] == false) {
		await Currencies.setData(senderID, { exp });
		return;
	};

	const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
	const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

	if (level > curLevel && level != 1) {
		const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
		var messsage = (typeof thread.customRankup == "undefined") ? msg = getText("levelup") : msg = thread.customRankup,
			arrayContent;

		messsage = messsage
			.replace(/\{name}/g, name)
			.replace(/\{level}/g, level);
			
		if (existsSync(__dirname + "/cache/rankup/")) mkdirSync(__dirname + "/cache/rankup/", { recursive: true });
		if (existsSync(__dirname + `/cache/rankup/${event.threadID}.gif`)) arrayContent = { body: messsage, attachment: createReadStream(__dirname + `/cache/rankup/${event.threadID}.gif`), mentions: [{ tag: name, id: senderID }] };
		else arrayContent = { body: messsage, mentions: [{ tag: name, id: senderID }] };
		const moduleName = this.config.name;
		api.sendMessage(arrayContent, threadID, async function (error, info){
			if (global.configModule[moduleName].autoUnsend) {
				await new Promise(resolve => setTimeout(resolve, global.configModule[moduleName].unsendMessageAfter * 1000));
				return api.unsendMessage(info.messageID);
			} else return;
		});
	}

	await Currencies.setData(senderID, { exp });
	return;
}

module.exports.languages = {
	"vi": {
		"on": "تشغيل",
		"off": "إيقاف",
		"successText": "تم تفعيل إشعارات الترقية بنجاح!",
		"levelup": "مستوى الكتابة لدى {name} وصل إلى المستوى {level}"
	},
	"en": {
		"on": "تشغيل",
		"off": "إيقاف",
		"successText": "تم تفعيل إشعارات الترقية بنجاح!",
		"levelup": "يا {name}، لقد وصل مستواك إلى المستوى {level}"
	}
}

module.exports.run = async function({ api, event, Threads, getText }) {
	const { threadID, messageID } = event;
	let data = (await Threads.getData(threadID)).data;
	
	if (typeof data["rankup"] == "undefined" || data["rankup"] == false) data["rankup"] = true;
	else data["rankup"] = false;
	
	await Threads.setData(threadID, { data });
	global.data.threadData.set(threadID, data);
	return api.sendMessage(`${(data["rankup"] == true) ? getText("on") : getText("off")} ${getText("successText")}`, threadID, messageID);
}
