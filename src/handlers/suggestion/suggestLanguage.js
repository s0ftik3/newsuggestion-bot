const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        ctx.editMessageText(ctx.i18n.t('service.suggestLanguage'), {
            parse_mode: 'Markdown',
            reply_markup: Markup.inlineKeyboard([Markup.callbackButton(ctx.i18n.t('button.back'), 'backStart')]),
        });

        ctx.answerCbQuery();
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};