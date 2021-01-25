const Markup = require('telegraf/markup');

module.exports = () => (ctx) => {
    try {

        ctx.editMessageText(
            'We’re gradually expanding the list of languages available in Settings. You can check the *Translation Platform* to find more languages or help us translate Telegram: translations.telegram.org\n\n' +
            'Click _Other language_ in the left menu to open search. If you don’t find your language there, you can start a custom translation: click _Add a new language_ under the search.', {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    Markup.callbackButton('« Back', 'back')
                ])
            }
        );

        ctx.answerCbQuery();

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}