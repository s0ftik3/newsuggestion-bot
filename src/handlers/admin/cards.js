const Card = require('../../database/models/Card');
const createCardsPage = require('../../scripts/createCardsPage');

module.exports = () => async (ctx) => {
    try {
        const data = await Card.find();

        if (data.length <= 0) {
            ctx.editMessageText('No cards found.', {
                reply_markup: Markup.inlineKeyboard([Markup.callbackButton('« Back', 'backAdmin')])
            });
        }

        createCardsPage(ctx, data.reverse());
    } catch (error) {
        console.error(err);
    }
};