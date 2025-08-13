module.exports.config = {
	name: "الرتبة",
	version: "1.0.3",
	hasPermission: 0,
	credits: "CataliCS",
	description: "عرض رتبتك الحالية على نظام البوت، إعادة تصميم بطاقة الرتبة من canvacord",
	commandCategory: "النظام",
	cooldowns: 20,
	dependencies: {
		"fs-extra": "",
		"path": "",
		"jimp": "",
		"node-superfetch": "",
		"canvas": "",
		"@miraipr0ject/assets": ""
	},
	envConfig: {
		APIKEY: "571752207151901|AC-zG86sv6U6kpnT0_snIHBOHJc"
	}
};

module.exports.makeRankCard = async function(data) {
	console.log("🔄 بدء إنشاء بطاقة الرتبة...");
	
	try {
		const fs = global.nodemodule["fs-extra"];
		const path = global.nodemodule["path"];
		const Canvas = global.nodemodule["canvas"];
		const request = global.nodemodule["node-superfetch"];
		
		// التحقق من وجود المجلدات المطلوبة
		const __root = path.resolve(__dirname, "cache");
		if (!fs.existsSync(__root)) {
			console.log("📁 إنشاء مجلد cache...");
			fs.mkdirSync(__root, { recursive: true });
		}
		
		const PI = Math.PI;
		const { id, name, rank, level, expCurrent, expNextLevel } = data;
		
		console.log("📊 بيانات المستخدم:", { id, name, rank, level, expCurrent, expNextLevel });

		// التحقق من وجود الخطوط
		let regularFont, boldFont;
		try {
			regularFont = await global.utils.assets.font("REGULAR-FONT");
			boldFont = await global.utils.assets.font("BOLD-FONT");
			console.log("✅ تم تحميل الخطوط بنجاح");
		} catch (fontError) {
			console.log("⚠️ خطأ في تحميل الخطوط:", fontError.message);
			// استخدام خط افتراضي
			regularFont = null;
			boldFont = null;
		}

		if (regularFont && boldFont) {
			Canvas.registerFont(regularFont, {
				family: "Manrope",
				weight: "regular",
				style: "normal"
			});
			Canvas.registerFont(boldFont, {
				family: "Manrope",
				weight: "bold",
				style: "normal"
			});
		}

		// التحقق من وجود صورة البطاقة
		let rankCard;
		try {
			rankCard = await Canvas.loadImage(await global.utils.assets.image("RANKCARD"));
			console.log("✅ تم تحميل صورة البطاقة بنجاح");
		} catch (cardError) {
			console.log("⚠️ خطأ في تحميل صورة البطاقة:", cardError.message);
			// إنشاء بطاقة بسيطة كبديل
			const canvas = Canvas.createCanvas(934, 282);
			const ctx = canvas.getContext("2d");
			ctx.fillStyle = "#7289DA";
			ctx.fillRect(0, 0, 934, 282);
			rankCard = canvas;
		}

		const pathImg = __root + `/rank_${id}.png`;
		
		var expWidth = (expCurrent * 615) / expNextLevel;
		if (expWidth > 615 - 18.5) expWidth = 615 - 18.5;
		
		// تحميل صورة الملف الشخصي
		let avatar;
		try {
			console.log("🖼️ تحميل صورة الملف الشخصي...");
			let avatarResponse = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${global.configModule[module.exports.config.name].APIKEY}`);
			avatar = await module.exports.circle(avatarResponse.body);
			console.log("✅ تم تحميل الصورة الشخصية بنجاح");
		} catch (avatarError) {
			console.log("⚠️ خطأ في تحميل الصورة الشخصية:", avatarError.message);
			// إنشاء دائرة بسيطة كبديل
			const avatarCanvas = Canvas.createCanvas(180, 180);
			const avatarCtx = avatarCanvas.getContext("2d");
			avatarCtx.fillStyle = "#36393f";
			avatarCtx.beginPath();
			avatarCtx.arc(90, 90, 90, 0, 2 * PI);
			avatarCtx.fill();
			avatar = avatarCanvas.toBuffer();
		}

		const canvas = Canvas.createCanvas(934, 282);
		const ctx = canvas.getContext("2d");

		// رسم البطاقة
		if (rankCard.toBuffer) {
			// إذا كانت rankCard هي canvas
			ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
		} else {
			// إذا كانت صورة عادية
			ctx.drawImage(rankCard, 0, 0, canvas.width, canvas.height);
		}
		
		ctx.drawImage(await Canvas.loadImage(avatar), 45, 50, 180, 180);

		// استخدام خط افتراضي إذا لم تعمل الخطوط المخصصة
		const fontFamily = regularFont && boldFont ? "Manrope" : "Arial";

		ctx.font = `bold 36px ${fontFamily}`;
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "start";
		ctx.fillText(name, 270, 164);

		ctx.font = `bold 32px ${fontFamily}`;
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "end";
		ctx.fillText(level, 934 - 55, 82);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("Lv.", 934 - 55 - ctx.measureText(level).width - 10, 82);

		ctx.font = `bold 32px ${fontFamily}`;
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "end";
		ctx.fillText(rank, 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 25, 82);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("#", 934 - 55 - ctx.measureText(level).width - 16 - ctx.measureText(`Lv.`).width - 16 - ctx.measureText(rank).width - 16, 82);

		ctx.font = `bold 26px ${fontFamily}`;
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "start";
		ctx.fillText("/ " + expNextLevel, 710 + ctx.measureText(expCurrent).width + 10, 164);
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText(expCurrent, 710, 164);

		// رسم شريط التقدم
		ctx.beginPath();
		ctx.fillStyle = "#4283FF";
		ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * PI, 0.5 * PI, true);
		ctx.fill();
		ctx.fillRect(257 + 18.5, 147.5 + 36.25, expWidth, 37.5);
		ctx.arc(257 + 18.5 + expWidth, 147.5 + 18.5 + 36.25, 18.75, 1.5 * PI, 0.5 * PI, false);
		ctx.fill();

		const imageBuffer = canvas.toBuffer();
		fs.writeFileSync(pathImg, imageBuffer);
		console.log("✅ تم حفظ بطاقة الرتبة بنجاح في:", pathImg);
		return pathImg;
		
	} catch (error) {
		console.error("❌ خطأ في إنشاء بطاقة الرتبة:", error);
		throw error;
	}
}

module.exports.circle = async (image) => {
	try {
		const jimp = global.nodemodule["jimp"];
		image = await jimp.read(image);
		image.circle();
		return await image.getBufferAsync("image/png");
	} catch (error) {
		console.error("❌ خطأ في تدوير الصورة:", error);
		throw error;
	}
}

module.exports.expToLevel = (point) => {
	if (point < 0) return 0;
	return Math.floor((Math.sqrt(1 + (4 * point) / 3) + 1) / 2);
}

module.exports.levelToExp = (level) => {
	if (level <= 0) return 0;
	return 3 * level * (level - 1);
}

module.exports.getInfo = async function(uid, Currencies) {
	try {
		console.log("📊 جلب معلومات المستخدم:", uid);
		let userData = await Currencies.getData(uid);
		console.log("📊 بيانات العملة:", userData);
		
		let point = userData.exp || 0;
		const level = module.exports.expToLevel(point);
		const expCurrent = point - module.exports.levelToExp(level);
		const expNextLevel = module.exports.levelToExp(level + 1) - module.exports.levelToExp(level);
		
		console.log("📊 معلومات المستوى:", { level, expCurrent, expNextLevel, totalExp: point });
		return { level, expCurrent, expNextLevel };
	} catch (error) {
		console.error("❌ خطأ في جلب معلومات المستخدم:", error);
		throw error;
	}
}

module.exports.languages = {
	"vi": {
		"userNotExist": "أنت غير موجود حالياً في قاعدة البيانات، لذا لا يمكنك رؤية رتبتك. الرجاء المحاولة مرة أخرى بعد 5 ثوانٍ."
	},
	"en": {
		"userNotExist": "أنت غير موجود حالياً في قاعدة البيانات، لذا لا يمكنك رؤية رتبتك. الرجاء المحاولة مرة أخرى بعد 5 ثوانٍ."
	}
}

module.exports.run = async function({ event, api, Currencies, Users, getText }) {
	console.log("🚀 تم استدعاء أمر الرتبة بواسطة:", event.senderID);
	
	try {
		// التحقق من وجود المكتبات المطلوبة
		const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
		
		if (!Currencies) {
			console.error("❌ Currencies غير متوفر");
			return api.sendMessage("خطأ: نظام العملات غير متوفر حالياً.", event.threadID, event.messageID);
		}
		
		if (!Users) {
			console.error("❌ Users غير متوفر");
			return api.sendMessage("خطأ: نظام المستخدمين غير متوفر حالياً.", event.threadID, event.messageID);
		}

		console.log("📊 جلب جميع بيانات المستخدمين...");
		let dataAll = await Currencies.getAll(["userID", "exp"]);
		console.log("📊 عدد المستخدمين في قاعدة البيانات:", dataAll.length);

		if (!dataAll || dataAll.length === 0) {
			console.log("⚠️ قاعدة البيانات فارغة");
			return api.sendMessage("قاعدة البيانات فارغة حالياً. لا توجد بيانات متوفرة.", event.threadID, event.messageID);
		}

		dataAll.sort(function (a, b) { return b.exp - a.exp });

		const rank = dataAll.findIndex(item => parseInt(item.userID) == parseInt(event.senderID)) + 1;
		console.log("🏆 رتبة المستخدم:", rank);
		
		if (rank == 0) {
			console.log("⚠️ المستخدم غير موجود في قاعدة البيانات");
			return api.sendMessage(getText("userNotExist"), event.threadID, event.messageID);
		}
		
		console.log("👤 جلب اسم المستخدم...");
		const name = await Users.getNameUser(event.senderID);
		console.log("👤 اسم المستخدم:", name);
		
		console.log("📊 جلب معلومات النقاط...");
		const point = await module.exports.getInfo(event.senderID, Currencies);
		
		const timeStart = Date.now();
		console.log("🎨 بدء إنشاء بطاقة الرتبة...");
		
		let pathRankCard = await module.exports.makeRankCard({ 
			id: event.senderID, 
			name, 
			rank, 
			...point 
		});
		
		const timeTaken = Date.now() - timeStart;
		console.log(`⏱️ تم إنشاء البطاقة في ${timeTaken}ms`);
		
		console.log("📤 إرسال البطاقة...");
		return api.sendMessage({
			body: `🏆 رتبتك: #${rank}\n⏱️ وقت الإنشاء: ${timeTaken}ms`, 
			attachment: createReadStream(pathRankCard, {'highWaterMark': 128 * 1024}) 
		}, event.threadID, () => {
			console.log("🗑️ حذف الملف المؤقت");
			unlinkSync(pathRankCard);
		}, event.messageID);
		
	} catch (error) {
		console.error("❌ خطأ عام في أمر الرتبة:", error);
		console.error("Stack trace:", error.stack);
		return api.sendMessage(`❌ حدث خطأ: ${error.message}\n\nيرجى التحقق من console للمزيد من التفاصيل.`, event.threadID, event.messageID);
	}
}
