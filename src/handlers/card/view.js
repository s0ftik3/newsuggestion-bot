const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');
const axios = require('axios');
const cheerio = require('cheerio');
const getUserSession = require('../../scripts/getUserSession');
const getCreationDate = require('../../scripts/getCreationDate');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const card_id = ctx.match[0].split(':')[1];
        const index = ctx.match.input.split(':')[2];

        if (ctx.session.cards === undefined) {
            ctx.session.cards = [];
            ctx.session.cards.push(await Card.find({ card_id: card_id }).then((response) => response[0]));
        } else if (ctx.session.cards.find((e) => e.card_id == card_id) === undefined) {
            ctx.session.cards.push(await Card.find({ card_id: card_id }).then((response) => response[0]));
        }
        const card = ctx.session.cards.find((e) => e.card_id == card_id);

        const date = new Date(card.timestamp);
        const publishedAt = getCreationDate(card.timestamp, user.language);

        let keyboard = [
            [
                Markup.callbackButton(ctx.i18n.t('button.edit'), `edit:${card_id}:${index}`),
                Markup.callbackButton(ctx.i18n.t('button.delete'), `delete:${card_id}:${index}`),
            ],
            [Markup.urlButton(ctx.i18n.t('button.viewOnPlatform'), card.url)],
            [Markup.switchToChatButton(ctx.i18n.t('button.share'), card.title)],
            [Markup.callbackButton(ctx.i18n.t('button.back'), `back:${index}`)]
        ];

        // 25 hours.
        if (new Date().getTime() - date.getTime() >= 90000000) {
            keyboard = [
                [Markup.urlButton(ctx.i18n.t('button.viewOnPlatform'), card.url)],
                [Markup.switchToChatButton(ctx.i18n.t('button.share'), card.title)],
                [Markup.callbackButton(ctx.i18n.t('button.back'), `back:${index}`)]
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

            const meta = {
                like: like == undefined ? 0 : like,
                dislike: dislike == undefined ? 0 : dislike,
                comments: comments.length <= 0 ? 0 : comments,
            };

            ctx.editMessageText(
                ctx.i18n.t('me.preview', {
                    title: card.title,
                    description: card.description === undefined ? ctx.i18n.t('me.noDescription') : card.description,
                    like: meta.like,
                    dislike: meta.dislike,
                    comments: meta.comments,
                    date: publishedAt,
                }),
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard(keyboard),
                }
            );
    
            ctx.scene.leave('titleEdit');
            ctx.scene.leave('descriptionEdit');
            ctx.answerCbQuery();
        });
    } catch (err) {
        replyWithError(ctx, 19);
        console.error(err);
    }
};