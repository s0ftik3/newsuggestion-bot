const User = require('../../database/models/User');
const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        ctx.answerCbQuery('Please standby.');

        const users = await User.find();
        const cards = await Card.find();

        const message =
            `<b>User(s):</b> <code>${users.length}</code>\n` +
            `<b>Last user:</b> ${users.reverse()[0].username === null ? `<code>${users[0].firstName}</code>` : `@${users[0].username}`}\n` +
            `<b>Card(s):</b> <code>${cards.length}</code>\n` +
            `<b>Last card:</b> ${cards.reverse()[0].url}`;

        ctx.editMessageText(message, {
            parse_mode: 'HTML',
            reply_markup: Markup.inlineKeyboard([Markup.callbackButton('« Back', 'backAdmin')])
        });
    } catch (err) {
        console.error(err);
    }
};