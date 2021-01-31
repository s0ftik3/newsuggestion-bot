const Card = require('../../database/models/Card');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = () => (ctx) => {
    try {

        const url = ctx.message.text.replace('/add', '').trim();

        if (url.match(/https:\/\/bugs.telegram.org\/(.*)/g).length <= 0) return ctx.reply('It doesn\'t look like a suggestion card.');

        axios(url).then(async response => {

            const $ = cheerio.load(response.data);

            // Check if the card isn't a suggestion
            const tags = $('body').find('a[class="bt-tag"]').text();
            if (tags.toLowerCase().match('issue')) return ctx.reply('It doesn\'t look like a suggestion card.');
            
            // Check the author of the card
            const name = $('body').find('span[class="bt-issue-author"]').text().trim();
            const tg_name = ctx.update.message.from.first_name;
            if (name != tg_name) {

                return ctx.replyWithMarkdown('It doesn\'t look like you are the author of this suggestion card. Please send *your* suggestion card on the platform.');

            } else {

                const title = $('body').find('span[class="cd-author"]').text().trim();

                await Card.find().then(response => {

                    if (response.length <= 0) {
        
                        cardId = 0;
        
                        const cardData = {
                            card_id: 0,
                            title: title,
                            author: ctx.from.id,
                            url: url,
                            isPublished: true,
                            timestamp: new Date()
                        }
                        const card = new Card(cardData);
                        card.save().then(() => console.log(`${ctx.from.id}: added new card.`));
        
                    } else {
        
                        const card_id = response.reverse()[0].card_id + 1;
                        cardId = card_id;
        
                        const cardData = {
                            card_id: 0,
                            title: title,
                            author: ctx.from.id,
                            url: url,
                            isPublished: true,
                            timestamp: new Date()
                        }
                        const card = new Card(cardData);
                        card.save().then(() => console.log(`${ctx.from.id}: added new card.`));
        
                    }

                });

                return ctx.replyWithMarkdown('Your card successfully added to the database! Now, you can check it by /me command.');

            }

        });

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}