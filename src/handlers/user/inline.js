const User = require('../../database/models/User');

module.exports = () => async (ctx) => {
    try {
        const query = ctx.inlineQuery.query;
        const cards = await User.find({ id: ctx.from.id }).then(response => response[0].cards);
        const filtered = cards.filter(e => e.url !== null && e.title !== undefined && e.description !== undefined);
        const k = (filtered.length > 50) ? 50 : filtered.length;

        if (query.length <= 0) {
            const result = [];

            for (let i = 0; i < k; i++) {
                if (filtered[i] === undefined) continue;
                const title = (filtered[i].title === undefined) ? 'Not specified' : filtered[i].title;
                const description = (filtered[i].description === undefined) ? 'Not specified' : filtered[i].description;
    
                result.push({
                    type: 'article',
                    id: i,
                    title: title,
                    description: (description.length > 40) ? description.slice(0, 40) + '...' : description,
                    input_message_content: {
                        message_text: ctx.i18n.t('me.shareSuggestion', { url: filtered[i].url }),
                        parse_mode: 'Markdown'
                    }
                });
            }
    
            ctx.answerInlineQuery(result, {
                cache_time: 10
            });
        } else {
            const result = [];

            for (let i = 0; i < filtered.length; i++) {
                const cardName = filtered[i].title;
                if (cardName.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                    if (filtered[i] === undefined) continue;
                    const title = (filtered[i].title === undefined) ? 'Not specified' : filtered[i].title;
                    const description = (filtered[i].description === undefined) ? 'Not specified' : filtered[i].description;

                    result.push({
                        type: 'article',
                        id: i,
                        title: title,
                        description: (description.length > 40) ? description.slice(0, 40) + '...' : description,
                        input_message_content: {
                            message_text: ctx.i18n.t('me.shareSuggestion', { url: filtered[i].url }),
                            parse_mode: 'Markdown'
                        }
                    });
                } else {
                    continue
                }
            }

            ctx.answerInlineQuery(result, {
                cache_time: 10
            });
        }
    } catch (error) {
        console.error(error);
    }
};