const Markup = require('telegraf/markup');

module.exports = () => (ctx) => {
    try {

        const chosenOption = ctx.match;
        ctx.session.suggestionType = chosenOption;

        ctx.editMessageText('Which app would you like us to improve?', {
            parse_mode: 'Markdown',
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('Telegram for Android', 'platform:tgdroid'),
                Markup.callbackButton('Telegram for iOS', 'platform:tgios'),
                Markup.callbackButton('Telegram Desktop', 'platform:tgdesk'),
                Markup.callbackButton('The native macOS app', 'platform:tgmac'),
                Markup.callbackButton('Telegram X for Android', 'platform:tgx'),
                Markup.callbackButton('Telegram Web', 'platform:tgweb'),
                Markup.callbackButton('It doesn\'t depend on the app', 'platform:ddapp')
            ], { columns: 1 })
        });

        ctx.answerCbQuery();

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}