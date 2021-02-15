const User = require('../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../scripts/getUserSession');
const fs = require('fs');
const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, '../locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

module.exports = () => async (ctx) => {
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        if (ctx.match[0].match(/setLang/)) {

            const language = ctx.match[0].split(':')[1];
            ctx.i18n.locale(language);
    
            await User.updateOne({ id: ctx.from.id }, { $set: { language: language } }, () => {});
            ctx.session.user.language = language;

        }

        const buttons = [];

        const locales_folder = fs.readdirSync('./src/locales/');

        locales_folder.forEach(file => {

            let localization = file.split('.')[0];
            buttons.push(
                Markup.callbackButton(i18n.t(localization, 'language'), `setLang:${localization}`)
            );
                    
        });

        let keyboard = buttons.filter(e => e.callback_data != `setLang:${ctx.session.user.language}`);
        keyboard.push({ text: ctx.i18n.t('button.back'), callback_data: 'backStart' });

        ctx.editMessageText(ctx.i18n.t('service.changeLang'), {
            reply_markup: Markup.inlineKeyboard(keyboard, { columns: 2 })
        });

        ctx.answerCbQuery();

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }
}