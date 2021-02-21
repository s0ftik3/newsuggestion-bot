const Telegram = require('telegraf/telegram');
const config = require('../../config.js');
const telegram = new Telegram(config.token);

const Queue = require('../database/models/Queue');
const Card = require('../database/models/Card');
const Cookie = require('../database/models/Cookie');
const User = require('../database/models/User');

const Platform = require('../platform/platform');
const Authentication = require('../platform/login');
const authentication = new Authentication(config.number);

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const Markup = require('telegraf/markup');

module.exports = async () => {

    console.log('%s: Started queue checking...', new Date().toUTCString());

    try {

        const toPublish = await Queue.find().then(response => response);

        if (toPublish.length <= 0) return;
        console.log('Started publishing cards from queue...');
    
        const cookie = await Cookie.find().then(async response => {
            if (response[0] === undefined) {
                await authentication.login();
                const newCookie = await Cookie.find().then(response => response[0]);
                return newCookie;
            } else {
                return response[0];
            }
        });
    
        const platform = new Platform({ 
            ssid: cookie.cookies[2].value, 
            dt: cookie.cookies[1].value, 
            token: cookie.cookies[0].value 
        });
    
        for (let i = 0; i < toPublish.length; i++) {
    
            const suggestion = await platform.createSuggestion(toPublish[i]).then(async response => {
    
                const url = response.suggestion;
                (url === undefined) ? state = 'notPublished' : state = 'published';
    
                telegram.editMessageText(
                    toPublish[i].author, 
                    toPublish[i].message_id, 
                    0, 
                    i18n.t(toPublish[i].language, `newSuggestion.${state}`, { 
                        title: toPublish[i].title, 
                        url: url 
                    }), 
                    { parse_mode: 'Markdown' });
                
                return url;
    
            });
    
            if (suggestion === undefined) return;
    
            await Card.find().then(response => {
    
                let card_id = response.reverse()[0].card_id + 1;
    
                (response.length <= 0) ? card_id = 0 : card_id = card_id;
    
                const cardData = {
                    card_id: card_id, 
                    title: toPublish[i].title,
                    description: toPublish[i].description,
                    author: toPublish[i].author,
                    url: suggestion
                };
                const newCard = new Card(cardData);
                newCard.save().then(() => console.log(`${toPublish[i].author}: new card created.`));
    
                User.find({ id: toPublish[i].author }).then(response => {
    
                    User.updateOne({ id: toPublish[i].author }, { $set: { cards: [...response[0].cards, cardData] } }, () => {});
    
                });
    
                telegram.sendMessage('@' + config.chat, i18n.t(toPublish[i].language, `newSuggestion.publishedToChat`, { 
                    title: toPublish[i].title, 
                    url: suggestion, 
                    author: toPublish[i].authorName
                }), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        Markup.callbackButton(`👍`, `like:${card_id}`),
                        Markup.callbackButton(`👎`, `dislike:${card_id}`)
                    ], { columns: 2 })
                }).then(response => {
                    Card.updateOne({ card_id: card_id }, { $set: { chatMessageId: response.message_id } }, () => {});
                    telegram.pinChatMessage('@' + config.chat, response.message_id);
                });
    
            });
    
            await Queue.deleteOne({ card_id: toPublish[i].title.length + toPublish[i].description.length });
    
        }

    } catch (err) {

        console.error(err);

    } finally {

        console.log('%s: Finished queue checking.', new Date().toUTCString());

    }

}