const User = require('../../database/models/User');
const Card = require('../../database/models/Card');
const config = require('../../../config');

module.exports = () => async (ctx) => {

    try {

        if (ctx.from.id != config.admin) return;

        const users = await User.find().then(response => response);
        const cards = await Card.find().then(response => response);

        const message = `Bot information.\n\n` +
            `*User(s):* \`${users.length}\`\n` +
            `*Last User:* ${(users.reverse()[0].username === null) ? `\`${users[0].firstName}\`` : `@${users[0].username}`}\n` +
            `*Card(s):* \`${cards.length}\`\n` +
            `*Last Card:* ${cards.reverse()[0].url}`;

        ctx.replyWithMarkdown(message);

    } catch (err) {

        console.error(err);

    }

}