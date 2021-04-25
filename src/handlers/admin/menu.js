const User = require('../../database/models/User');
const Markup = require('telegraf/markup');

module.exports = () => async (ctx) => {
    try {
        const user = await User.find({ id: ctx.from.id }).then(response => response[0]);

        if (user.role === 'moderator') {
            ctx.editMessageText(`Hello, *${ctx.from.first_name}*! (${user.role})`, {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton('Manage cards', 'mCards')],
                    [Markup.callbackButton(ctx.i18n.t('button.back'), 'settings')]
                ])
            });
        } else if (user.role === 'admin') {
            ctx.editMessageText(`Hello, *${ctx.from.first_name}*! (${user.role})`, {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton('Manage cards', 'mCards'), Markup.callbackButton('Manage users', 'mUsers')],
                    [Markup.callbackButton('View statistics', 'vStats')],
                    [Markup.callbackButton(ctx.i18n.t('button.back'), 'settings')]
                ])
            });
        } else {
            ctx.editMessageText(`How the hell did ya get here?`, {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t('button.back'), 'settings')]
                ])
            });
        }

        ctx.answerCbQuery();
    } catch (err) {
        console.error(err);
    }
};