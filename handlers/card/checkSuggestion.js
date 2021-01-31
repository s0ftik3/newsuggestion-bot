const Markup = require('telegraf/markup');
const config = require('../../config');
const application = config.platforms;
const attachment = config.types;

module.exports = () => async (ctx) => {
    try {

        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1);

        const suggestionTitle = ctx.session.suggestionTitle;
        const suggestionMedia = attachment[ctx.session.suggestionMedia.type];
        const suggestionText = ctx.session.suggestionText.replace(/[\r\n]{3,}/g, ' ');
        const suggestionAuthor = (ctx.from.username != undefined) ? `@${ctx.from.username}` : ctx.from.first_name;
        const suggestionPlatform = application[ctx.session.suggestionPlatform];

        const message = 
            `<b>Title:</b> <code>${suggestionTitle.replace(/[\r\n]{1,}/g, ' ')}</code> by ${suggestionAuthor}\n\n` +
            `<b>Description:</b>\n<code>${suggestionText}</code>\n\n` +
            `<b>App:</b> ${suggestionPlatform}\n\n` +
            `<b>Attachments:</b> ${suggestionMedia}\n\n`;

        await ctx.editMessageText(message, { parse_mode: 'HTML' });

        ctx.replyWithMarkdown('*Submit this suggestion?*', {
            parse_mode: 'Markdown',
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('Yes', 'publish'),
                Markup.callbackButton('No', 'cancel')
            ], { columns: 2 })
        });

        ctx.answerCbQuery();

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}