const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const getMedia = require('../../scripts/getMedia');

module.exports = () => async (ctx) => {
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        if (ctx.updateSubTypes[0] === 'text') return ctx.reply(ctx.i18n.t('error.noText'))

        if (ctx.updateType === 'callback_query') {

            ctx.editMessageText(ctx.i18n.t('newSuggestion.title'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.cancel'), 'cancel')]
                ])
            }).then(response => {
                ctx.session.msg_id = response.message_id;
            });

        } else {

            ctx.telegram.editMessageReplyMarkup(ctx.update.message.chat.id, ctx.session.msg_id, {});
            
            // Currently it supports ONLY ONE media file.
            const media = await getMedia(ctx);
            if (media === 'MEDIA_GROUP_DETECTED') return ctx.reply(ctx.i18n.t('error.mediaGroup'));
            if (media === 'WRONG_MEDIA_FILE') return ctx.reply(ctx.i18n.t('error.wrongMedia'));
            if (media === 'MAX_SIZE_EXCEEDED') return ctx.reply(ctx.i18n.t('error.maxSize'));
            if (media === 'REPEATED_MEDIA_GROUP') return;

            ctx.replyWithMarkdown(ctx.i18n.t('newSuggestion.title'), {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.cancel'), 'cancel')]
                ])
            }).then(response => {
                ctx.session.msg_id = response.message_id;
            });

        }

        ctx.scene.leave('media');
        ctx.scene.enter('title');

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }
}