const getUserSession = require('../scripts/getUserSession');

module.exports = () => async (ctx) => {
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        ctx.editMessageText(ctx.i18n.t('newSuggestion.cancel'));

        ctx.scene.leave('description');
        ctx.scene.leave('media');
        ctx.scene.leave('title');

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }
}