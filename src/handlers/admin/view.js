const Card = require('../../database/models/Card');
const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

module.exports = () => async (ctx) => {
    try {
        const card_id = ctx.match[0].split(':')[1];
        const index = ctx.match.input.split(':')[2];

        if (ctx.session.cards === undefined) {
            ctx.session.cards = [];
            ctx.session.cards.push(await Card.find({ card_id: card_id }).then(async (response) => {
                let data = response[0]._doc;
                const user = await User.find({ id: data.author }).then(response => response[0]);
                data = {...data, user };
                return data;
            }));
        } else if (ctx.session.cards.find((e) => e.card_id == card_id) === undefined) {
            ctx.session.cards.push(await Card.find({ card_id: card_id }).then(async (response) => {
                let data = response[0]._doc;
                const user = await User.find({ id: data.author }).then(response => response[0]);
                data = {...data, user };
                return data;
            }));
        }
        const card = ctx.session.cards.find((e) => e.card_id == card_id);
        const date = new Date(card.timestamp);
        const publishedAt = moment(card.timestamp).format('LLL');

        let keyboard = [
            [
                Markup.urlButton('View', card.url),
                Markup.callbackButton('Edit', `edit:${card_id}:${index}:admin`),
                Markup.callbackButton('Delete', `adminDelete:${card_id}:${index}`)
            ],
            [Markup.callbackButton(ctx.i18n.t('« Back'), `adminBack:${index}`)]
        ];

        if (new Date().getTime() - date.getTime() >= 90000000) {
            keyboard = [
                [
                    Markup.urlButton('View', card.url),
                    Markup.callbackButton('Delete from database', `adminDelete:${card_id}:${index}`)
                ],
                [Markup.callbackButton(ctx.i18n.t('« Back'), `adminBack:${index}`)]
            ];
        }

        await axios({
            method: 'GET',
            url: card.url,
            headers: {
                'X-Aj-Referer': 'https://bugs.telegram.org/',
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((response) => {
            const $ = cheerio.load(response.data.l);
            const like = $('span.cd-issue-like.bt-active-btn').find('span[class="value"]').attr('data-value');
            const dislike = $('span.cd-issue-dislike.bt-active-btn').find('span[class="value"]').attr('data-value');
            const comments = $('span.bt-header-cnt').text();
            let warning = '';
            if (response.data.ls === undefined) {
                warning = '❗️ <b>Removed from the platform.</b>';
                keyboard = [
                    [Markup.callbackButton('Delete from database', `adminDelete:${card_id}:${index}`)],
                    [Markup.callbackButton(ctx.i18n.t('« Back'), `adminBack:${index}`)]
                ];
            }

            const meta = {
                like: like == undefined ? 0 : like,
                dislike: dislike == undefined ? 0 : dislike,
                comments: comments.length <= 0 ? 0 : comments,
            };

            ctx.editMessageText(
                `<b>Title:</b> <i>${card.title}</i>\n` +
                `<b>Author:</b> <i>${card.user.firstName}</i> ${(card.user.username !== null ? `(@${card.user.username})` : '')}\n\n` +
                `<b>Description:</b>\n` +
                `<i>${card.description === undefined ? 'Not specified.' : card.description}</i>\n\n` +
                `<b>Meta:</b> <i>👍 ${meta.like} 👎 ${meta.dislike} 💬 ${meta.comments}</i>\n` +
                `<b>Creation date:</b> <i>${publishedAt}</i>\n` +
                `<b>ID:</b> <i>${card.card_id} ${warning}</i>`,
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard(keyboard)
                }
            );
            
            ctx.scene.leave('titleEdit');
            ctx.scene.leave('descriptionEdit');
            ctx.answerCbQuery();
        });
    } catch (err) {
        console.error(err);
    }
};