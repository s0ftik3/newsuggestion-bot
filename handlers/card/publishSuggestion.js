const Card = require('../../database/models/Card');
const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const config = require('../../config');
const application = {
    'tgdroid': 'Android',
    'tgios': 'iOS',
    'tgdesk': 'Desktop',
    'tgmac': 'macOS',
    'tgx': 'Telegram X for Android',
    'tgweb': 'Telegram Web',
    'ddapp': 'all'
};

module.exports = () => async (ctx) => {
    try {  

        if (ctx.message.text.length > 128) return ctx.reply('Your suggestion\'s title must be less than 128 characters.');

        const suggestionTitle = ctx.message.text;
        const suggestionText = ctx.session.suggestionText.replace(/[\r\n]{3,}/g, ' ');
        const suggestionAuthor = (ctx.from.username != undefined) ? `@${ctx.from.username}` : ctx.from.first_name;
        const suggestionPlatform = application[ctx.session.suggestionPlatform];

        const message = 
            `*${suggestionTitle.replace(/[\r\n]{1,}/g, ' ')}* by *${suggestionAuthor}*\n\n` +
            `${suggestionText}\n\n` +
            `*Platform:* ${suggestionPlatform}\n` +
            `#suggestion`;

        let cardId;

        await Card.find().then(response => {

            if (response.length <= 0) {

                cardId = 0;

                const cardData = {
                    card_id: 0, 
                    title: suggestionTitle,
                    author: ctx.from.id,
                    likes: 0,
                    dislikes: 0,
                    timestamp: new Date()
                }
                const card = new Card(cardData);
                card.save().then(() => console.log(`${ctx.from.id}: new card created.`));

            } else {

                const card_id = response.reverse()[0].card_id + 1;
                cardId = card_id;

                const cardData = {
                    card_id: card_id, 
                    title: suggestionTitle,
                    author: ctx.from.id,
                    likes: 0,
                    dislikes: 0,
                    timestamp: new Date()
                }
                const card = new Card(cardData);
                card.save().then(() => console.log(`${ctx.from.id}: new card created.`));

            }

            User.find({ id: ctx.from.id }).then(response => {

                User.updateOne({ id: ctx.from.id }, { $set: { suggestionCount: response[0].suggestionCount + 1 } }, () => {});

            });

        });

        if (ctx.session.suggestionMedia == undefined) {

            ctx.telegram.sendMessage(config.chat_link, message, {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    Markup.callbackButton(`👍 0`, `like:${cardId}`),
                    Markup.callbackButton(`👎 0`, `dislike:${cardId}`)
                ], { columns: 2 }),
                disable_web_page_preview: true
            }).then(data => {
                
                ctx.telegram.pinChatMessage(data.chat.id, data.message_id);
                ctx.replyWithMarkdown(`[Your suggestion](https://t.me/${config.chat}/${data.message_id}) has been published!\n\nTo suggest a new feature, please use the command /suggest.`);    
            
                console.log(`${ctx.from.id}: made a suggestion - https://t.me/${config.chat}/${data.message_id}`);

            });

        } else {

            switch(ctx.session.suggestionMedia.type) {

                case 'photo':
                    ctx.telegram.sendPhoto(config.chat_link, ctx.session.suggestionMedia.content[0].file_id, {
                        parse_mode: 'Markdown',
                        caption: message
                    }).then(data => {
        
                        ctx.telegram.pinChatMessage(data.chat.id, data.message_id);
                        ctx.replyWithMarkdown(`[Your suggestion](https://t.me/${config.chat}/${data.message_id}) has been published!\n\nTo suggest a new feature, please use the command /suggest.`);  
                    
                        console.log(`${ctx.from.id}: made a suggestion - https://t.me/${config.chat}/${data.message_id}`);
        
                    });
                    
                    break;
                
                case 'GIF':
                    ctx.telegram.sendDocument(config.chat_link, ctx.session.suggestionMedia.content.file_id, {
                        parse_mode: 'Markdown',
                        caption: message
                    }).then(data => {
        
                        ctx.telegram.pinChatMessage(data.chat.id, data.message_id);
                        ctx.replyWithMarkdown(`[Your suggestion](https://t.me/${config.chat}/${data.message_id}) has been published!\n\nTo suggest a new feature, please use the command /suggest.`);  
                    
                        console.log(`${ctx.from.id}: made a suggestion - https://t.me/${config.chat}/${data.message_id}`);
        
                    });
                    
                    break;

                case 'video':
                    ctx.telegram.sendVideo(config.chat_link, ctx.session.suggestionMedia.content.file_id, {
                        parse_mode: 'Markdown',
                        caption: message
                    }).then(data => {
        
                        ctx.telegram.pinChatMessage(data.chat.id, data.message_id);
                        ctx.replyWithMarkdown(`[Your suggestion](https://t.me/${config.chat}/${data.message_id}) has been published!\n\nTo suggest a new feature, please use the command /suggest.`);  
                    
                        console.log(`${ctx.from.id}: made a suggestion - https://t.me/${config.chat}/${data.message_id}`);
        
                    });
                    
                    break;

            }

        }

        ctx.scene.leave('suggestionTitle');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}