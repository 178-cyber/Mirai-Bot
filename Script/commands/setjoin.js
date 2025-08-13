module.exports.config = {
    name: "ترحيب",
    version: "1.0.4",
    hasPermssion: 1,
    credits: "فريق Mirai",
    description: "تعديل نص/صورة متحركة عند انضمام عضو جديد",
    commandCategory: "الإعدادات",
    usages: "[gif/نص] [النص أو رابط تحميل صورة gif]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "..", "events", "cache", "joinGif");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    return;
}

module.exports.languages = {
    "vi": {
        "savedConfig": "تم حفظ إعداداتك بنجاح! فيما يلي المعاينة:",
        "tagMember": "[اسم العضو]",
        "tagType": "[أنت/أنتم]",
        "tagCountMember": "[عدد الأعضاء]",
        "tagNameGroup": "[اسم المجموعة]",
        "gifPathNotExist": "مجموعتك لم تقم بتعيين صورة gif للترحيب من قبل",
        "removeGifSuccess": "تمت إزالة ملف gif الخاص بمجموعتك بنجاح!",
        "invaildURL": "الرابط الذي أدخلته غير صالح!",
        "internetError": "تعذر تحميل الملف لأن الرابط غير موجود أو هناك مشكلة في الاتصال بالإنترنت!",
        "saveGifSuccess": "تم حفظ ملف gif الخاص بمجموعتك بنجاح، فيما يلي المعاينة:"
    },
    "en": {
        "savedConfig": "تم حفظ إعداداتك، هذه هي المعاينة:",
        "tagMember": "[اسم العضو]",
        "tagType": "[أنت/أنتم]",
        "tagCountMember": "[عدد الأعضاء]",
        "tagNameGroup": "[اسم المجموعة]",
        "gifPathNotExist":"مجموعتك لم تقم بتعيين صورة gif للترحيب",
        "removeGifSuccess": "تمت إزالة صورة gif الخاصة بالمجموعة!",
        "invaildURL": "رابط غير صالح!",
        "internetError": "تعذر تحميل الملف لأن الرابط غير موجود أو هناك مشكلة في الإنترنت!",
        "saveGifSuccess": "تم حفظ ملف gif، هذه هي المعاينة:"
    }
}

module.exports.run = async function ({ args, event, api, Threads, getText }) {
    try {
        const { existsSync, createReadStream } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];
        const { threadID, messageID } = event;
        const msg = args.slice(1, args.length).join(" ");
        var data = (await Threads.getData(threadID)).data;

        switch (args[0]) {
            case "text": {
                data["customJoin"] = msg;
                global.data.threadData.set(parseInt(threadID), data);
                await Threads.setData(threadID, { data });
                return api.sendMessage(getText("savedConfig"), threadID, function () {
                    const body = msg
                    .replace(/\{name}/g, getText("tagMember"))
                    .replace(/\{type}/g, getText("tagType"))
                    .replace(/\{soThanhVien}/g, getText("tagCountMember"))
                    .replace(/\{threadName}/g, getText("tagNameGroup"));
                    return api.sendMessage(body, threadID);
                });
            }
            case "gif": {
                const path = join(__dirname, "..", "events", "cache", "joinGif");
                const pathGif = join(path, `${threadID}.gif`);
                if (msg == "remove") {
                    if (!existsSync(pathGif)) return api.sendMessage(getText("gifPathNotExist"), threadID, messageID);
                    unlinkSync(pathGif);
                    return api.sendMessage(getText("removeGifSuccess"), threadID, messageID);
                }
                else {
                    if (!msg.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:gif|GIF)/g)) return api.sendMessage(getText("invaildURL"), threadID, messageID);
                    try {
                        await global.utils.downloadFile(msg, pathGif);
                    } catch (e) { return api.sendMessage(getText("internetError"), threadID, messageID); }
                    return api.sendMessage({ body: getText("saveGifSuccess"), attachment: createReadStream(pathGif) }, threadID, messageID);
                }
            }
            default: { return global.utils.throwError(this.config.name, threadID, messageID) }
        }
    } catch (e) { return console.log(e) };
}
