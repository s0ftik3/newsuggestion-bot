const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');
const axios = require('axios');
const cheerio = require('cheerio');
const getUserSession = require('../../scripts/getUserSession');

module.exports = () => async (ctx) => {
    
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        const card_id = ctx.match[0].split(':')[1];
        const index = ctx.match.input.split(':')[2];

        if (ctx.session.cards === undefined) {
            ctx.session.cards = [];
            ctx.session.cards.push(await Card.find({ card_id: card_id }).then(response => response[0]));
        } else if (ctx.session.cards.find(e => e.card_id == card_id) === undefined) {
            ctx.session.cards.push(await Card.find({ card_id: card_id }).then(response => response[0]));
        }
        const card = ctx.session.cards.find(e => e.card_id == card_id);

        const date = new Date(card.timestamp);
        const day = date.getDate().toString();
        const month = (date.getMonth() + 1).toString();
        const year = date.getFullYear().toString();
        const publishedAt = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;

        let keyboard = [
            [Markup.urlButton(ctx.i18n.t('button.viewOnPlatform'), card.url)],
            [Markup.callbackButton(ctx.i18n.t('button.edit'), `edit:${card_id}:${index}`), Markup.callbackButton(ctx.i18n.t('button.delete'), `delete:${card_id}:${index}`)],
            [Markup.callbackButton(ctx.i18n.t('button.back'), `back:${index}`)]
        ];

        // 25 hours.
        if ((new Date().getTime() - date.getTime()) >= 90000000) {
            keyboard = [
                [Markup.urlButton(ctx.i18n.t('button.viewOnPlatform'), card.url)],
                [Markup.callbackButton(ctx.i18n.t('button.back'), `back:${index}`)]
            ];
        }

        let meta = {};

        await axios(card.url).then(response => {

            const $ = cheerio.load(response.data);
            const like = $('body').find('span[class="cd-issue-like bt-active-btn"]').find('span[class="value"]').attr('data-value');
            const dislike = $('body').find('span[class="cd-issue-dislike bt-active-btn"]').find('span[class="value"]').attr('data-value');
            const comments = $('body').find('span[class="bt-header-cnt"]').text();

            meta = { 
                like: (like == undefined) ? 0 : like, 
                dislike: (dislike == undefined) ? 0 : dislike,
                comments: (comments.length <= 0) ? 0 : comments
            };

        });

        ctx.editMessageText(ctx.i18n.t('me.preview', {
            title: card.title,
            description: (card.description === undefined) ? ctx.i18n.t('me.noDescription') : card.description,
            like: meta.like,
            dislike: meta.dislike,
            comments: meta.comments,
            date: publishedAt
        }), {
            parse_mode: 'HTML',
            reply_markup: Markup.inlineKeyboard(keyboard)
        });

        ctx.scene.leave('titleEdit');
        ctx.scene.leave('descriptionEdit');
        ctx.answerCbQuery();

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }

}