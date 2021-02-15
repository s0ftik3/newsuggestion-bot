const Card = require('../database/models/Card');
const axios = require('axios');
const cheerio = require('cheerio');
const getUserSession = require('../scripts/getUserSession');
const createMePage = require('../scripts/createMePage');

module.exports = () => async (ctx) => {

    try {

        const user = await getUserSession(ctx).then(response => response);
        ctx.i18n.locale(user.language);

        const data = await Card.find({ author: ctx.from.id }).then(response => response);

        if (data.length <= 0) return ctx.reply(ctx.i18n.t('me.noCards'));

        createMePage(ctx, data);

    } catch (error) {

        console.error(error);

    };

};