const Markup = require('telegraf/markup');
const config = require('../config');

module.exports = (ctx, message, cardId) => {

    ctx.telegram.sendPhoto('@' + config.chat, ctx.session.suggestionMedia.content[0].file_id, {
        parse_mode: 'Markdown',
        caption: message,
        reply_markup: Markup.inlineKeyboard([
            Markup.callbackButton(`👍 0`, `like:${cardId}`),
            Markup.callbackButton(`👎 0`, `dislike:${cardId}`)
        ], { columns: 2 })
    }).then(data => {

        ctx.telegram.pinChatMessage(data.chat.id, data.message_id);
        ctx.replyWithMarkdown(`[Your suggestion](https://t.me/${config.chat}/${data.message_id}) has been published in our group chat!\n\nYou will get notified once your suggestion appears on bugs.telegram.org. Also, if your suggestion is declined, you will see an according message.\n\nTo suggest a new feature, please use the command /suggest.`);  
    
        ctx.telegram.sendMessage(config.admin, `*Card ID:* ${cardId}\n\n_${data.caption}_`, {
            parse_mode: 'Markdown',
            reply_markup: Markup.inlineKeyboard([
                Markup.urlButton(`View the suggestion`, `https://t.me/${config.chat}/${data.message_id}`),
                Markup.callbackButton('Decline', `decline:${cardId}`)
            ], { columns: 1 })
        });
        console.log(`${ctx.from.id}: made a suggestion - https://t.me/${config.chat}/${data.message_id}`);

    });

}