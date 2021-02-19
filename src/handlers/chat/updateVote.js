const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        const action = ctx.match.toString().split(':')[0];
        const card = ctx.match.toString().split(':')[1];

        await Card.find({ card_id: card }).then(response => {

            if (response.length <= 0) return ctx.answerCbQuery(ctx.i18n.t('error.default'));

            const isVoted = (response[0].votedPeople.filter(e => e.user == ctx.from.id).length <= 0) ? false : true;

            if (!isVoted) {

                const newArr = [...response[0].votedPeople, { user: ctx.from.id, action: action }];

                switch(action) {

                    case 'like':
                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`👍 ${response[0].like + 1}`, `like:${card}`),
                                Markup.callbackButton(`${(response[0].dislike <= 0) ? '👎' : `👎 ${response[0].dislike}`}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { votedPeople: newArr, like: response[0].like + 1 } }, () => {});
                        ctx.answerCbQuery();

                        break;

                    case 'dislike':
                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`${(response[0].like <= 0) ? '👍' : `👍 ${response[0].like}`}`, `like:${card}`),
                                Markup.callbackButton(`👎 ${response[0].dislike + 1}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { votedPeople: newArr, dislike: response[0].dislike + 1 } }, () => {});
                        ctx.answerCbQuery();

                        break;
                    
                }

            } else {

                if (action != response[0].votedPeople.find(e => e.user == ctx.from.id).action) return ctx.answerCbQuery(ctx.i18n.t('suggestion.retractVote'));

                switch(action) {

                    case 'like':
                        let likeArr = response[0].votedPeople;
                        let likeObj = likeArr.find(e => e.user == ctx.from.id);
                        const likeIndex = likeArr.indexOf(likeObj);
                        likeArr.splice(likeIndex, 1);

                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`${((response[0].like - 1) <= 0) ? '👍' : `👍 ${response[0].like - 1}`}`, `like:${card}`),
                                Markup.callbackButton(`${(response[0].dislike <= 0) ? '👎' : `👎 ${response[0].dislike}`}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { votedPeople: likeArr, like: response[0].like - 1 } }, () => {});
                        ctx.answerCbQuery(ctx.i18n.t('suggestion.retracted'));

                        break;

                    case 'dislike':
                        let dislikeArr = response[0].votedPeople;
                        let dislikeObj = dislikeArr.find(e => e.user == ctx.from.id);
                        const dislikeIndex = dislikeArr.indexOf(dislikeObj);
                        dislikeArr.splice(dislikeIndex, 1);

                        ctx.editMessageReplyMarkup(Markup.inlineKeyboard([
                                Markup.callbackButton(`${(response[0].like <= 0) ? '👍' : `👍 ${response[0].like}`}`, `like:${card}`),
                                Markup.callbackButton(`${((response[0].dislike - 1) <= 0) ? '👎' : `👎 ${response[0].dislike - 1}`}`, `dislike:${card}`)
                            ], { columns: 2 })
                        );
                        Card.updateOne({ card_id: card }, { $set: { votedPeople: dislikeArr, dislike: response[0].dislike - 1 } }, () => {});
                        ctx.answerCbQuery(ctx.i18n.t('suggestion.retracted'));

                        break;
                    
                }

            }
            
        });

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.answerCbQuery(ctx.i18n.t('error.default'));
        console.error(err);

    }
};