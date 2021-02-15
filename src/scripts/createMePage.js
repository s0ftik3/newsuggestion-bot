const axios = require('axios');
const cheerio = require('cheerio');
const Markup = require('telegraf/markup');

module.exports = async (ctx, data) => {
    
    try {

        let keyboard = [];
        const result = [];

        if (ctx.updateType !== 'callback_query') {

            // In case if user has more than 5 created cards.
            if (data.length > 5) {

                // Set limits.
                const pagesNum = Math.ceil(data.length / 5);

                // Create slider.
                const keyboardSlider = [
                    Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), 
                    Markup.callbackButton('»', `forward:1`)
                ];

                for (let i = 0; i < 5; i++) {

                    const title = (data[i].title.length > 25) ? data[i].title.slice(0, 25).trim() + '...' : data[i].title;

                    keyboard.push([Markup.callbackButton(title, `view:${data[i].card_id}:0`)]);

                }

                keyboard.push(keyboardSlider);

            } else {

                for (let i = 0; i < data.length; i++) {

                    const title = (data[i].title.length > 25) ? data[i].title.slice(0, 25).trim() + '...' : data[i].title;

                    keyboard.push([Markup.callbackButton(title, `view:${data[i].card_id}:0`)]);

                }

            }

            ctx.replyWithMarkdown(ctx.i18n.t('me.info'), {
                reply_markup: Markup.inlineKeyboard(keyboard)
            });

        } else {

            // Set limits.
            const pagesNum = Math.ceil(data.length / 5);
            const limitCardsOnPage = 5;
            
            // Create blank arrays for future pages.
            for (let i = 0; i < pagesNum; i++) result.push([]);

            // Push all data and sort it between all the pages.
            for (let line = 0; line < pagesNum; line++) {

                for (let i = 0; i < limitCardsOnPage; i++) {

                    const value = data[i + line * limitCardsOnPage]
                    if (!value) continue;
                    result[line].push(value)
                    
                }

            }

            let action = ctx.match[0].split(':')[0];
            (typeof ctx.match == 'object') ? action = action : action = ctx.match;

            switch (action) {

                case 'view':
                    const card_id = ctx.match[0].split(':')[1];
                    const index_for_back = ctx.match.input.split(':')[2];
                    const card = data.find(e => e.card_id == card_id);

                    let viewKeyboard = [
                        [Markup.urlButton(ctx.i18n.t('button.viewOnPlatform'), card.url)],
                        [Markup.callbackButton(ctx.i18n.t('button.back'), `back:${index_for_back}`)]
                    ]; // [Markup.callbackButton(ctx.i18n.t('button.edit'), `edit:${card_id}`), Markup.callbackButton(ctx.i18n.t('button.delete'), `delete:${card_id}`)],

                    // if ((new Date().getTime() - new Date(card.timestamp).getTime()) >= 86400000) {
                    //     viewKeyboard = [
                    //         [Markup.urlButton(ctx.i18n.t('button.viewOnPlatform'), card.url)],
                    //         [Markup.callbackButton(ctx.i18n.t('button.back'), `back:${index_for_back}`)]
                    //     ];
                    // }

                    let ratio = {};

                    await axios(card.url).then(response => {

                        const $ = cheerio.load(response.data);
                        const likes = $('body').find('span[class="cd-issue-like bt-active-btn"]').find('span[class="value"]').attr('data-value');
                        const dislikes = $('body').find('span[class="cd-issue-dislike bt-active-btn"]').find('span[class="value"]').attr('data-value');

                        ratio = { like: (likes == undefined) ? 0 : likes, dislike: (dislikes == undefined) ? 0 : dislikes };

                    });

                    ctx.editMessageText(ctx.i18n.t('me.preview', {
                        title: card.title,
                        description: (card.description === undefined) ? ctx.i18n.t('me.noDescription') : card.description,
                        like: ratio.like,
                        dislike: ratio.dislike
                    }), {
                        parse_mode: 'HTML',
                        reply_markup: Markup.inlineKeyboard(viewKeyboard)
                    });

                    ctx.answerCbQuery();
                    break;
                
                case 'forward':
                    const newKeyboard = [];

                    const index = ctx.match[0].split(':')[1];
                    const pages = result.length;
                    let newCard = result[index];
                    let bottom = [
                        Markup.callbackButton(`«`, `backward:${Number(index) - 1}`), 
                        Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`), 
                        Markup.callbackButton('»', `forward:${Number(index) + 1}`)
                    ];

                    if (result[Number(index) + 1] === undefined) {
                        bottom = [
                            Markup.callbackButton(`«`, `backward:${Number(index) - 1}`), 
                            Markup.callbackButton(`${Number(index) + 1} / ${pages}`, `nothing`)
                        ];
                    }

                    for (let i = 0; i < newCard.length; i++) {
                
                        const title = (newCard[i].title.length > 25) ? newCard[i].title.slice(0, 25).trim() + '...' : newCard[i].title;
            
                        newKeyboard.push([Markup.callbackButton(title, `view:${newCard[i].card_id}:${index}`)]);
            
                    }
            
                    newKeyboard.push(bottom);

                    ctx.editMessageText(ctx.i18n.t('me.info'), {
                        parse_mode: 'Markdown',
                        reply_markup: Markup.inlineKeyboard(newKeyboard)
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
                        Markup.callbackButton('»', `forward:${Number(index_b) + 1}`)
                    ];

                    if (result[Number(index_b) - 1] === undefined) {
                        bottom_b = [
                            Markup.callbackButton(`${Number(index_b) + 1} / ${pages_b}`, `nothing`), 
                            Markup.callbackButton('»', `forward:${Number(index_b) + 1}`)
                        ];
                    }

                    for (let i = 0; i < newCard_b.length; i++) {
                
                        const title = (newCard_b[i].title.length > 25) ? newCard_b[i].title.slice(0, 25).trim() + '...' : newCard_b[i].title;
            
                        newKeyboard_b.push([Markup.callbackButton(title, `view:${newCard_b[i].card_id}:${index_b}`)]);
            
                    }
            
                    newKeyboard_b.push(bottom_b);

                    ctx.editMessageText(ctx.i18n.t('me.info'), {
                        parse_mode: 'Markdown',
                        reply_markup: Markup.inlineKeyboard(newKeyboard_b)
                    });

                    ctx.answerCbQuery();
                    break;

                case 'back':
                    const index_back = ctx.match[0].split(':')[1];
                    const pagesNum = Math.ceil(data.length / 5);

                    let n = 0;

                    if (index_back !== 0) n = index_back;

                    let keyboardSlider = [
                        Markup.callbackButton(`1 / ${pagesNum}`, `nothing`), 
                        Markup.callbackButton('»', `forward:1`)
                    ];

                    if (result[Number(index_back) - 1] === undefined) {
                        keyboardSlider = [
                            Markup.callbackButton(`${Number(index_back) + 1} / ${result.length}`, `nothing`), 
                            Markup.callbackButton('»', `forward:${Number(index_back) + 1}`)
                        ];
                    } else if (result[Number(index_back) + 1] === undefined) {
                        keyboardSlider = [
                            Markup.callbackButton(`«`, `backward:${Number(index_back) - 1}`), 
                            Markup.callbackButton(`${Number(index_back) + 1} / ${result.length}`, `nothing`)
                        ];
                    } else {
                        keyboardSlider = [
                            Markup.callbackButton(`«`, `backward:${Number(index_back) - 1}`), 
                            Markup.callbackButton(`${Number(index_back) + 1} / ${result.length}`, `nothing`), 
                            Markup.callbackButton('»', `forward:${Number(index_back) + 1}`)
                        ]; 
                    }

                    for (let i = 0; i < result[n].length; i++) {

                        const title = (result[n][i].title.length > 25) ? result[n][i].title.slice(0, 25).trim() + '...' : result[n][i].title;
    
                        keyboard.push([Markup.callbackButton(title, `view:${result[n][i].card_id}:${index_back}`)]);
    
                    }

                    if ((data.length / 5) > 1) {
                        keyboard.push(keyboardSlider);
                    }

                    ctx.editMessageText(ctx.i18n.t('me.info'), {
                        parse_mode: 'Markdown',
                        reply_markup: Markup.inlineKeyboard(keyboard)
                    });

                    ctx.answerCbQuery();
                    break;

            }

        }

    } catch (err) {

        console.error(err);

    }

}