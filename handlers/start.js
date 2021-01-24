const User = require('../database/models/User');
const Markup = require('telegraf/markup');

module.exports = () => (ctx) => {
    try {

        User.find({ id: ctx.from.id }).then(response => {
            if (response.length <= 0) {

                const userData = {
                    id: ctx.from.id,
                    firstName: (ctx.from.first_name == undefined) ? null : ctx.from.first_name,
                    lastName: (ctx.from.last_name == undefined) ? null : ctx.from.last_name,
                    username: (ctx.from.username == undefined) ? null : ctx.from.username,
                    timestamp: new Date()
                }
                const user = new User(userData);
                user.save().then(() => console.log(`${ctx.from.id}: user recorded.`));

            }
        });

        if (ctx.updateType == 'callback_query') {

            ctx.editMessageText('Choose an option:', {
                reply_markup: Markup.inlineKeyboard([
                    Markup.callbackButton('Suggest a feature for the apps', 'app'),
                    Markup.callbackButton('Suggest a language', 'language'),
                ], { columns: 1 })
            });
            ctx.answerCbQuery();

        } else {

            if (ctx.message.chat.type != 'private') return;

            ctx.replyWithMarkdown('Choose an option:', {
                reply_markup: Markup.inlineKeyboard([
                    Markup.callbackButton('Suggest a feature for the apps', 'app'),
                    Markup.callbackButton('Suggest a language', 'language'),
                ], { columns: 1 })
            });

        }

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}