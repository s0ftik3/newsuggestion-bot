const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const languageCheck = require('../../scripts/languageCheck');
const config = require('../../../config').card;

module.exports = () => async (ctx) => {
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        if (ctx.message.text.match(/^\/start|\/me|\/new|\/suggest$/gi) !== null) return ctx.reply(ctx.i18n.t('error.sendDescription'));
        if (ctx.message.text.length <= config.description_minimum_length) return ctx.replyWithMarkdown(ctx.i18n.t('error.description_too_short'));
        if (!languageCheck(ctx.message.text)) return ctx.reply(ctx.i18n.t(`error.descritpionWrongLanguage`));

        ctx.telegram.editMessageReplyMarkup(ctx.update.message.chat.id, ctx.session.msg_id, {});

        const description = ctx.message.text;
        ctx.session.newCard.description = description;
        ctx.session.newCard.entities = (ctx.message.entities === undefined) ? null : ctx.message.entities;

        ctx.replyWithMarkdown(ctx.i18n.t('newSuggestion.media'), {
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton(ctx.i18n.t('button.skip'), 'skip')
            ]),
            disable_web_page_preview: true
        }).then(response => {
            ctx.session.msg_id = response.message_id;
        });

        ctx.scene.leave('description');
        ctx.scene.enter('media');

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }
}