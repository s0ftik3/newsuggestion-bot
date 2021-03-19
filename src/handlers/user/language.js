const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const addBackButton = require('../../scripts/addBackButton');
const replyWithError = require('../../scripts/replyWithError');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true,
});

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx).then((response) => response);
        ctx.i18n.locale(user.language);

        if (ctx.match[0].match(/setLang/)) {
            const language = ctx.match[0].split(':')[1];
            ctx.i18n.locale(language);

            await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {});
            ctx.session.user.language = language;
        }

        const buttons = [];
        const localesFolder = fs.readdirSync('./src/locales/');
        localesFolder.forEach((file) => {
            let localization = file.split('.')[0];
            buttons.push(Markup.callbackButton(i18n.t(localization, 'language'), `setLang:${localization}`));
        });

        const keyboard = buttons.filter((e) => e.callback_data != `setLang:${ctx.session.user.language}`);
        const finalKeyboard = addBackButton(Markup.inlineKeyboard(keyboard, { columns: 2 }), user.language);

        ctx.editMessageText(ctx.i18n.t('service.changeLang'), {
            reply_markup: finalKeyboard,
        });

        ctx.answerCbQuery();
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};