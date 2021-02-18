const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const getUser = require('../../database/getUser');

module.exports = () => async (ctx) => {
    try {

        const user = await getUser(ctx.from.id).then(response => response);

        if (ctx.session.user === undefined) {
            
            if (user === false) {

                const userData = {
                    id: ctx.from.id,
                    firstName: (ctx.from.first_name == undefined) ? null : ctx.from.first_name,
                    lastName: (ctx.from.last_name == undefined) ? null : ctx.from.last_name,
                    username: (ctx.from.username == undefined) ? null : ctx.from.username,
                    timestamp: new Date()
                }
                const user = new User(userData);
                user.save().then(() => console.log(`${ctx.from.id}: user recorded.`));

                ctx.replyWithMarkdown(ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), {
                    reply_markup: Markup.inlineKeyboard([
                        Markup.callbackButton(ctx.i18n.t('button.sFeature'), 'sFeature'),
                        Markup.callbackButton(ctx.i18n.t('button.sLanguage'), 'sLanguage'),
                        Markup.callbackButton(ctx.i18n.t('button.language'), 'language')
                    ], { columns: 1 })
                });

            } else {

                ctx.session.user = user;
                ctx.i18n.locale(ctx.session.user.language);

                if (ctx.updateType == 'callback_query') {

                    ctx.editMessageText(ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), {
                        parse_mode: 'Markdown',
                        reply_markup: Markup.inlineKeyboard([
                            Markup.callbackButton(ctx.i18n.t('button.sFeature'), 'sFeature'),
                            Markup.callbackButton(ctx.i18n.t('button.sLanguage'), 'sLanguage'),
                            Markup.callbackButton(ctx.i18n.t('button.language'), 'language')
                        ], { columns: 1 })
                    });

                    ctx.answerCbQuery();

                } else {
    
                    ctx.replyWithMarkdown(ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), {
                        reply_markup: Markup.inlineKeyboard([
                            Markup.callbackButton(ctx.i18n.t('button.sFeature'), 'sFeature'),
                            Markup.callbackButton(ctx.i18n.t('button.sLanguage'), 'sLanguage'),
                            Markup.callbackButton(ctx.i18n.t('button.language'), 'language')
                        ], { columns: 1 })
                    });

                }

            }

        } else {

            ctx.session.user = user;
            ctx.i18n.locale(ctx.session.user.language);

            if (ctx.updateType == 'callback_query') {

                ctx.editMessageText(ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), {
                    parse_mode: 'Markdown',
                    reply_markup: Markup.inlineKeyboard([
                        Markup.callbackButton(ctx.i18n.t('button.sFeature'), 'sFeature'),
                        Markup.callbackButton(ctx.i18n.t('button.sLanguage'), 'sLanguage'),
                        Markup.callbackButton(ctx.i18n.t('button.language'), 'language')
                    ], { columns: 1 })
                });

                ctx.answerCbQuery();

            } else {

                ctx.replyWithMarkdown(ctx.i18n.t('service.greeting', { name: ctx.from.first_name }), {
                    reply_markup: Markup.inlineKeyboard([
                        Markup.callbackButton(ctx.i18n.t('button.sFeature'), 'sFeature'),
                        Markup.callbackButton(ctx.i18n.t('button.sLanguage'), 'sLanguage'),
                        Markup.callbackButton(ctx.i18n.t('button.language'), 'language')
                    ], { columns: 1 })
                });

            }

        }

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }
}