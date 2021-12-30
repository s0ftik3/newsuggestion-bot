const Markup = require("telegraf/markup");
const getUserSession = require("../../scripts/getUserSession");
const getMedia = require("../../scripts/getMedia");
const replyWithError = require("../../scripts/replyWithError");

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx).then((response) => response);
        ctx.i18n.locale(user.language);

        if (user.banned) return replyWithError(ctx, 20);

        if (ctx.updateSubTypes[0] === "text") return replyWithError(ctx, 6);

        if (ctx.updateType === "callback_query") {
            ctx.editMessageText(ctx.i18n.t("newSuggestion.title"), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(
                            ctx.i18n.t("button.cancel"),
                            "cancel",
                        ),
                    ],
                ]),
            }).then((response) => {
                ctx.session.msg_id = response.message_id;
            });

            ctx.answerCbQuery();
        } else {
            ctx.telegram.editMessageReplyMarkup(
                ctx.update.message.chat.id,
                ctx.session.msg_id,
                {},
            );

            // Currently it supports ONLY ONE media file.
            const media = await getMedia(ctx);
            if (media === "MEDIA_GROUP_DETECTED") return replyWithError(ctx, 3);
            if (media === "WRONG_MEDIA_FILE") return replyWithError(ctx, 4);
            if (media === "MAX_SIZE_EXCEEDED") return replyWithError(ctx, 5);
            if (media === "REPEATED_MEDIA_GROUP") return;

            ctx.replyWithMarkdown(ctx.i18n.t("newSuggestion.title"), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(
                            ctx.i18n.t("button.cancel"),
                            "cancel",
                        ),
                    ],
                ]),
            }).then((response) => {
                ctx.session.msg_id = response.message_id;
            });
        }

        ctx.scene.leave("media");
        ctx.scene.enter("title");
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};
