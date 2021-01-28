const Card = require('../../database/models/Card');
const config = require('../../config.js');

module.exports = () => (ctx) => {

    try {

        if (ctx.from.id != config.admin) return;

        if (ctx.updateType == 'callback_query') {

            const cardId = ctx.match.toString().split(':')[1];

            Card.find({ card_id: cardId }).then(response => {

                Card.updateOne({ card_id: cardId }, { $set: { isDeclined: true } }, () => {});
                const author = response[0].author;
                const title = response[0].title;

                ctx.telegram.sendMessage(author, `😔 Your suggestion _«${title}»_ has been declined.`, { parse_mode: 'Markdown' }).then(() => {
                    ctx.editMessageText(`User received a notification related to their *${cardId}* card.`, { parse_mode: 'Markdown' });
                }).catch(err => {
                    console.error(err);
                    ctx.editMessageText(`Something went wrong with *${cardId}* card.`, { parse_mode: 'Markdown' });
                });;

            });

            ctx.answerCbQuery();

        } else if (ctx.message.text.match(/https:\/\/bugs.telegram.org\/(.*)/)) {

            const message_id = ctx.message.reply_to_message.message_id;
            const cardId = ctx.message.reply_to_message.text.match(/Card ID: \w+/g)[0].split(':')[1].trim();
            const url = ctx.message.text;

            ctx.deleteMessage();

            Card.find({ card_id: cardId }).then(response => {

                Card.updateOne({ card_id: cardId }, { $set: { isPublished: true, url: url } }, () => {});
                const author = response[0].author;
                const title = response[0].title;

                ctx.telegram.sendMessage(author, `🥳 Your suggestion [«${title}»](${url}) has been published on bugs.telegram.org!`, { parse_mode: 'Markdown', disable_web_page_preview: true }).then(() => {
                    ctx.telegram.editMessageText(config.admin, message_id, null, `User received a notification related to their *${cardId}* card.`, { parse_mode: 'Markdown' });
                }).catch(err => {
                    console.error(err);
                    ctx.telegram.editMessageText(config.admin, message_id, null, `Something went wrong with *${cardId}* card.`, { parse_mode: 'Markdown' });
                });

            });

        } else {

            return false;

        }

    } catch (error) {

        console.error(error);

    };

};