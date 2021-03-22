'use strict';

/**
 * 0 default;
 * 1 limit_exceeded;
 * 2 title_too_long;
 * 3 mediaGroup;
 * 4 wrongMedia;
 * 5 maxSize;
 * 6 noText;
 * 7 descritpionWrongLanguage;
 * 8 titleWrongLanguage;
 * 9 titleTheSame;
 * 10 descriptionTheSame;
 * 11 titleNotEdited;
 * 12 descriptionNotEdited;
 * 13 cardNotDeleted;
 * 14 title_too_short;
 * 15 description_too_short;
 * 16 sendDescription;
 * 17 sendTitle;
 * 18 edit default;
 * 19 callback default;
 * 20 user banned;
 * 21 autoTranslateFailed;
 */
module.exports = (ctx, code) => {
    try {
        ctx.i18n.locale((ctx.session.user === undefined) ? 'en' : ctx.session.user.language);

        switch (code) {
            case 0:
                ctx.reply(ctx.i18n.t('error.default'));
                break;
            case 1:
                const a = () => ctx.answerCbQuery(ctx.i18n.t('error.limit_exceeded'), true);
                const b = () => ctx.reply(ctx.i18n.t('error.limit_exceeded'));
                (ctx.updateType === 'callback_query') ? a() : b();
                break;
            case 2:
                ctx.reply(ctx.i18n.t('error.title_too_long'));
                break;
            case 3:
                ctx.reply(ctx.i18n.t('error.mediaGroup'));
                break;
            case 4:
                ctx.reply(ctx.i18n.t('error.wrongMedia'));
                break;
            case 5:
                ctx.reply(ctx.i18n.t('error.maxSize'));
                break;
            case 6:
                ctx.reply(ctx.i18n.t('error.noText'));
                break;
            case 7:
                ctx.reply(ctx.i18n.t('error.descritpionWrongLanguage'));
                break;
            case 8:
                ctx.reply(ctx.i18n.t('error.titleWrongLanguage'));
                break;
            case 9:
                ctx.reply(ctx.i18n.t('error.titleTheSame'));
                break;
            case 10:
                ctx.reply(ctx.i18n.t('error.descriptionTheSame'));
                break;
            case 11:
                ctx.reply(ctx.i18n.t('error.titleNotEdited'));
                break;
            case 12:
                ctx.reply(ctx.i18n.t('error.descriptionNotEdited'));
                break;
            case 13:
                ctx.reply(ctx.i18n.t('error.cardNotDeleted'));
                break;
            case 14:
                ctx.reply(ctx.i18n.t('error.title_too_short'));
                break;
            case 15:
                ctx.replyWithMarkdown(ctx.i18n.t('error.description_too_short'));
                break;
            case 16:
                ctx.reply(ctx.i18n.t('error.sendDescription'));
                break;
            case 17:
                ctx.reply(ctx.i18n.t('error.sendTitle'));
                break;
            case 18:
                ctx.editMessageText(ctx.i18n.t('error.default'));
                break;
            case 19:
                ctx.answerCbQuery(ctx.i18n.t('error.default'));
                break;
            case 20:
                const c = () => ctx.answerCbQuery(ctx.i18n.t('error.banned'), true);
                const d = () => ctx.reply(ctx.i18n.t('error.banned'));
                (ctx.updateType === 'callback_query') ? c() : d();
                break;
            case 21:
                ctx.answerCbQuery(ctx.i18n.t('error.autoTranslateFailed'), true);
                break;
            default:
                ctx.reply(ctx.i18n.t('error.default'));
                break;
        }
    } catch (err) {
        console.error(err);
    }
};