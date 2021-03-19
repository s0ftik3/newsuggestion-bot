const User = require('../../database/models/User');
const config = require('../../../config');

module.exports = () => (ctx) => {
    try {
        if (ctx.from.id != config.admin) return;

        const userToBan = ctx.message.text.replace(/\/ban (.*?)/g, '');
        if (userToBan.match(/[0-9]/g) === null) return ctx.reply('No users detected.');
        User.updateOne({ id: userToBan }, { $set: { banned: true } }, () => {});

        ctx.replyWithMarkdown(`User ${userToBan} banned.`);
    } catch (err) {
        console.error(err);
    }
};