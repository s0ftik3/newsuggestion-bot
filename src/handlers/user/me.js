const Card = require('../../database/models/Card');
const getUserSession = require('../../scripts/getUserSession');
const createMePage = require('../../scripts/createMePage');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        if (ctx.chat.type !== 'private') return;
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        const data = await Card.find({ author: ctx.from.id });

        if (data.length <= 0) return ctx.reply(ctx.i18n.t('me.noCards'));

        createMePage(ctx, data);
    } catch (error) {
        replyWithError(ctx, 0);
        console.error(error);
    }
};