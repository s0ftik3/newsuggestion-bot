const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');

module.exports = () => (ctx) => {
    try {

        const action = ctx.match.toString().split(':')[0];
        const card = ctx.match.toString().split(':')[1];

        Card.find({ card_id: card }).then(response => {

            const isVoted = (response[0].voted.filter(e => e.voted == ctx.from.id).length <= 0) ? false : true;

            if (!isVoted) {

                const newArr = [...response[0].voted, { voted: ctx.from.id, action: action }];

                switch(action) {

                    case 'like':
                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`👍 ${response[0].likes + 1}`, `like:${card}`),
                                Markup.callbackButton(`👎 ${response[0].dislikes}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { voted: newArr, likes: response[0].likes + 1 } }, () => {});
                        ctx.answerCbQuery();

                        break;

                    case 'dislike':
                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`👍 ${response[0].likes}`, `like:${card}`),
                                Markup.callbackButton(`👎 ${response[0].dislikes + 1}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { voted: newArr, dislikes: response[0].dislikes + 1 } }, () => {});
                        ctx.answerCbQuery();

                        break;
                    
                }

            } else {

                if (action != response[0].voted.find(e => e.voted == ctx.from.id).action) return ctx.answerCbQuery('You\'ve already voted!');

                switch(action) {

                    case 'like':
                        let likeArr = response[0].voted;
                        let likeObj = likeArr.find(e => e.voted == ctx.from.id);
                        const likeIndex = likeArr.indexOf(likeObj);
                        likeArr.splice(likeIndex, 1);

                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`👍 ${response[0].likes - 1}`, `like:${card}`),
                                Markup.callbackButton(`👎 ${response[0].dislikes}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { voted: likeArr, likes: response[0].likes - 1 } }, () => {});
                        ctx.answerCbQuery('You took your vote back.');

                        break;

                    case 'dislike':
                        let dislikeArr = response[0].voted;
                        let dislikeObj = dislikeArr.find(e => e.voted == ctx.from.id);
                        const dislikeIndex = dislikeArr.indexOf(dislikeObj);
                        dislikeArr.splice(dislikeIndex, 1);

                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`👍 ${response[0].likes}`, `like:${card}`),
                                Markup.callbackButton(`👎 ${response[0].dislikes - 1}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { voted: dislikeArr, dislikes: response[0].dislikes - 1 } }, () => {});
                        ctx.answerCbQuery('You took your vote back.');

                        break;
                    
                }

            }
            
        });

    } catch (err) {

        ctx.answerCbQuery('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
};