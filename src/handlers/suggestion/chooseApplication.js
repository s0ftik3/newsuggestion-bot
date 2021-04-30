const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        if (ctx.chat.type !== 'private') return;
        const user = await getUserSession(ctx);
        if (user.banned) return replyWithError(ctx, 20);
        ctx.i18n.locale(user.language);

        ctx.session.newCard = {
            app: null,
            title: null,
            description: null,
            entities: null,
            media: null,
        };

        if (ctx.updateType === 'callback_query') {
            ctx.editMessageText(ctx.i18n.t('newSuggestion.chooseApp'), {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard(
                    [
                        Markup.callbackButton(ctx.i18n.t('application.tgdroid'), 'app:tgdroid'),
                        Markup.callbackButton(ctx.i18n.t('application.tgios'), 'app:tgios'),
                        Markup.callbackButton(ctx.i18n.t('application.tgdesk'), 'app:tgdesk'),
                        Markup.callbackButton(ctx.i18n.t('application.tgmac'), 'app:tgmac'),
                        Markup.callbackButton(ctx.i18n.t('application.tgx'), 'app:tgx'),
                        Markup.callbackButton(ctx.i18n.t('application.tgweb'), 'app:tgweb'),
                        Markup.callbackButton(ctx.i18n.t('application.tgwebk'), 'app:tgwebk'),
                        Markup.callbackButton(ctx.i18n.t('application.tgwebz'), 'app:tgwebz'),
                        Markup.callbackButton(ctx.i18n.t('application.ddapp'), 'app:ddapp')
                    ],
                    { columns: 1 }
                ),
            });

            ctx.answerCbQuery();
        } else {
            ctx.replyWithMarkdown(ctx.i18n.t('newSuggestion.chooseApp'), {
                reply_markup: Markup.inlineKeyboard(
                    [
                        Markup.callbackButton(ctx.i18n.t('application.tgdroid'), 'app:tgdroid'),
                        Markup.callbackButton(ctx.i18n.t('application.tgios'), 'app:tgios'),
                        Markup.callbackButton(ctx.i18n.t('application.tgdesk'), 'app:tgdesk'),
                        Markup.callbackButton(ctx.i18n.t('application.tgmac'), 'app:tgmac'),
                        Markup.callbackButton(ctx.i18n.t('application.tgx'), 'app:tgx'),
                        Markup.callbackButton(ctx.i18n.t('application.tgweb'), 'app:tgweb'),
                        Markup.callbackButton(ctx.i18n.t('application.tgwebk'), 'app:tgwebk'),
                        Markup.callbackButton(ctx.i18n.t('application.tgwebz'), 'app:tgwebz'),
                        Markup.callbackButton(ctx.i18n.t('application.ddapp'), 'app:ddapp')
                    ],
                    { columns: 1 }
                ),
            });
        }
    } catch (err) {
        if (ctx.updateType === 'callback_query') {
            replyWithError(ctx, 18);
        } else {
            replyWithError(ctx, 0);
        }

        ctx.answerCbQuery();
        console.error(err);
    }
};