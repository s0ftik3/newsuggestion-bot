const User = require('../../database/models/User');
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

                ctx.telegram.sendMessage(author, `😔 Your suggestion _«${title}»_ has been declined.`, { 
                    parse_mode: 'Markdown' 
                }).then(() => {

                    ctx.editMessageText(`[User](tg://user?id=${author}) received a notification related to their card: *${cardId}*.`, { 
                        parse_mode: 'Markdown' 
                    });

                }).catch(err => {

                    console.error(err);
                    ctx.editMessageText(`Something went wrong with card: *${cardId}*.`, { 
                        parse_mode: 'Markdown' 
                    });

                });

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

                ctx.telegram.sendMessage(author, `🥳 Your suggestion _«[${title}](${url})»_ has been published on bugs.telegram.org!`, { 
                    parse_mode: 'Markdown', 
                    disable_web_page_preview: true 
                }).then(() => {

                    ctx.telegram.editMessageText(config.admin, message_id, null, `[User](tg://user?id=${author}) received a notification related to their card: *${cardId}*.`, { 
                        parse_mode: 'Markdown' 
                    });

                }).catch(err => {

                    console.error(err);
                    ctx.telegram.editMessageText(config.admin, message_id, null, `Something went wrong with card: *${cardId}*.`, { 
                        parse_mode: 'Markdown' 
                    });

                });

                User.find({ id: author }).then(data => {

                    ctx.telegram.sendMessage('@' + config.chat, `🥳 Suggestion _«[${title}](${url})»_ by ${(data[0].username == null) ? data[0].firstName : '@' + data[0].username} has been published on bugs.telegram.org!`, {
                        parse_mode: 'Markdown', 
                        disable_web_page_preview: true
                    });

                });

            });

        } else {

            return;

        }

    } catch (error) {

        console.error(error);

    };

};