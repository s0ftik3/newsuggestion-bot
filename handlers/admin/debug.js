const User = require('../../database/models/User');
const Card = require('../../database/models/Card');
const config = require('../../config.js');
const mongoose = require('mongoose');

module.exports = () => async (ctx) => {

    let start_ts = new Date().getTime();

    let connection = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    try {

        if (ctx.from.id != config.admin) return;

        const usersNumber = await User.find().then(response => response.length);
        const cardsNumber = await Card.find().then(response => response.length);
        const lastUser = await User.find().then(response => (response.reverse()[0].username == null) ? response.reverse()[0].firstName : '@' + response.reverse()[0].username);
        const dbConnectionStatus = connection[mongoose.connection.readyState];

        ctx.replyWithMarkdown(`Users: ${usersNumber} (${lastUser})\nCards: ${cardsNumber}\nDatabase Status: ${dbConnectionStatus} (${new Date().getTime() - start_ts}ms)`);
        
    } catch (error) {

        console.error(error);

    };

};
