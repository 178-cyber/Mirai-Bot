module.exports.config = {
	name: "uptime",
	version: "1.0.3",
	hasPermssion: 0,
	credits: "Mirai Team - Modified by AminulSordar",
	description: "Kiểm tra thời gian bot đã online",
	commandCategory: "system",
	cooldowns: 5,
	dependencies: {
		"pidusage": ""
	}
};

function byte2mb(bytes) {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	let l = 0, n = parseInt(bytes, 10) || 0;
	while (n >= 1024 && ++l) n = n / 1024;
	return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

function formatDuration(seconds) {
	const months = Math.floor(seconds / (30 * 24 * 60 * 60));
	const days = Math.floor((seconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
	const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
	const minutes = Math.floor((seconds % (60 * 60)) / 60);
	const sec = Math.floor(seconds % 60);
	return { months, days, hours, minutes, seconds: sec };
}

module.exports.languages = {
	"vi": {
		"returnResult": "🤖 Bot đã hoạt động:\n⏳ %1 tháng %2 ngày %3 giờ %4 phút %5 giây\n\n👥 Người dùng: %6\n💬 Nhóm: %7\n⚙️ CPU: %8%\n🧠 RAM: %9\n📶 Ping: %10ms\n\n✨Bot được làm bởi Mirai Team"
	},
	"en": {
		"returnResult": "🤖 Bot has been running for:\n⏳ %1 month(s) %2 day(s) %3 hour(s) %4 minute(s) %5 second(s)\n\n👥 Users: %6\n💬 Threads: %7\n⚙️ CPU: %8%\n🧠 RAM: %9\n📶 Ping: %10ms\n\n✨This bot was made by Mirai Team"
	}
};

module.exports.run = async ({ api, event, getText }) => {
	const time = process.uptime(); // in seconds
	const { months, days, hours, minutes, seconds } = formatDuration(time);

	const pidusage = await global.nodemodule["pidusage"](process.pid);
	const timeStart = Date.now();

	return api.sendMessage("", event.threadID, () => {
		const message = getText(
			"returnResult",
			months, days, hours, minutes, seconds,
			global.data.allUserID.length,
			global.data.allThreadID.length,
			pidusage.cpu.toFixed(1),
			byte2mb(pidusage.memory),
			Date.now() - timeStart
		);
		api.sendMessage(message, event.threadID, event.messageID);
	});
};
