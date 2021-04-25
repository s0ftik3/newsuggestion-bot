const User = require('../../database/models/User');
const createUsersPage = require('../../scripts/createUsersPage');
const filterByMods = require('../../scripts/filterByMods');

module.exports = () => async (ctx) => {
    try {
        const data = await User.find();

        if (data.length <= 0) {
            ctx.editMessageText('No users found.', {
                reply_markup: Markup.inlineKeyboard([Markup.callbackButton('« Back', 'backAdmin')])
            });
        }

        createUsersPage(ctx, filterByMods(data.reverse()));
    } catch (error) {
        console.error(err);
    }
};