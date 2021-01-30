const Markup = require('telegraf/markup');
const config = require('../../config');
const application = config.platforms;
const attachment = config.types;

module.exports = () => async (ctx) => {
    try {  

        if (ctx.message.text.length > 128) return ctx.reply('Your suggestion\'s title must be less than 128 characters.');

        const suggestionTitle = ctx.message.text;
        ctx.session.suggestionTitle = suggestionTitle;
        const suggestionMedia = attachment[ctx.session.suggestionMedia.type];
        const suggestionText = ctx.session.suggestionText.replace(/[\r\n]{3,}/g, ' ');
        const suggestionAuthor = (ctx.from.username != undefined) ? `@${ctx.from.username}` : ctx.from.first_name;
        const suggestionPlatform = application[ctx.session.suggestionPlatform];

        const message = 
            `<b>Title:</b> ${suggestionTitle.replace(/[\r\n]{1,}/g, ' ')} by ${suggestionAuthor}\n\n` +
            `<b>Description:</b>\n${suggestionText}\n\n` +
            `<b>App:</b> ${suggestionPlatform}\n\n` +
            `<b>Attachments:</b> ${suggestionMedia}\n\n`;

        await ctx.replyWithHTML(message);

        ctx.replyWithMarkdown('*Submit this suggestion?*', {
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