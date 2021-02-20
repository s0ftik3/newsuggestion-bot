const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const cookieChecker = require('../../scripts/cookieChecker');
const languageCheck = require('../../scripts/languageCheck');
const config = require('../../../config').card;

module.exports = () => async (ctx) => {
    
    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        if (ctx.updateType === 'message') {

            const cookie = await cookieChecker().then(response => response);
            const whatToEdit = ctx.session.__scenes.current;
            const cardToEdit = ctx.session.currentlyEditing;
            const card = ctx.session.cards.find(e => e.card_id == cardToEdit);

            const Platform = require('../../platform/platform');
            const platform = new Platform({ 
                ssid: cookie.cookies[2].value, 
                dt: cookie.cookies[1].value, 
                token: cookie.cookies[0].value 
            });

            switch (whatToEdit) {

                case 'titleEdit':
                    const newTitle = ctx.message.text;
                    if (newTitle === card.title) return ctx.reply(ctx.i18n.t('error.titleTheSame'));
                    if (newTitle.length > config.title_maximum_length) return ctx.reply(ctx.i18n.t('error.title_too_long'));
                    if (newTitle.length < config.title_minimum_length) return ctx.reply(ctx.i18n.t('error.title_too_short'));
                    if (newTitle.match(/^\/start|\/me|\/new|\/suggest$/gi) !== null) return ctx.reply(ctx.i18n.t('error.sendTitle'));
                    if (!languageCheck(newTitle)) return ctx.reply(ctx.i18n.t(`error.titleWrongLanguage`));

                    ctx.telegram.editMessageReplyMarkup(ctx.update.message.chat.id, ctx.session.msg_id, {});

                    const editTitleData = {
                        title: newTitle,
                        description: card.description,
                        url_id: card.url.replace(/https:\/\/bugs.telegram.org\/c\//g, '')
                    };

                    const isEditedT = await platform.editSuggestionTitle(editTitleData).then(async response => {
                        if (response) {
                            ctx.reply(ctx.i18n.t('me.titleEdited'), {
                                reply_markup: Markup.inlineKeyboard([
                                    [Markup.callbackButton(ctx.i18n.t('button.back'), `backward:0`)]
                                ])
                            });
                            return true;
                        } else {
                            ctx.reply(ctx.i18n.t('error.titleNotEdited'), {
                                reply_markup: Markup.inlineKeyboard([
                                    [Markup.callbackButton(ctx.i18n.t('button.back'), `backward:0`)]
                                ])
                            });
                            return false;
                        }
                    });

                    if (isEditedT) {
                        Card.updateOne({ card_id: cardToEdit }, { $set: { title: newTitle } }, () => {});
                        const titleCardIndex = ctx.session.cards.indexOf(card);
                        ctx.session.cards[titleCardIndex].title = newTitle;
                    }

                    ctx.scene.leave('titleEdit');
                    break;

                case 'descriptionEdit':
                    const newDescription = ctx.message.text;
                    if (newDescription === card.description) return ctx.reply(ctx.i18n.t('error.descriptionTheSame'));
                    if (newDescription.match(/^\/start|\/me|\/new|\/suggest$/gi) !== null) return ctx.reply(ctx.i18n.t('error.sendDescription'));
                    if (newDescription.length <= config.description_minimum_length) return ctx.replyWithMarkdown(ctx.i18n.t('error.description_too_short'));
                    if (!languageCheck(newDescription)) return ctx.reply(ctx.i18n.t(`error.descritpionWrongLanguage`));

                    ctx.telegram.editMessageReplyMarkup(ctx.update.message.chat.id, ctx.session.msg_id, {});

                    const editDescriptionData = {
                        title: card.title,
                        description: newDescription,
                        url_id: card.url.replace(/https:\/\/bugs.telegram.org\/c\//g, '')
                    };

                    const isEditedD = await platform.editSuggestionDescription(editDescriptionData).then(async response => {
                        if (response) {
                            ctx.reply(ctx.i18n.t('me.descriptionEdited'), {
                                reply_markup: Markup.inlineKeyboard([
                                    [Markup.callbackButton(ctx.i18n.t('button.back'), `backward:0`)]
                                ])
                            });
                            return true;
                        } else {
                            ctx.reply(ctx.i18n.t('error.descriptionNotEdited'), {
                                reply_markup: Markup.inlineKeyboard([
                                    [Markup.callbackButton(ctx.i18n.t('button.back'), `backward:0`)]
                                ])
                            });
                            return false;
                        }
                    });

                    if (isEditedD) {
                        Card.updateOne({ card_id: cardToEdit }, { $set: { description: newDescription } }, () => {});
                        const descriptionCardIndex = ctx.session.cards.indexOf(card);
                        ctx.session.cards[descriptionCardIndex].title = newDescription;    
                    }

                    ctx.scene.leave('descriptionEdit');
                    break;

            }

            return;

        }

        const action = ctx.match[0].split(':')[0];
        const card_id = ctx.match[0].split(':')[1];
        const index = ctx.match.input.split(':')[2];

        switch (action) {

            case 'edit':
                ctx.editMessageText(ctx.i18n.t('me.edit'), {
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(ctx.i18n.t('button.editTitle'), `titleEdit:${card_id}:${index}`),
                            Markup.callbackButton(ctx.i18n.t('button.editDescription'), `descriptionEdit:${card_id}:${index}`)
                        ],
                        [
                            Markup.callbackButton(ctx.i18n.t('button.back'), `view:${card_id}:${index}`)
                        ]
                    ])
                });

                ctx.answerCbQuery();
                break;

            case 'titleEdit':
                ctx.session.currentlyEditing = card_id;
                if (ctx.session.cards === undefined) {
                    ctx.session.cards = [];
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then(response => response[0]));
                } else if (ctx.session.cards.find(e => e.card_id == card_id) === undefined) {
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then(response => response[0]));
                }
                ctx.editMessageText(ctx.i18n.t('me.startEditTitle', { title: ctx.session.cards.find(e => e.card_id == card_id).title }), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.callbackButton(ctx.i18n.t('button.cancel'), `view:${card_id}:${index}`)]
                    ])
                }).then(response => {
                    ctx.session.msg_id = response.message_id;
                });

                ctx.scene.enter('titleEdit');
                ctx.answerCbQuery();
                break;

            case 'descriptionEdit':
                ctx.session.currentlyEditing = card_id;
                if (ctx.session.cards === undefined) {
                    ctx.session.cards = [];
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then(response => response[0]));
                } else if (ctx.session.cards.find(e => e.card_id == card_id) === undefined) {
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then(response => response[0]));
                }
                ctx.editMessageText(ctx.i18n.t('me.startEditDescription', { description: ctx.session.cards.find(e => e.card_id == card_id).description }), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        [Markup.callbackButton(ctx.i18n.t('button.cancel'), `view:${card_id}:${index}`)]
                    ])
                }).then(response => {
                    ctx.session.msg_id = response.message_id;
                });

                ctx.scene.enter('descriptionEdit');
                ctx.answerCbQuery();
                break;

        }

    } catch (err) {

        ctx.i18n.locale(ctx.session.user.language);

        ctx.reply(ctx.i18n.t('error.default'));
        console.error(err);

    }

}