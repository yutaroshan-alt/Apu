const axios = require("axios");

const FOLDER_ID = "1tAVD0EmmUBKGpQIgV7gfdJ0UlrnxMdLJ";

module.exports.config = {
    name: "owner",
    aliases: ["admin", "info"],
    version: "1.0.0",
    author: "su baru☠️✌🏼",
    role: 0,
    category: "info",
    guide: { en: "Use {p}owner to view owner info and MLBB account details." }
};

module.exports.onStart = async ({ api, event }) => {
    const { threadID, messageID } = event;

    try {
        // Emoji set reaction
        api.setMessageReaction("⚡", messageID, () => {}, true);

        // Fetching drive media
        const response = await axios.get(`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}`).catch(async () => {
            return await axios.get(`https://docs.google.com/uc?export=list&id=${FOLDER_ID}`);
        });

        const htmlData = response.data;
        const matches = [...htmlData.matchAll(/"([^"]+)"\s*,\s*\[\s*"([^"]+)"\s*,\s*([0-9]+)\s*,\s*"([^"]+)"/g)];
        
        let fileId = "";

        if (!matches || matches.length === 0) {
            const fallbackMatches = [...htmlData.matchAll(/\/file\/d\/([a-zA-Z0-9_-]+)\/view/g)];
            if (fallbackMatches && fallbackMatches.length > 0) {
                fileId = fallbackMatches[Math.floor(Math.random() * fallbackMatches.length)][1];
            }
        } else {
            const randomMatch = matches[Math.floor(Math.random() * matches.length)];
            fileId = randomMatch[1]; 
        }

        const caption = 
`⚡ ━Owner Info━ ⚡

👑 𝖭𝖺𝗆𝖾 : Su baru☠️✌🏼
📌 𝖱𝗈𝗅𝖾 : 𝖠𝖽𝗆𝗂𝗇 / 𝖮𝗐𝗇𝖾𝗋
🤦‍♂️ Age  : 22+
💔 𝖡𝗂𝗈 : 𝖲𝗂𝗇𝗀𝗅𝖾 ⚡

🎮 ━━ Mlbb Info ━━🎮
☎️No.       : Fuck you 😒 
🌍Adress.   :Nepal 🇳🇵 
🗨️ Messenger:61592422092604

 ⚡ ━━━━━━━━━━━━━━━━━━━━ ⚡`;

        if (fileId) {
            const downloadUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;
            return api.sendMessage({
                body: caption,
                attachment: [await global.utils.getStreamFromURL(downloadUrl)]
            }, threadID, messageID);
        } else {
            return api.sendMessage(caption, threadID, messageID);
        }

    } catch (err) {
        console.error(err);
        return api.sendMessage("⚡ Error loading owner info!", threadID, messageID);
    }
};

