const Markup = require('telegraf/markup');
const config = require('../../config');
const axios = require('axios');
const cheerio = require('cheerio');
const application = config.platforms;
const attachment = config.types;

module.exports = () => (ctx) => {
    try {  

        if (ctx.message.text.length > 128) return ctx.reply('Your suggestion\'s title must be less than 128 characters.');

        const suggestionTitle = ctx.message.text;
        ctx.session.suggestionTitle = suggestionTitle;
        const suggestionMedia = attachment[ctx.session.suggestionMedia.type];
        const suggestionText = ctx.session.suggestionText.replace(/[\r\n]{3,}/g, ' ');
        const suggestionAuthor = (ctx.from.username != undefined) ? `@${ctx.from.username}` : ctx.from.first_name;
        const suggestionPlatform = application[ctx.session.suggestionPlatform];

        const url = 'https://bugs.telegram.org/?type=suggestions&sort=rate&query=' + encodeURIComponent(suggestionTitle);

        axios(url).then(async response => {

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

            // If there are no any similar suggestions.
            if (titles.length <= 0) {

                const message = 
                    `<b>Title:</b> <code>${suggestionTitle.replace(/[\r\n]{1,}/g, ' ')}</code> by ${suggestionAuthor}\n\n` +
                    `<b>Description:</b>\n<code>${suggestionText}</code>\n\n` +
                    `<b>App:</b> ${suggestionPlatform}\n\n` +
                    `<b>Attachments:</b> ${suggestionMedia}\n\n`;

                await ctx.replyWithHTML(message);

                ctx.replyWithMarkdown('*Submit this suggestion?*', {
                    parse_mode: 'Markdown',
                    reply_markup: Markup.inlineKeyboard([
                        Markup.callbackButton('Yes', 'publish'),
                        Markup.callbackButton('No', 'cancel')
                    ], { columns: 2 })
                });

            } else { // If there are.

                let suggestions = [];

                for (let i = 0; i < links.length; i++) {

                    suggestions.push(`[«${titles[i].replace(/[\[\]']+/g, '')}»](https://bugs.telegram.org${links[i]})`);
    
                }
    
                await ctx.replyWithMarkdown('To avoid repeating suggestions, please check if you see any similar ones below.\n\n' + suggestions.join('\n'), {
                    disable_web_page_preview: true
                });
    
                ctx.replyWithMarkdown('*Do you see any similar suggestions?*', {
                    parse_mode: 'Markdown',
                    reply_markup: Markup.inlineKeyboard([
                        Markup.callbackButton('Yes', 'cancel'),
                        Markup.callbackButton('No', 'check')
                    ], { columns: 2 })
                });

            }

        });

        ctx.scene.leave('suggestionTitle');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}