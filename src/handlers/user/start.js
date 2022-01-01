const Markup = require("telegraf/markup");
const getUser = require("../../database/getUser");
const recordUser = require("../../database/recordUser");
const replyWithError = require("../../scripts/replyWithError");

module.exports = () => async (ctx) => {
    try {
        if (ctx.chat.type !== "private") return;
        const user = await getUser(ctx.from.id);

        if (user === null) {
            const data = {
                id: ctx.from.id,
                firstName:
                    ctx.from.first_name == undefined
                        ? null
                        : ctx.from.first_name,
                lastName:
                    ctx.from.last_name == undefined ? null : ctx.from.last_name,
                username:
                    ctx.from.username == undefined ? null : ctx.from.username,
                timestamp: new Date(),
            };

            recordUser(data).then(() => {
                ctx.replyWithMarkdown(ctx.i18n.t("service.greeting"));
            });
        } else {
            ctx.session.user = user;
            ctx.i18n.locale(ctx.session.user.language);

            if (ctx.updateType === "callback_query") {
                ctx.editMessageText(
                    ctx.i18n.t("service.greeting", {
                        name: ctx.from.first_name,
                    }),
                );

                ctx.answerCbQuery();
            } else {
                ctx.replyWithMarkdown(
                    ctx.i18n.t("service.greeting", {
                        name: ctx.from.first_name,
                    }),
                );
            }
        }
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};
