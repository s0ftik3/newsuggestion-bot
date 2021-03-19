'use strict';

const Markup = require('telegraf/markup');

module.exports = async (ctx, data) => {
    try {
        const keyboard = [];
        const result = [];

        if (ctx.updateType !== 'callback_query') {
            if (data.length > 5) {
                const pagesNum = Math.ceil(data.length / 5);

                const keyboardSlider = [Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), Markup.callbackButton('»', `forward:1`)];

                for (let i = 0; i < 5; i++) {
                    const title = data[i].title.length > 25 ? data[i].title.slice(0, 25).trim() + '...' : data[i].title;

                    keyboard.push([Markup.callbackButton(title, `view:${data[i].card_id}:0`)]);
                }

                keyboard.push(keyboardSlider);
            } else {
                for (let i = 0; i < data.length; i++) {
                    const title = data[i].title.length > 25 ? data[i].title.slice(0, 25).trim() + '...' : data[i].title;

                    keyboard.push([Markup.callbackButton(title, `view:${data[i].card_id}:0`)]);
                }
            }

            ctx.replyWithMarkdown(ctx.i18n.t('me.info'), {
                reply_markup: Markup.inlineKeyboard(keyboard),
            });
        } else {
            const pagesNum = Math.ceil(data.length / 5);
            const limitCardsOnPage = 5;

            for (let i = 0; i < pagesNum; i++) result.push([]);

            for (let line = 0; line < pagesNum; line++) {
                for (let i = 0; i < limitCardsOnPage; i++) {
                    const value = data[i + line * limitCardsOnPage];
                    if (!value) continue;
                    result[line].push(value);
                }
            }

            let action = ctx.match[0].split(':')[0];
            typeof ctx.match == 'object' ? (action = action) : (action = ctx.match);

            switch (action) {
                case 'forward':
                    const newKeyboard = [];

                    const index = ctx.match[0].split(':')[1];
                    const pages = result.length;
                    let newCard = result[index];
                    let bottom = [
                        Markup.callbackButton(`«`, `backward:${Number(index) - 1}`),
                        Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                        Markup.callbackButton('»', `forward:${Number(index) + 1}`),
                    ];

                    if (result[Number(index) + 1] === undefined) {
                        bottom = [
                            Markup.callbackButton(`«`, `backward:${Number(index) - 1}`),
                            Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                        ];
                    }

                    for (let i = 0; i < newCard.length; i++) {
                        const title = newCard[i].title.length > 25 ? newCard[i].title.slice(0, 25).trim() + '...' : newCard[i].title;

                        newKeyboard.push([Markup.callbackButton(title, `view:${newCard[i].card_id}:${index}`)]);
                    }

                    newKeyboard.push(bottom);

                    ctx.editMessageText(ctx.i18n.t('me.info'), {
                        parse_mode: 'Markdown',
                        reply_markup: Markup.inlineKeyboard(newKeyboard),
                    });

                    ctx.answerCbQuery();
                    break;

                case 'backward':
                    const newKeyboard_b = [];

                    const index_b = ctx.match[0].split(':')[1];
                    const pages_b = result.length;
                    let newCard_b = result[index_b];
                    let bottom_b = [
                        Markup.callbackButton(`«`, `backward:${Number(index_b) - 1}`),
                        Markup.callbackButton(`${Number(index_b) + 1} / ${pages_b}`, `nothing`),
                        Markup.callbackButton('»', `forward:${Number(index_b) + 1}`),
                    ];

                    if (result[Number(index_b) - 1] === undefined) {
                        bottom_b = [
                            Markup.callbackButton(`${Number(index_b) + 1} / ${pages_b}`, `nothing`),
                            Markup.callbackButton('»', `forward:${Number(index_b) + 1}`),
                        ];
                    }

                    for (let i = 0; i < newCard_b.length; i++) {
                        const title = newCard_b[i].title.length > 25 ? newCard_b[i].title.slice(0, 25).trim() + '...' : newCard_b[i].title;

                        newKeyboard_b.push([Markup.callbackButton(title, `view:${newCard_b[i].card_id}:${index_b}`)]);
                    }

                    newKeyboard_b.push(bottom_b);

                    ctx.editMessageText(ctx.i18n.t('me.info'), {
                        parse_mode: 'Markdown',
                        reply_markup: Markup.inlineKeyboard(newKeyboard_b),
                    });

                    ctx.answerCbQuery();
                    break;

                case 'back':
                    const index_back = ctx.match[0].split(':')[1];
                    const pagesNum = Math.ceil(data.length / 5);

                    let n = 0;

                    if (index_back !== 0) n = index_back;

                    let keyboardSlider = [Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), Markup.callbackButton('»', `forward:1`)];

                    if (result[Number(index_back) - 1] === undefined) {
                        keyboardSlider = [
                            Markup.callbackButton(`${Number(index_back) + 1} / ${result.length}`, `nothing`),
                            Markup.callbackButton('»', `forward:${Number(index_back) + 1}`),
                        ];
                    } else if (result[Number(index_back) + 1] === undefined) {
                        keyboardSlider = [
                            Markup.callbackButton(`«`, `backward:${Number(index_back) - 1}`),
                            Markup.callbackButton(`${Number(index_back) + 1} / ${result.length}`, `nothing`),
                        ];
                    } else {
                        keyboardSlider = [
                            Markup.callbackButton(`«`, `backward:${Number(index_back) - 1}`),
                            Markup.callbackButton(`${Number(index_back) + 1} / ${result.length}`, `nothing`),
                            Markup.callbackButton('»', `forward:${Number(index_back) + 1}`),
                        ];
                    }

                    for (let i = 0; i < result[n].length; i++) {
                        const title = result[n][i].title.length > 25 ? result[n][i].title.slice(0, 25).trim() + '...' : result[n][i].title;

                        keyboard.push([Markup.callbackButton(title, `view:${result[n][i].card_id}:${index_back}`)]);
                    }

                    if (data.length / 5 > 1) {
                        keyboard.push(keyboardSlider);
                    }

                    ctx.editMessageText(ctx.i18n.t('me.info'), {
                        parse_mode: 'Markdown',
                        reply_markup: Markup.inlineKeyboard(keyboard),
                    });

                    ctx.answerCbQuery();
                    break;
            }
        }
    } catch (err) {
        console.error(err);
    }
};