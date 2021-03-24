const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const replyWithError = require('../../scripts/replyWithError');

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        let bottom = [Markup.callbackButton(ctx.i18n.t('button.back'), 'backStart')];

        if (user.role === 'admin' || user.role === 'moderator') {
            bottom = [Markup.callbackButton('Admin panel', 'adminPanel'), Markup.callbackButton(ctx.i18n.t('button.back'), 'backStart')];
        }

        if (ctx.updateType === 'callback_query') {
            const action = Array.isArray(ctx.match) ? ctx.match[0].split(':')[0] : ctx.match;

            switch (action) {
                case 'settings':
                    ctx.editMessageText(ctx.i18n.t('service.settings'), {
                        reply_markup: Markup.inlineKeyboard([
                            [
                                Markup.callbackButton(ctx.i18n.t('button.language'), `language`),
                                Markup.callbackButton(
                                    ctx.i18n.t('button.neverAskMedia', {
                                        condition: user.neverAskMedia ? '✅' : '',
                                    }),
                                    `nam:${user.neverAskMedia ? 'true' : user.neverAskMedia}`
                                ),
                            ],
                            [
                                Markup.callbackButton(
                                    ctx.i18n.t('button.autoTranslate', {
                                        condition: user.autoTranslate ? '✅' : '',
                                    }),
                                    `at:${user.autoTranslate ? 'true' : user.neverAskMedia}`
                                ),
                                Markup.urlButton(ctx.i18n.t('button.reportBug'), `https://t.me/id160`)
                            ],
                            bottom
                        ]),
                    });
                    
                    ctx.scene.leave('description');
                    ctx.scene.leave('media');
                    ctx.scene.leave('title');
                    ctx.answerCbQuery();
                    break;

                case 'nam':
                    await User.updateOne({ id: ctx.from.id }, { $set: { neverAskMedia: user.neverAskMedia ? false : true } }, () => {});
                    ctx.session.user.neverAskMedia = user.neverAskMedia ? false : true;

                    ctx.editMessageText(ctx.i18n.t('service.settings'), {
                        reply_markup: Markup.inlineKeyboard([
                            [
                                Markup.callbackButton(ctx.i18n.t('button.language'), `language`),
                                Markup.callbackButton(
                                    ctx.i18n.t('button.neverAskMedia', {
                                        condition: ctx.session.user.neverAskMedia ? '✅' : '',
                                    }),
                                    `nam:${ctx.session.user.neverAskMedia ? 'true' : ctx.session.user.neverAskMedia}`
                                ),
                            ],
                            [
                                Markup.callbackButton(
                                    ctx.i18n.t('button.autoTranslate', {
                                        condition: user.autoTranslate ? '✅' : '',
                                    }),
                                    `at:${user.autoTranslate ? 'true' : user.neverAskMedia}`
                                ),
                                Markup.urlButton(ctx.i18n.t('button.reportBug'), `https://t.me/id160`)
                            ],
                            bottom
                        ]),
                    });

                    ctx.answerCbQuery();
                    break;
                
                case 'at':
                    if (user.language === 'en') return replyWithError(ctx, 21);
                    await User.updateOne({ id: ctx.from.id }, { $set: { autoTranslate: user.autoTranslate ? false : true } }, () => {});
                    ctx.session.user.autoTranslate = user.autoTranslate ? false : true;
                
                    ctx.editMessageText(ctx.i18n.t('service.settings'), {
                        reply_markup: Markup.inlineKeyboard([
                            [
                                Markup.callbackButton(ctx.i18n.t('button.language'), `language`),
                                Markup.callbackButton(
                                    ctx.i18n.t('button.neverAskMedia', {
                                        condition: user.neverAskMedia ? '✅' : '',
                                    }),
                                    `nam:${user.neverAskMedia ? 'true' : user.neverAskMedia}`
                                ),
                            ],
                            [
                                Markup.callbackButton(
                                    ctx.i18n.t('button.autoTranslate', {
                                        condition: ctx.session.user.autoTranslate ? '✅' : '',
                                    }),
                                    `at:${ctx.session.user.autoTranslate ? 'true' : ctx.session.user.autoTranslate}`
                                ),
                                Markup.urlButton(ctx.i18n.t('button.reportBug'), `https://t.me/id160`)
                            ],
                            bottom
                        ]),
                    });

                    if (ctx.session.user.autoTranslate) {
                        ctx.answerCbQuery(ctx.i18n.t('service.autoTranslateWarning'), true);
                    } else {
                        ctx.answerCbQuery();
                    }
                    break;
            }
        } else {
            ctx.reply(ctx.i18n.t('service.settings'), {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.i18n.t('button.language'), `language`),
                        Markup.callbackButton(
                            ctx.i18n.t('button.neverAskMedia', {
                                condition: user.neverAskMedia ? '✅' : '',
                            }),
                            `nam:${user.neverAskMedia ? 'true' : user.neverAskMedia}`
                        ),
                    ],
                    [
                        Markup.callbackButton(
                            ctx.i18n.t('button.autoTranslate', {
                                condition: user.autoTranslate ? '✅' : '',
                            }),
                            `at:${user.autoTranslate ? 'true' : user.neverAskMedia}`
                        ),
                        Markup.urlButton(ctx.i18n.t('button.reportBug'), `https://t.me/id160`)
                    ],
                    bottom
                ]),
            });
        }
    } catch (error) {
        replyWithError(ctx, 0);
        console.error(error);
    }
};