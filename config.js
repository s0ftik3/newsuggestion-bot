module.exports = {
    token: process.env.TOKEN,
    database: process.env.DATABASE,
    admin: process.env.ADMIN,
    chat: process.env.CHAT,
    number: process.env.NUMBER,
    card: {
        title_maximum_length: 250,
        description_minimum_length: 32,
        title_minimum_length: 5,
    },
    limit: {
        window: 1000,
        limit: 1,
        onLimitExceeded: (ctx) => require('./src/scripts/replyWithError')(ctx, 1),
    },
};