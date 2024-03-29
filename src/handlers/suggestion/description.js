const Markup = require("telegraf/markup");
const getUserSession = require("../../scripts/getUserSession");
const replyWithError = require("../../scripts/replyWithError");
const application = {
    tgdroid: 0,
    tgios: 1,
    tgdesk: 2,
    tgmac: 3,
    tgx: 4,
    tgweb: 5,
    tgwebk: 6,
    tgwebz: 7,
    ddapp: 8,
};

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx).then((response) => response);
        ctx.i18n.locale(user.language);

        if (user.banned) return replyWithError(ctx, 20);

        const chosenOption = ctx.match.toString().split(":")[1];
        ctx.session.newCard.app = application[chosenOption];

        ctx.editMessageText(ctx.i18n.t("newSuggestion.description"), {
            parse_mode: "Markdown",
            reply_markup: Markup.inlineKeyboard([
                [Markup.callbackButton(ctx.i18n.t("button.cancel"), "cancel")],
            ]),
        }).then((response) => {
            ctx.session.msg_id = response.message_id;
        });

        ctx.answerCbQuery();
        ctx.scene.enter("description");
    } catch (err) {
        replyWithError(ctx, 18);
        ctx.answerCbQuery();
        console.error(err);
    }
};
