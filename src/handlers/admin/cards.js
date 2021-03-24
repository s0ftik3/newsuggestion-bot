const Card = require('../../database/models/Card');
const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const createCardsPage = require('../../scripts/createCardsPage');

module.exports = () => async (ctx) => {
    try {
        const data = await Card.find();
        const user = await User.find({ id: ctx.from.id }).then(response => response[0]);

        if (data.length <= 0) {
            ctx.editMessageText('No cards found.', {
                reply_markup: Markup.inlineKeyboard([Markup.callbackButton('« Back', 'backAdmin')])
            });
        }

        if (user.role === 'moderator') {
            createCardsPage(ctx, data.reverse());
        } else if (user.role === 'admin') {
            createCardsPage(ctx, data.reverse());
        } else {
            ctx.editMessageText(`How the hell did ya get here?`, {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.back'), 'settings')]
                ])
            });
        }
    } catch (error) {
        console.error(error);
    }
};