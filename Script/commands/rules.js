module.exports.config = {
  name: "rules",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐈𝐬𝐥𝐚𝐦𝐢𝐤 𝐂𝐲𝐛𝐞𝐫",
  description: "Important group rules and regulations",
  commandCategory: "info",
  usages: "rules",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.languages = {
  en: {
    title: "Islamic Group Rules",
    description: "Send the group rules in English."
  },
  vi: {
    title: "Nội quy nhóm Hồi giáo",
    description: "Gửi các quy tắc nhóm bằng tiếng Việt."
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const rulesText = `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
•—»✨আসসালামু আলাইকুম🖤💫

•—»✨ এটি একটি ইসলামিক গ্রুপ এবং আমি একটি ইসলামিক রোবোট🤖🕋
আর এই ইসলামিক গ্রুপ এর কিছু নিয়ম কানুন আছে যা হয় তো বা এই গ্রুপ এর অনেক এর জানা নেই তাই 
আমি নিচে পয়েন্ট আকারে সেই নিয়ম গুলি আপনাদের জানিয়ে দিলাম - আসা করি কেও নিওম বঙ্গ করবেন নাহ - তা না হলে গ্রুপ থেকে বেরিয়ে যেতে পড়েন না হলে - আপনাকে গ্রুপ থেকে বের করে দেওয়া হবে-!!

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

🕋 ｢১｣ খারাপ ভাষা নিষেধ❌  
🕋 ｢২｣ পর্ণ বা বাজে কনটেন্ট❌  
🕋 ｢৩｣ আল্লাহর শুকরিয়া এবং সম্মান✅  
🕋 ｢৪｣ কাউকে ছোট করে কথা বলা ❌  
🕋 ｢৫｣ ইসলাম ছাড়া অন্য কিছু নয়❌  
🕋 ｢৬｣ এডমিনকে সম্মান দিন✅  
🕋 ｢৭｣ বট ফাইল দরকার হলে ইনবক্স✅  
🕋 ｢৮｣ ঝগড়া নিষেধ ❌  
🕋 ｢৯｣ অন্য রোবট নিষিদ্ধ❌  
🕋 ｢১০｣ ১৮+ কথা বা ছবি❌  
🕋 ｢১১｣ সকল ধর্মের প্রতি সম্মান ✅  
🕋 ｢১২｣ বারবার এক ইমেজ❌  
🕋 ｢১৩｣ গ্রুপ নাম/ছবি পরিবর্তন ❌  
🕋 ｢১৪｣ স্প্যাম মেসেজ ❌  
🕋 ｢১৫｣ ফিশিং/হ্যাকার লিংক ❌

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

❤️🌸প্রিয় মুসলিম ভাই | বোন, আল্লাহর জন্য গ্রুপ ত্যাগ করো না 🥺💙

৫ ওয়াক্ত নামাজ পড়ো, আল্লাহকে ডাকো 🤲
দোয়া রইলো প্রিয় মেম্বারদের জন্য ❤️🤲

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`;

  const imgLink = "https://i.imgur.com/NuQMY5X.jpeg";
  const imgPath = __dirname + "/cache/rules.jpg";

  const sendMessageWithImage = () => {
    return api.sendMessage(
      {
        body: rulesText,
        attachment: fs.createReadStream(imgPath)
      },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );
  };

  request(encodeURI(imgLink))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => sendMessageWithImage());
};
