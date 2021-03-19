const getUserSession = require('../../scripts/getUserSession');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        ctx.editMessageText(ctx.i18n.t('newSuggestion.cancel'));

        ctx.scene.leave('description');
        ctx.scene.leave('media');
        ctx.scene.leave('title');
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};