const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const config = require('../../../config');

module.exports = () => async (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        const user = await User.find({ id: ctx.from.id }).then(response => response[0]);

        if (ctx.updateType === 'callback_query') {
            ctx.editMessageText(`Hello, *${ctx.from.first_name}*!\nYou\'re logged in as: *${user.role}*.`, {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton('Manage cards', 'mCards')],
                    [Markup.callbackButton('Manage users', 'mUsers')],
                    [Markup.callbackButton('View statistics', 'vStats')]
                ])
            });

            ctx.answerCbQuery();
        } else {
            ctx.replyWithMarkdown(`Hello, *${ctx.from.first_name}*!\nYou\'re logged in as: *${user.role}*.`, {
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton('Manage cards', 'mCards')],
                    [Markup.callbackButton('Manage users', 'mUsers')],
                    [Markup.callbackButton('View statistics', 'vStats')]
                ])
            });
        }
    } catch (err) {
        console.error(err);
    }
};