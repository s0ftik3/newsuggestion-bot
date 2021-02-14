const Card = require('../database/models/Card');
const axios = require('axios');
const cheerio = require('cheerio');
const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {

    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        Card.find({ author: ctx.from.id }).then(async response => {
            
            if (response.length <= 0) return ctx.replyWithMarkdown(ctx.i18n.t('service.noCards'));

            await ctx.replyWithMarkdown(ctx.i18n.t('service.standby')).then(data => message_id = data.message_id);

            let result = [];
            let reversedArr = response.reverse();
            let suggestions = (response.length > 15) ? 15 : response.length;

            for (let i = 0; i < suggestions; i++) {

                let status;
                let ratio;

                await axios(reversedArr[i].url).then(response => {

                    const $ = cheerio.load(response.data);
                    const likes = $('body').find('span[class="cd-issue-like bt-active-btn"]').find('span[class="value"]').attr('data-value');
                    const dislikes = $('body').find('span[class="cd-issue-dislike bt-active-btn"]').find('span[class="value"]').attr('data-value');

                    status = `[${ctx.i18n.t('service.viewCard')}](${reversedArr[i].url}).`;
                    ratio = `\`(👍 ${(likes == undefined) ? 0 : likes}, 👎 ${(dislikes == undefined) ? 0 : dislikes})\``;

                });

                result.push(`${ratio} _«${(reversedArr[i].title.length > 64) ? reversedArr[i].title.slice(0, 64) + '...' : reversedArr[i].title}»_ — ${status}`);

            }

            const header = (response.length > 15) ? `*${ctx.i18n.t('service.lastCards')}:*\n\n...\n` : `*${ctx.i18n.t('service.yourCards')}*\n\n`;
            const body = result.reverse().join('\n');

            ctx.telegram.editMessageText(ctx.from.id, message_id, null, `${header}${body}\n\n*${ctx.i18n.t('service.totalCards')}:* ${response.length}`, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            });
      
        })        

    } catch (error) {

        console.error(error);

    };

};