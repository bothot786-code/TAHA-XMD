const yts = require('yt-search');
const axios = require('axios');

async function playCommand(sock, chatId, message) {
    try {
        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || '';

        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            return await sock.sendMessage(chatId, {
                text: "*What song do you want to download?*"
            });
        }

        const { videos } = await yts(searchQuery);

        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, {
                text: "*No songs found!*"
            });
        }

        const video = videos[0];

        await sock.sendMessage(chatId, {
            text: "*🎵 Please wait, your download is being prepared...*"
        });

        const { data } = await axios.get(
            `https://eliteprotech-apis.zone.id/youtdl?url=${encodeURIComponent(video.url)}&type=mp3`
        );

        if (!data?.status || !data?.result) {
            return await sock.sendMessage(chatId, {
                text: "*Failed to get audio download link.*"
            });
        }

        await sock.sendMessage(
            chatId,
            {
                audio: { url: data.result },
                mimetype: "audio/mpeg",
                fileName: `${video.title}.mp3`,
                ptt: false
            },
            { quoted: message }
        );

    } catch (error) {
        console.error('Error in play command:', error);

        await sock.sendMessage(chatId, {
            text: "*❌ Download failed. Please try again later.*"
        });
    }
}

module.exports = playCommand;