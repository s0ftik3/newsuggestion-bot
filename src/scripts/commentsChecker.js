const Telegram = require('telegraf/telegram');
const config = require('../../config.js');
const telegram = new Telegram(config.token);

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const User = require('../database/models/User');
const Card = require('../database/models/Card');

const cookieChecker = require('./cookieChecker');
const Markup = require('telegraf/markup');

module.exports = async () => {

    console.log('%s: Searching for new comments...', new Date().toUTCString());

    try {

        const cookie = await cookieChecker().then(response => response);
        const Platform = require('../platform/platform');
        const platform = new Platform({ 
            ssid: cookie.cookies[2].value, 
            dt: cookie.cookies[1].value, 
            token: cookie.cookies[0].value 
        });

        const cards = await Card.find().then(response => {

            const result = [];

            response.forEach(e => {
                result.push(Number(e.url.replace('https://bugs.telegram.org/c/', '')))
            });

            return result;

        });

        for (let i = 0; i < cards.length; i++) {

            const card = await Card.find({ url: `https://bugs.telegram.org/c/${cards[i]}` }).then(response => response[0]);
            const data = await platform.getComments({ url_id: cards[i], after_id: (card.lastCommentId === undefined) ? 0 : card.lastCommentId }).then(response => response);

            const card_id = card.card_id;
            const authorId = card.author;
            const language = await User.find({ id: authorId }).then(response => response[0].language);
            
            if (data.comments.length > 1) {

                for (let i = 0; i < data.comments.length; i++) {

                    telegram.sendMessage(authorId, i18n.t(language, 'me.newComment', {
                        cardName: card.title,
                        author: data.comments[i].author,
                        text: data.comments[i].text
                    }), {
                        parse_mode: 'HTML',
                        reply_markup: Markup.inlineKeyboard([
                            [Markup.urlButton(i18n.t(language, 'button.showComment'), card.url + `/${data.comments[i].comment_id}`)]
                        ]),
                        disable_web_page_preview: true
                    }).then(() => {
                        console.log(`${authorId}: received a comment.`);
                    });
        
                }

            } else if (data.comments.length === 1) {  

                telegram.sendMessage(authorId, i18n.t(language, 'me.newComment', {
                    cardName: card.title,
                    author: data.comments[0].author,
                    text: data.comments[0].text
                }), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.urlButton(i18n.t(language, 'button.showComment'), card.url + `/${data.comments[0].comment_id}`)]
                    ]),
                    disable_web_page_preview: true
                }).then(() => {
                    console.log(`${authorId}: received a comment.`);
                });

            } else {

                continue;

            }

            Card.updateOne({ card_id: card_id }, { $set: { lastCommentId: data.after_id } }, () => {});

        }

    } catch (err) {

        console.error(err);

    } finally {

        console.log('%s: Finished comments update.', new Date().toUTCString());

    }

}