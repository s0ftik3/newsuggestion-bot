const Card = require('../../database/models/Card');
const User = require('../../database/models/User');

const sendMessage = require('../../scripts/sendMessage');
const sendPhoto = require('../../scripts/sendPhoto');
const sendVideo = require('../../scripts/sendVideo');
const sendDocument = require('../../scripts/sendDocument');

const application = {
    'tgdroid': 'Telegram for Android',
    'tgios': 'Telegram for iOS',
    'tgdesk': 'Telegram Desktop',
    'tgmac': 'The native macOS app',
    'tgx': 'Telegram X for Android',
    'tgweb': 'Telegram Web',
    'ddapp': 'all'
};

module.exports = () => async (ctx) => {
    try {  

        ctx.deleteMessage();

        const suggestionTitle = ctx.session.suggestionTitle;
        const suggestionText = ctx.session.suggestionText.replace(/[\r\n]{3,}/g, ' ');
        const suggestionAuthor = (ctx.from.username != undefined) ? `@${ctx.from.username}` : ctx.from.first_name;
        const suggestionPlatform = application[ctx.session.suggestionPlatform];

        const message = 
            `*${suggestionTitle.replace(/[\r\n]{1,}/g, ' ')}* by *${suggestionAuthor}*\n\n` +
            `${suggestionText}\n\n` +
            `*App:* ${suggestionPlatform}\n` +
            `#suggestion`;

        let cardId;

        await Card.find().then(response => {

            if (response.length <= 0) {

                cardId = 0;

                const cardData = {
                    card_id: 0,
                    title: suggestionTitle,
                    author: ctx.from.id,
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
                    timestamp: new Date()
                }
                const card = new Card(cardData);
                card.save().then(() => console.log(`${ctx.from.id}: new card created.`));

            }

            User.find({ id: ctx.from.id }).then(response => {

                User.updateOne({ id: ctx.from.id }, { $set: { suggestionCount: response[0].suggestionCount + 1 } }, () => {});

            });

        });


        switch(ctx.session.suggestionMedia.type) {

            case 'text': 
                sendMessage(ctx, message, cardId);

                break;

            case 'photo':
                sendPhoto(ctx, message, cardId);
                ctx.session.suggestionMedia.type = undefined;
                
                break;
            
            case 'GIF':
                sendDocument(ctx, message, cardId);
                ctx.session.suggestionMedia.type = undefined;

                break;

            case 'document':
                sendDocument(ctx, message, cardId);
                ctx.session.suggestionMedia.type = undefined;

                break;
                
            case 'video':
                sendVideo(ctx, message, cardId);
                ctx.session.suggestionMedia.type = undefined;

                break;

        }

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}