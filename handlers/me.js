const Card = require('../database/models/Card');

module.exports = () => (ctx) => {

    try {

        Card.find({ author: ctx.from.id }).then(response => {
            
            if (response.length <= 0) return ctx.replyWithMarkdown(`You didn't submit any cards.`);

            let result = [];
            let reversedArr = response.reverse();
            let k = (response.length > 15) ? 15 : response.length;

            for (let i = 0; i < k; i++) {

                let status;

                if (reversedArr[i].isPublished == false && reversedArr[i].isDeclined == false) {

                    status = 'waiting for approval.';

                } else if (reversedArr[i].isDeclined == true) {

                    status = 'declined.';

                } else if (reversedArr[i].isPublished == true) {

                    status = `[published](${reversedArr[i].url}).`;

                }

                result.push(`_«${(reversedArr[i].title.length > 64) ? reversedArr[i].title.slice(0, 64) + '...' : reversedArr[i].title}»_ — ${status}`);

            }

            ctx.replyWithMarkdown(`${(response.length > 15) ? '*Last 15 cards of yours:*\n\n...\n' : '*Your cards:*\n\n'}${result.reverse().join('\n')}\n\n*Total cards suggested:* ${response.length}`, { disable_web_page_preview: true });

        })        

    } catch (error) {

        console.error(error);

    };

};