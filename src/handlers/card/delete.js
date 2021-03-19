const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const cookieChecker = require('../../scripts/cookieChecker');
const replyWithError = require('../../scripts/replyWithError');
const config = require('../../../config');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const action = ctx.match[0].split(':')[0];
        const card_id = ctx.match[0].split(':')[1];
        const index = ctx.match.input.split(':')[2];

        switch (action) {
            case 'delete':
                ctx.editMessageText(ctx.i18n.t('me.deleteCard'), {
                    parse_mode: 'Markdown',
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.callbackButton(ctx.i18n.t('button.yesDelete'), `reallyDelete:${card_id}`)],
                        [Markup.callbackButton(ctx.i18n.t('button.no'), `view:${card_id}:${index}`)],
                    ]),
                });

                ctx.answerCbQuery();
                break;

            case 'reallyDelete':
                const cookie = await cookieChecker().then((response) => response);

                const Platform = require('../../platform/platform');
                const platform = new Platform({
                    ssid: cookie.cookies[2].value,
                    dt: cookie.cookies[1].value,
                    token: cookie.cookies[0].value,
                });

                const card = await Card.find({ card_id: card_id }).then((response) => response[0]);

                platform.deleteSuggestion({ url_id: card.url.replace(/https:\/\/bugs.telegram.org\/c\//g, '') }).then(async (response) => {
                    if (response) {
                        const cards = await Card.find({ author: ctx.from.id }).then((response) => response.length);

                        if (cards > 0) {
                            ctx.editMessageText(ctx.i18n.t('me.cardDeleted'), {
                                reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.back'), `backward:0`)]]),
                            });
                        } else {
                            ctx.editMessageText(ctx.i18n.t('me.cardDeleted'));
                        }

                        ctx.telegram.deleteMessage('@' + config.chat, card.chatMessageId);
                        ctx.telegram.deleteMessage('@' + config.chat, card.chatMessageId + 1);

                        const indexOfCard = ctx.session.cards.indexOf(card);
                        ctx.session.cards.splice(indexOfCard, 1);
                        Card.deleteOne({ card_id: card_id });
                    } else {
                        ctx.editMessageText(ctx.i18n.t('error.cardNotDeleted'), {
                            reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.back'), `backward:0`)]]),
                        });
                    }
                });

                ctx.answerCbQuery();
                break;
        }
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};