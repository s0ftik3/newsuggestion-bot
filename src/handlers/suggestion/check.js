const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1);

        const user = await getUserSession(ctx).then((response) => response);
        ctx.i18n.locale(user.language);

        const title = ctx.session.newCard.title;
        const description = ctx.session.newCard.description.replace(/[\r\n]{3,}/g, ' ');
        const app = ctx.session.newCard.app;

        const name = {
            0: ctx.i18n.t('application.tgdroid'),
            1: ctx.i18n.t('application.tgios'),
            2: ctx.i18n.t('application.tgdesk'),
            3: ctx.i18n.t('application.tgmac'),
            4: ctx.i18n.t('application.tgx'),
            5: ctx.i18n.t('application.tgweb'),
            6: ctx.i18n.t('application.ddapp'),
        };

        if (ctx.session.newCard.media === null) {
            ctx.editMessageText(
                ctx.i18n.t('newSuggestion.preview', {
                    title: title.replace(/[\r\n]{1,}/g, ' '),
                    description: description,
                    app: name[app],
                }),
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard(
                        [Markup.callbackButton(ctx.i18n.t('button.submit'), 'publish'), Markup.callbackButton(ctx.i18n.t('button.cancel'), 'cancel')],
                        { columns: 2 }
                    ),
                }
            );
        } else {
            ctx.deleteMessage();

            ctx.replyWithPhoto(ctx.session.newCard.media.file_id, {
                caption: ctx.i18n.t('newSuggestion.preview', {
                    title: title.replace(/[\r\n]{1,}/g, ' '),
                    description: description,
                    app: name[app]
                }),
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard(
                    [Markup.callbackButton(ctx.i18n.t('button.submit'), 'publish'), Markup.callbackButton(ctx.i18n.t('button.cancel'), 'cancel')],
                    { columns: 2 }
                )
            });
        }

        ctx.answerCbQuery();
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};
