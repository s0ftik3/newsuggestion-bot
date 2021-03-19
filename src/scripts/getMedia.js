'use strict';

const axios = require('axios');
const config = require('../../config');

module.exports = async (ctx) => {
    try {
        const type = ctx.updateSubTypes[0];
        const isMediaGroup = ctx.update.message.media_group_id;
        if (isMediaGroup !== undefined && ctx.session.mediaGroup !== undefined) {
            if (isMediaGroup === ctx.session.mediaGroup) return 'REPEATED_MEDIA_GROUP';
        }

        ctx.session.mediaGroup = isMediaGroup;

        if (isMediaGroup !== undefined) return 'MEDIA_GROUP_DETECTED';

        let file_id;

        switch (type) {
            case 'photo':
                file_id = ctx.update.message.photo.reverse()[0].file_id;
                break;

            case 'video':
                file_id = ctx.update.message.video.file_id;
                break;

            default:
                return 'WRONG_MEDIA_FILE';
        }

        const file = await axios(`https://api.telegram.org/bot${config.token}/getFile?file_id=${file_id}`)
            .then((response) => {
                return { path: response.data.result.file_path, size: response.data.result.file_size };
            })
            .catch((err) => {
                if (err.response.data.description === 'Bad Request: file is too big') return { path: null, size: 20000000 };
            });

        if (file.size > 15728640) return 'MAX_SIZE_EXCEEDED'; // 15Mb

        ctx.session.newCard.media = { type: type, data: file.path, size: file.size };
    } catch (err) {
        console.error(err);
    }
};