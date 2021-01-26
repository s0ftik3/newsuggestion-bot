const Card = require('../database/models/Card');

module.exports = () => (ctx) => {

    try {

        Card.find({ author: ctx.from.id }).then(response => {
            
            if (response.length <= 0) return ctx.replyWithMarkdown(`You didn't submit any cards.`);

            let result = [];

            response.forEach(e => {

                let status;

                if (e.isPublished == false && e.isDeclined == false) {

                    status = 'waiting for approval.';

                } else if (e.isDeclined == true) {

                    status = 'declined.';

                } else if (e.isPublished == true) {

                    status = `[published.](${e.url})`;

                }

                result.push(`_«${(e.title.length > 64) ? e.title.slice(0, 64) + '...' : e.title}»_ — ${status}`);

            });

            ctx.replyWithMarkdown(`Your cards:\n\n${result.join('\n')}\n\nTotal card(s) suggested: ${response.length}`, { disable_web_page_preview: true });

        })        

    } catch (error) {

        console.error(error);

    };

};