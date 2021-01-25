const Markup = require('telegraf/markup');
const application = {
    'tgdroid': 'Android',
    'tgios': 'iOS',
    'tgdesk': 'Desktop',
    'tgmac': 'macOS',
    'tgx': 'Telegram X for Android',
    'tgweb': 'Telegram Web',
    'ddapp': 'all'
};

module.exports = () => (ctx) => {
    try {  

        if (ctx.message.text.length > 128) return ctx.reply('Your suggestion\'s title must be less than 128 characters.');

        const suggestionTitle = ctx.message.text;
        ctx.session.suggestionTitle = suggestionTitle;
        const suggestionText = ctx.session.suggestionText.replace(/[\r\n]{3,}/g, ' ');
        const suggestionAuthor = (ctx.from.username != undefined) ? `@${ctx.from.username}` : ctx.from.first_name;
        const suggestionPlatform = application[ctx.session.suggestionPlatform];

        const message = 
            `*Title:* ${suggestionTitle.replace(/[\r\n]{1,}/g, ' ')} by ${suggestionAuthor}\n\n` +
            `*Description:*\n${suggestionText}\n\n` +
            `*Platform:* ${suggestionPlatform}\n\n` +
            `*Submit this suggestion?*`;

        ctx.replyWithMarkdown(message, {
            parse_mode: 'Markdown',
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('Yes', 'publish'),
                Markup.callbackButton('No', 'cancel')
            ], { columns: 2 })
        });

        ctx.scene.leave('suggestionTitle');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}