const Card = require('../../database/models/Card');
const config = require('../../config.js');

module.exports = () => (ctx) => {

    try {

        if (ctx.from.id != config.admin) return;
        if (ctx.message.reply_to_message == undefined) return;
        
        const cardId = ctx.message.reply_to_message.text.match(/Card ID: \w+/g)[0].split(':')[1].trim();
        const respond = ctx.message.text;

        if (respond == '.') {

            ctx.deleteMessage();
            ctx.deleteMessage(ctx.message.reply_to_message.message_id);

            Card.find({ card_id: cardId }).then(response => {

                Card.updateOne({ card_id: cardId }, { $set: { isDeclined: true } }, () => {});
                const author = response[0].author;
                const title = response[0].title;

                ctx.telegram.sendMessage(author, `😔 Your suggestion _«${title}»_ has been declined.`, { parse_mode: 'Markdown' });

            });

        }

        if (respond.match(/https:\/\/bugs.telegram.org\/(.*)/)) {

            const url = respond;

            ctx.deleteMessage();
            ctx.deleteMessage(ctx.message.reply_to_message.message_id);

            Card.find({ card_id: cardId }).then(response => {

                Card.updateOne({ card_id: cardId }, { $set: { isPublished: true, url: respond } }, () => {});
                const author = response[0].author;
                const title = response[0].title;

                ctx.telegram.sendMessage(author, `🥳 Your suggestion [«${title}»](${url}) has been published on bugs.telegram.org!`, { parse_mode: 'Markdown', disable_web_page_preview: true });

            });

        }

    } catch (error) {

        console.error(error);

    };

};