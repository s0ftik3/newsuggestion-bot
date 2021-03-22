const getUserSession = require('../../scripts/getUserSession');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        if (ctx.session.newCard === undefined || ctx.session.newCard.media === null) {
            ctx.editMessageText(ctx.i18n.t('newSuggestion.cancel'));
        } else {
            ctx.deleteMessage();
            ctx.reply(ctx.i18n.t('newSuggestion.cancel'));
        }

        ctx.session.newCard = {};
        ctx.scene.leave('description');
        ctx.scene.leave('media');
        ctx.scene.leave('title');
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};