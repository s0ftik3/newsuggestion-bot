const Markup = require('telegraf/markup');
const axios = require('axios');
const cheerio = require('cheerio');
const getUserSession = require('../../scripts/getUserSession');
const languageCheck = require('../../scripts/languageCheck');
const config = require('../../../config').card;

module.exports = () => async (ctx) => {
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        if (ctx.message.text.length > config.title_maximum_length) return ctx.reply(ctx.i18n.t('error.title_too_long'));
        if (ctx.message.text.length < config.title_minimum_length) return ctx.reply(ctx.i18n.t('error.title_too_short'));
        if (ctx.message.text.match(/^\/start|\/me|\/new|\/suggest$/gi) !== null) return ctx.reply(ctx.i18n.t('error.sendTitle'));
        if (!languageCheck(ctx.message.text)) return ctx.reply(ctx.i18n.t(`error.titleWrongLanguage`));

        ctx.telegram.editMessageReplyMarkup(ctx.update.message.chat.id, ctx.session.msg_id, {});

        const title = ctx.message.text;
        ctx.session.newCard.title = title.replace(/[\r\n]{1,}/g, ' ');
        const description = ctx.session.newCard.description.replace(/[\r\n]{3,}/g, ' ');
        const app = ctx.session.newCard.app;

        const url = 'https://bugs.telegram.org/?type=suggestions&sort=rate&query=' + encodeURIComponent(title);

        const data = await axios(url).then(async response => {

            // Load page.
            const $ = cheerio.load(response.data);

            // Fetch cards.
            const cards = $('body').find('section[class="cd-content with-trending"]').find('a');

            // Fetch each card's link.
            let pre_link = [];
            cards.each((i, e) => {
                pre_link.push(e.attribs.href);
            });

            // Fetch each card's name.
            let pre_name = [];
            cards.find('div[class="bt-card-title"]').text().split('\n').forEach(e => {
                pre_name.push(e.replace(/\s+/g, ' ').trim());
            });
            
            // Create separate arrays for titles and links.
            const titles = pre_name.filter(e => e.length > 0);
            const links = pre_link.filter(e => e != undefined);

            return { titles: titles, links: links };

        });

        if (data.titles.length <= 0) {

            const name = {
                0: ctx.i18n.t('application.tgdroid'),
                1: ctx.i18n.t('application.tgios'),
                2: ctx.i18n.t('application.tgdesk'),
                3: ctx.i18n.t('application.tgmac'),
                4: ctx.i18n.t('application.tgx'),
                5: ctx.i18n.t('application.tgweb'),
                6: ctx.i18n.t('application.ddapp')
            };

            ctx.replyWithHTML(ctx.i18n.t('newSuggestion.preview', {
                title: title.replace(/[\r\n]{1,}/g, ' '),
                description: description,
                app: name[app],
                attachments: (ctx.session.newCard.media === null) ? 0 : 1
            }), {
                reply_markup: Markup.inlineKeyboard([
                    Markup.callbackButton(ctx.i18n.t('button.submit'), 'publish'),
                    Markup.callbackButton(ctx.i18n.t('button.cancel'), 'cancel')
                ], { columns: 2 })
            });

        } else {

            let suggestions = [];

            for (let i = 0; i < data.links.length; i++) {

                suggestions.push(`[«${data.titles[i].replace(/[\[\]']+/g, '')}»](https://bugs.telegram.org${data.links[i]})`);

            }

            await ctx.replyWithMarkdown(ctx.i18n.t('newSuggestion.similar') + '\n\n' + suggestions.join('\n'), {
                disable_web_page_preview: true
            });

            ctx.reply(ctx.i18n.t('newSuggestion.see_similar'), {
                reply_markup: Markup.inlineKeyboard([
                    Markup.callbackButton(ctx.i18n.t('button.yes'), 'cancel'),
                    Markup.callbackButton(ctx.i18n.t('button.no'), 'check')
                ], { columns: 2 })
            });

        }

        ctx.scene.leave('title');

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }
}