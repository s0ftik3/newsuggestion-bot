const User = require('../../database/models/User');
const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');
const cookieChecker = require('../../scripts/cookieChecker');
const config = require('../../../config');

module.exports = () => async (ctx) => {
    try {
        ctx.answerCbQuery('Deleting the card...');

        const card_id = ctx.match[0].split(':')[1];
        const index = ctx.match.input.split(':')[2];
        const card = await Card.find({ card_id: card_id }).then((response) => response[0]);
        const user = await User.find({ id: card.author }).then((response) => response[0]);
        const cookie = await cookieChecker();

        const Platform = require('../../platform/platform');
        const platform = new Platform({
            ssid: cookie.cookies[2].value,
            dt: cookie.cookies[1].value,
            token: cookie.cookies[0].value,
        });

        platform.deleteSuggestion({ url_id: card.url.replace(/https:\/\/bugs.telegram.org\/c\//g, '') }).then(async () => {
            await Card.deleteOne({ card_id: card_id });
            const _index = ctx.session.cards.indexOf(ctx.session.cards.find((e) => e.card_id == card_id));
            ctx.session.cards.splice(_index, 1);

            ctx.editMessageText('The card has been deleted.', {
                reply_markup: Markup.inlineKeyboard([Markup.callbackButton(ctx.i18n.t('« Back',), `adminBack:${index}`)])
            });

            ctx.telegram.sendMessage(
                user.id,
                ctx.i18n.t(user.language, 'service.cardDeleted', {
                    title: card.title,
                    reason: 'Moderators decided to remove your card.',
                }),
                {
                    parse_mode: 'Markdown',
                }
            ).catch(() => {});

            ctx.telegram.deleteMessage('@' + config.chat, card.chatMessageId).catch(() => {});
            ctx.telegram.deleteMessage('@' + config.chat, card.chatMessageId + 1).catch(() => {});
        });
    } catch (err) {
        console.error(err);
    }
};