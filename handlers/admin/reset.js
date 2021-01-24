const User = require('../../database/models/User');
const config = require('../../config.js');

module.exports = () => async (ctx) => {

    try {

        if (ctx.from.id != config.admin) return;

        await User.deleteOne({ id: ctx.from.id });

        ctx.reply('/start');

    } catch (error) {

        console.error(error);

    };

};