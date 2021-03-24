'use strict';

const Markup = require('telegraf/markup');

module.exports = async (ctx, data) => {
    try {
        const action = Array.isArray(ctx.match) ? ctx.match[0].split(':')[0] : ctx.match;
        const keyboard = [];
        const result = [];
        const limitCardsOnPage = 5;
        const pagesNum = Math.ceil(data.length / limitCardsOnPage);

        for (let i = 0; i < pagesNum; i++) result.push([]);

        for (let line = 0; line < pagesNum; line++) {
            for (let i = 0; i < limitCardsOnPage; i++) {
                const value = data[i + line * limitCardsOnPage];
                if (!value) continue;
                result[line].push(value);
            }
        }

        if (action === 'mCards') {
            if (data.length > 5) {
                const keyboardSlider = [Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), Markup.callbackButton('»', `adminForward:1`)];
    
                for (let i = 0; i < 5; i++) {
                    const title = data[i].title.length > 25 ? data[i].title.slice(0, 25).trim() + '...' : data[i].title;
    
                    keyboard.push([Markup.callbackButton(title, `adminView:${data[i].card_id}:0`)]);
                }
    
                keyboard.push(keyboardSlider);
                keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);
            } else {
                for (let i = 0; i < data.length; i++) {
                    const title = data[i].title.length > 25 ? data[i].title.slice(0, 25).trim() + '...' : data[i].title;
    
                    keyboard.push([Markup.callbackButton(title, `adminView:${data[i].card_id}:0`)]);
                }
    
                keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);
            }
    
            ctx.editMessageText('The card list is generated from the latest to the oldest ones.', {
                reply_markup: Markup.inlineKeyboard(keyboard),
            });

            ctx.answerCbQuery();
        } else if (action === 'adminForward') {
            const newKeyboard = [];

            const index = ctx.match[0].split(':')[1];
            const pages = result.length;
            let newCard = result[index];
            let bottom = [
                Markup.callbackButton(`«`, `adminBackward:${Number(index) - 1}`),
                Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                Markup.callbackButton('»', `adminForward:${Number(index) + 1}`),
            ];

            if (result[Number(index) + 1] === undefined) {
                bottom = [
                    Markup.callbackButton(`«`, `adminBackward:${Number(index) - 1}`),
                    Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                ];
            }

            for (let i = 0; i < newCard.length; i++) {
                const title = newCard[i].title.length > 25 ? newCard[i].title.slice(0, 25).trim() + '...' : newCard[i].title;

                newKeyboard.push([Markup.callbackButton(title, `adminView:${newCard[i].card_id}:${index}`)]);
            }

            newKeyboard.push(bottom);
            newKeyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

            ctx.editMessageText('The card list is generated from the latest to the oldest ones.', {
                reply_markup: Markup.inlineKeyboard(newKeyboard),
            });

            ctx.answerCbQuery();
        } else if (action === 'adminBackward') {
            const newKeyboard = [];

            const index = ctx.match[0].split(':')[1];
            const pages = result.length;
            let newCard = result[index];
            let bottom = [
                Markup.callbackButton(`«`, `adminBackward:${Number(index) - 1}`),
                Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                Markup.callbackButton('»', `adminForward:${Number(index) + 1}`),
            ];

            if (result[Number(index) - 1] === undefined) {
                bottom = [
                    Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                    Markup.callbackButton('»', `adminForward:${Number(index) + 1}`),
                ];
            }

            for (let i = 0; i < newCard.length; i++) {
                const title = newCard[i].title.length > 25 ? newCard[i].title.slice(0, 25).trim() + '...' : newCard[i].title;

                newKeyboard.push([Markup.callbackButton(title, `adminView:${newCard[i].card_id}:${index}`)]);
            }

            newKeyboard.push(bottom);
            newKeyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

            ctx.editMessageText('The card list is generated from the latest to the oldest ones.', {
                reply_markup: Markup.inlineKeyboard(newKeyboard),
            });

            ctx.answerCbQuery();
        } else if (action === 'adminBack') {
            const index = ctx.match[0].split(':')[1];

            let n = 0;

            if (index !== 0) n = index;

            let keyboardSlider = [Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), Markup.callbackButton('»', `forward:1`)];

            if (result[Number(index) - 1] === undefined) {
                keyboardSlider = [
                    Markup.callbackButton(`${Number(index) + 1} / ${result.length}`, `nothing`),
                    Markup.callbackButton('»', `adminForward:${Number(index) + 1}`),
                ];
            } else if (result[Number(index) + 1] === undefined) {
                keyboardSlider = [
                    Markup.callbackButton(`«`, `adminBackward:${Number(index) - 1}`),
                    Markup.callbackButton(`${Number(index) + 1} / ${result.length}`, `nothing`),
                ];
            } else {
                keyboardSlider = [
                    Markup.callbackButton(`«`, `adminBackward:${Number(index) - 1}`),
                    Markup.callbackButton(`${Number(index) + 1} / ${result.length}`, `nothing`),
                    Markup.callbackButton('»', `adminForward:${Number(index) + 1}`),
                ];
            }

            for (let i = 0; i < result[n].length; i++) {
                const title = result[n][i].title.length > 25 ? result[n][i].title.slice(0, 25).trim() + '...' : result[n][i].title;

                keyboard.push([Markup.callbackButton(title, `adminView:${result[n][i].card_id}:${index}`)]);
            }

            if (data.length / 5 > 1) {
                keyboard.push(keyboardSlider);
            }

            keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

            ctx.editMessageText('The card list is generated from the latest to the oldest ones.', {
                reply_markup: Markup.inlineKeyboard(keyboard),
            });

            ctx.answerCbQuery();
        } else {
            ctx.answerCbQuery('Something went wrong.');
        }
    } catch (err) {
        console.error(err);
    }
};