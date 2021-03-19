const Card = require('../../database/models/Card');
const User = require('../../database/models/User');
const Queue = require('../../database/models/Queue');
const getUserSession = require('../../scripts/getUserSession');
const cookieChecker = require('../../scripts/cookieChecker');
const saveFormatting = require('../../scripts/saveFormatting');
const replyWithError = require('../../scripts/replyWithError');
const Markup = require('telegraf/markup');
const config = require('../../../config');
const queue = new Set();

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx).then((response) => response);
        const cookie = await cookieChecker().then((response) => response);

        ctx.i18n.locale(user.language);

        await ctx.editMessageText(ctx.i18n.t('newSuggestion.standby'), { parse_mode: 'Markdown' }).then((response) => (msg_id = response.message_id));

        const Platform = require('../../platform/platform');
        const platform = new Platform({
            ssid: cookie.cookies[2].value,
            dt: cookie.cookies[1].value,
            token: cookie.cookies[0].value,
        });

        const card = {
            title: ctx.session.newCard.title,
            description: saveFormatting(ctx.session.newCard.description, ctx.session.newCard.entities),
            app: ctx.session.newCard.app,
            media: ctx.session.newCard.media,
        };

        if (!queue.has(0)) {
            queue.add(0);
            console.log(`${ctx.from.id}: new card queued.`);

            platform.createSuggestion(card).then(async (response) => {
                queue.delete(0);

                const url = response.suggestion;
                url === undefined ? (state = 'notPublished') : (state = 'published');

                ctx.editMessageText(ctx.i18n.t(`newSuggestion.${state}`, { title: card.title, url: url }), { parse_mode: 'Markdown' });

                if (url === undefined) return;

                await Card.find().then((response) => {
                    let card_id = response.reverse()[0].card_id + 1;

                    response.length <= 0 ? (card_id = 0) : (card_id = card_id);

                    const cardData = {
                        card_id: card_id,
                        title: card.title,
                        description: card.description,
                        author: ctx.from.id,
                        url: url || null,
                    };
                    const newCard = new Card(cardData);
                    newCard.save().then(() => console.log(`${ctx.from.id}: new card created.`));

                    User.find({ id: ctx.from.id }).then((response) => {
                        User.updateOne({ id: ctx.from.id }, { $set: { cards: [...response[0].cards, cardData] } }, () => {});
                    });

                    ctx.telegram
                        .sendMessage(
                            '@' + config.chat,
                            ctx.i18n.t(`newSuggestion.publishedToChat`, {
                                title: card.title,
                                url: url,
                                author: ctx.from.username === undefined ? ctx.from.first_name : '@' + ctx.from.username,
                            }),
                            {
                                parse_mode: 'HTML',
                                reply_markup: Markup.inlineKeyboard(
                                    [Markup.callbackButton(`👍`, `like:${card_id}`), Markup.callbackButton(`👎`, `dislike:${card_id}`)],
                                    { columns: 2 }
                                ),
                            }
                        )
                        .then((response) => {
                            Card.updateOne({ card_id: card_id }, { $set: { chatMessageId: response.message_id } }, () => {});
                            ctx.telegram.pinChatMessage('@' + config.chat, response.message_id);
                        });
                });
            });
        } else {
            const cardData = {
                card_id: card.title.length + card.description.length,
                title: card.title,
                description: card.description,
                app: card.app,
                author: ctx.from.id,
                message_id: msg_id,
                language: user.language,
                authorName: ctx.from.username === undefined ? ctx.from.first_name : '@' + ctx.from.username,
            };
            const newCard = new Queue(cardData);
            newCard.save().then(() => console.log(`${ctx.from.id}: new card queued.`));

            ctx.editMessageText(ctx.i18n.t('newSuggestion.queue'), { parse_mode: 'Markdown' });
        }

        ctx.answerCbQuery();
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};