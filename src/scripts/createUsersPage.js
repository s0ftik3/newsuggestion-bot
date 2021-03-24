'use strict';

const Markup = require('telegraf/markup');

module.exports = async (ctx, data) => {
    try {
        const action = Array.isArray(ctx.match) ? ctx.match[0].split(':')[0] : ctx.match;
        const keyboard = [];
        const result = [];
        const limitUsersOnPage = 15;
        const pagesNum = Math.ceil(data.length / limitUsersOnPage);

        for (let i = 0; i < pagesNum; i++) result.push([]);

        for (let line = 0; line < pagesNum; line++) {
            for (let i = 0; i < limitUsersOnPage; i++) {
                const value = data[i + line * limitUsersOnPage];
                if (!value) continue;
                result[line].push(value);
            }
        }

        if (action === 'mUsers') {
            if (data.length > limitUsersOnPage) {
                const keyboardSlider = [Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), Markup.callbackButton('»', `adminUsersForward:1`)];
    
                for (let i = 0; i < limitUsersOnPage; i++) {
                    const name = data[i].firstName.length > 25 ? data[i].firstName.slice(0, 25).trim() + '...' : data[i].firstName;
    
                    keyboard.push(Markup.callbackButton(name.replace(/[^\x20-\x7E]+/g, ''), `adminUsersView:${data[i].id}:0`));
                }  

                const keyboardToSend = Markup.inlineKeyboard(keyboard, { columns: 3 });
                
                keyboardToSend.inline_keyboard.push(keyboardSlider);
                keyboardToSend.inline_keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

                ctx.editMessageText('The user list is generated from the latest to the oldest ones.', {
                    reply_markup: keyboardToSend,
                });
            } else {
                for (let i = 0; i < data.length; i++) {
                    const name = data[i].firstName.length > 25 ? data[i].firstName.slice(0, 25).trim() + '...' : data[i].firstName;
    
                    keyboard.push(Markup.callbackButton(name.replace(/[^\x20-\x7E]+/g, ''), `adminUsersView:${data[i].id}:0`));
                }
    
                const keyboardToSend = Markup.inlineKeyboard(keyboard, { columns: 3 });

                keyboardToSend.inline_keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

                ctx.editMessageText('The user list is generated from the latest to the oldest ones.', {
                    reply_markup: keyboardToSend,
                });
            }

            ctx.answerCbQuery();
        } else if (action === 'adminUsersForward') {
            const newKeyboard = [];

            const index = ctx.match[0].split(':')[1];
            const pages = result.length;
            let newCard = result[index];
            let bottom = [
                Markup.callbackButton(`«`, `adminUsersBackward:${Number(index) - 1}`),
                Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                Markup.callbackButton('»', `adminUsersForward:${Number(index) + 1}`),
            ];

            if (result[Number(index) + 1] === undefined) {
                bottom = [
                    Markup.callbackButton(`«`, `adminUsersBackward:${Number(index) - 1}`),
                    Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                ];
            }

            for (let i = 0; i < newCard.length; i++) {
                const name = newCard[i].firstName.length > 25 ? newCard[i].firstName.slice(0, 25).trim() + '...' : newCard[i].firstName;

                newKeyboard.push(Markup.callbackButton(name.replace(/[^\x20-\x7E]+/g, ''), `adminUsersView:${newCard[i].id}:${index}`));
            }

            const keyboardToSend = Markup.inlineKeyboard(newKeyboard, { columns: 3 });
                
            keyboardToSend.inline_keyboard.push(bottom);
            keyboardToSend.inline_keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

            ctx.editMessageText('The user list is generated from the latest to the oldest ones.', {
                reply_markup: keyboardToSend
            });

            ctx.answerCbQuery();
        } else if (action === 'adminUsersBackward') {
            const newKeyboard = [];

            const index = ctx.match[0].split(':')[1];
            const pages = result.length;
            let newCard = result[index];
            let bottom = [
                Markup.callbackButton(`«`, `adminUsersBackward:${Number(index) - 1}`),
                Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                Markup.callbackButton('»', `adminUsersForward:${Number(index) + 1}`),
            ];

            if (result[Number(index) - 1] === undefined) {
                bottom = [
                    Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`),
                    Markup.callbackButton('»', `adminUsersForward:${Number(index) + 1}`),
                ];
            }

            for (let i = 0; i < newCard.length; i++) {
                const name = newCard[i].firstName.length > 25 ? newCard[i].firstName.slice(0, 25).trim() + '...' : newCard[i].firstName;

                newKeyboard.push(Markup.callbackButton(name.replace(/[^\x20-\x7E]+/g, ''), `adminUsersView:${newCard[i].id}:${index}`));
            }

            const keyboardToSend = Markup.inlineKeyboard(newKeyboard, { columns: 3 });
                
            keyboardToSend.inline_keyboard.push(bottom);
            keyboardToSend.inline_keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

            ctx.editMessageText('The user list is generated from the latest to the oldest ones.', {
                reply_markup: keyboardToSend
            });

            ctx.answerCbQuery();
        } else if (action === 'adminUsersBack') {
            const index = ctx.match[0].split(':')[1];

            let n = 0;

            if (index !== 0) n = index;

            let keyboardSlider = [Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), Markup.callbackButton('»', `forward:1`)];

            if (result[Number(index) - 1] === undefined) {
                keyboardSlider = [
                    Markup.callbackButton(`${Number(index) + 1} / ${result.length}`, `nothing`),
                    Markup.callbackButton('»', `adminUsersForward:${Number(index) + 1}`),
                ];
            } else if (result[Number(index) + 1] === undefined) {
                keyboardSlider = [
                    Markup.callbackButton(`«`, `adminUsersBackward:${Number(index) - 1}`),
                    Markup.callbackButton(`${Number(index) + 1} / ${result.length}`, `nothing`),
                ];
            } else {
                keyboardSlider = [
                    Markup.callbackButton(`«`, `adminUsersBackward:${Number(index) - 1}`),
                    Markup.callbackButton(`${Number(index) + 1} / ${result.length}`, `nothing`),
                    Markup.callbackButton('»', `adminUsersForward:${Number(index) + 1}`),
                ];
            }

            for (let i = 0; i < result[n].length; i++) {
                const name = result[n][i].firstName.length > 25 ? result[n][i].firstName.slice(0, 25).trim() + '...' : result[n][i].firstName;
        
                keyboard.push(Markup.callbackButton(name.replace(/[^\x20-\x7E]+/g, ''), `adminUsersView:${result[n][i].id}:${index}`));
            }

            const keyboardToSend = Markup.inlineKeyboard(keyboard, { columns: 3 });

            if (data.length / 5 > 1) {
                keyboardToSend.inline_keyboard.push(keyboardSlider);
            }
            
            keyboardToSend.inline_keyboard.push([Markup.callbackButton('« Back', 'backAdmin')]);

            ctx.editMessageText('The user list is generated from the latest to the oldest ones.', {
                reply_markup: keyboardToSend
            });

            ctx.answerCbQuery();
        } else {
            ctx.answerCbQuery('Something went wrong.');
        }
    } catch (err) {
        console.error(err);
    }
};