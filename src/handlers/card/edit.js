const Card = require('../../database/models/Card');
const Markup = require('telegraf/markup');
const getUserSession = require('../../scripts/getUserSession');
const cookieChecker = require('../../scripts/cookieChecker');
const languageCheck = require('../../scripts/languageCheck');
const saveFormatting = require('../../scripts/saveFormatting');
const replyWithError = require('../../scripts/replyWithError');
const config = require('../../../config').card;

module.exports = () => async (ctx) => {
    try {
        const user = await getUserSession(ctx);
        ctx.i18n.locale(user.language);

        if (ctx.updateType === 'message') {
            const cookie = await cookieChecker();
            const whatToEdit = ctx.session.__scenes.current;
            const cardToEdit = ctx.session.currentlyEditing;
            const card = ctx.session.cards.find((e) => e.card_id == cardToEdit);
            if ((user.cards.filter((e) => e.card_id === cardToEdit)).length <= 0) {
                if (user.role !== 'admin' || user.role !== 'moderator') {
                    return;
                }
            }
            const isAdmin = (user.role !== 'admin' || user.role !== 'moderator') ? false : true;
            const cancelButton = (isAdmin) ? 'adminBackward' : 'backward';

            const Platform = require('../../platform/platform');
            const platform = new Platform({
                ssid: cookie.cookies[2].value,
                dt: cookie.cookies[1].value,
                token: cookie.cookies[0].value,
            });

            switch (whatToEdit) {
                case 'titleEdit':
                    const newTitle = ctx.message.text;
                    if (newTitle === card.title) return replyWithError(ctx, 9);
                    if (newTitle.length > config.title_maximum_length) return replyWithError(ctx, 2);
                    if (newTitle.length < config.title_minimum_length) return replyWithError(ctx, 14);
                    if (newTitle.match(/^\/start|\/me|\/new|\/suggest$/gi) !== null) return replyWithError(ctx, 17);
                    if (!languageCheck(newTitle)) return replyWithError(ctx, 8);

                    ctx.telegram.editMessageReplyMarkup(ctx.update.message.chat.id, ctx.session.msg_id, {});

                    const editTitleData = {
                        title: newTitle,
                        description: card.description,
                        url_id: card.url.replace(/https:\/\/bugs.telegram.org\/c\//g, ''),
                    };

                    const isEditedT = await platform.editSuggestionTitle(editTitleData).then(async (response) => {
                        if (response) {
                            ctx.reply(ctx.i18n.t('me.titleEdited'), {
                                reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.back'), `${cancelButton}:0`)]]),
                            });
                            return true;
                        } else {
                            ctx.reply(ctx.i18n.t('error.titleNotEdited'), {
                                reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.back'), `${cancelButton}:0`)]]),
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
                    const newDescription = saveFormatting(ctx.message.text, ctx.message.entities);
                    if (newDescription === card.description) return replyWithError(ctx, 10);
                    if (newDescription.match(/^\/start|\/me|\/new|\/suggest$/gi) !== null) return replyWithError(ctx, 16);
                    if (newDescription.length <= config.description_minimum_length) return replyWithError(ctx, 15);
                    if (!languageCheck(newDescription)) return replyWithError(ctx, 7);

                    ctx.telegram.editMessageReplyMarkup(ctx.update.message.chat.id, ctx.session.msg_id, {});

                    const editDescriptionData = {
                        title: card.title,
                        description: newDescription,
                        url_id: card.url.replace(/https:\/\/bugs.telegram.org\/c\//g, ''),
                    };

                    const isEditedD = await platform.editSuggestionDescription(editDescriptionData).then(async (response) => {
                        if (response) {
                            ctx.reply(ctx.i18n.t('me.descriptionEdited'), {
                                reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.back'), `${cancelButton}:0`)]]),
                            });
                            return true;
                        } else {
                            ctx.reply(ctx.i18n.t('error.descriptionNotEdited'), {
                                reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.back'), `${cancelButton}:0`)]]),
                            });
                            return false;
                        }
                    });

                    if (isEditedD) {
                        Card.updateOne({ card_id: cardToEdit }, { $set: { description: newDescription } }, () => {});
                        const descriptionCardIndex = ctx.session.cards.indexOf(card);
                        ctx.session.cards[descriptionCardIndex].description = newDescription;
                    }

                    ctx.scene.leave('descriptionEdit');
                    break;
            }

            return;
        }

        const action = ctx.match[0].split(':')[0];
        const card_id = ctx.match[0].split(':')[1];
        const index = ctx.match.input.split(':')[2];
        const isAdmin = (ctx.match.input.split(':')[3] === undefined) ? false : true;
        const prefix = (isAdmin) ? ':admin' : '';
        const backButton = (isAdmin) ? 'adminView' : 'view';

        switch (action) {
            case 'edit':
                ctx.editMessageText(ctx.i18n.t('me.edit'), {
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(ctx.i18n.t('button.editTitle'), `titleEdit:${card_id}:${index}${prefix}`),
                            Markup.callbackButton(ctx.i18n.t('button.editDescription'), `descriptionEdit:${card_id}:${index}${prefix}`),
                        ],
                        [Markup.callbackButton(ctx.i18n.t('button.back'), `${backButton}:${card_id}:${index}`)],
                    ]),
                });

                ctx.answerCbQuery();
                break;

            case 'titleEdit':
                ctx.session.currentlyEditing = card_id;
                if (ctx.session.cards === undefined) {
                    ctx.session.cards = [];
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then((response) => response[0]));
                } else if (ctx.session.cards.find((e) => e.card_id == card_id) === undefined) {
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then((response) => response[0]));
                }
                ctx.editMessageText(ctx.i18n.t('me.startEditTitle', { title: ctx.session.cards.find((e) => e.card_id == card_id).title }), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.cancel'), `${backButton}:${card_id}:${index}`)]]),
                }).then((response) => {
                    ctx.session.msg_id = response.message_id;
                });

                ctx.scene.enter('titleEdit');
                ctx.answerCbQuery();
                break;

            case 'descriptionEdit':
                ctx.session.currentlyEditing = card_id;
                if (ctx.session.cards === undefined) {
                    ctx.session.cards = [];
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then((response) => response[0]));
                } else if (ctx.session.cards.find((e) => e.card_id == card_id) === undefined) {
                    ctx.session.cards.push(await Card.find({ card_id: card_id }).then((response) => response[0]));
                }
                ctx.editMessageText(ctx.i18n.t('me.startEditDescription', { description: ctx.session.cards.find((e) => e.card_id == card_id).description }), {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([[Markup.callbackButton(ctx.i18n.t('button.cancel'), `${backButton}:${card_id}:${index}`)]]),
                }).then((response) => {
                    ctx.session.msg_id = response.message_id;
                });

                ctx.scene.enter('descriptionEdit');
                ctx.answerCbQuery();
                break;
        }
    } catch (err) {
        replyWithError(ctx, 0);
        console.error(err);
    }
};