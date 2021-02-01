const Card = require('../../database/models/Card');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = () => (ctx) => {

    try {

        let message_id;

        Card.find({ author: ctx.from.id }).then(async response => {
            
            if (response.length <= 0) return ctx.replyWithMarkdown(`You didn't submit any cards.`);

            if (response.filter(e => e.isPublished == true).length > 0) await ctx.replyWithMarkdown('🕑 _Please standby..._').then(data => message_id = data.message_id);

            let result = [];
            let reversedArr = response.reverse();
            let suggestions = (response.length > 15) ? 15 : response.length;

            for (let i = 0; i < suggestions; i++) {

                let status;
                let ratio;

                if (reversedArr[i].isPublished == false && reversedArr[i].isDeclined == false) {

                    status = 'waiting for approval.';

                } else if (reversedArr[i].isDeclined == true) {

                    status = 'declined.';

                } else if (reversedArr[i].isPublished == true) {

                    await axios(reversedArr[i].url).then(response => {

                        const $ = cheerio.load(response.data);
                        const likes = $('body').find('span[class="cd-issue-like bt-active-btn"]').find('span[class="value"]').attr('data-value');
                        const dislikes = $('body').find('span[class="cd-issue-dislike bt-active-btn"]').find('span[class="value"]').attr('data-value');

                        status = `[published](${reversedArr[i].url}).`;
                        ratio = `\`(👍 ${(likes == undefined) ? 0 : likes}, 👎 ${(dislikes == undefined) ? 0 : dislikes})\``;

                    });

                }

                result.push(`${ratio} _«${(reversedArr[i].title.length > 64) ? reversedArr[i].title.slice(0, 64) + '...' : reversedArr[i].title}»_ — ${status}`);

            }

            const header = (response.length > 15) ? '*Last 15 cards of yours:*\n\n...\n' : '*Your cards:*\n\n';
            const body = result.reverse().join('\n');

            if (response.filter(e => e.isPublished == true).length > 0) {

                ctx.telegram.editMessageText(ctx.from.id, message_id, null, `${header}${body}\n\n*Total cards suggested:* ${response.length}`, {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                });

            } else {

                ctx.replyWithMarkdown(`${header}${body}\n\n*Total cards suggested:* ${response.length}`, {
                    disable_web_page_preview: true
                });

            }

        })        

    } catch (error) {

        console.error(error);

    };

};