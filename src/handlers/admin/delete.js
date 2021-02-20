const User = require('../../database/models/User');
const Card = require('../../database/models/Card');
const cookieChecker = require('../../scripts/cookieChecker');

module.exports = () => async (ctx) => {

    try {

        if (ctx.message.text.match(/https:\/\/bugs.telegram.org\/c\/([0-9]+)/g) !== null) return ctx.reply('No urls detected.');

        const card_url = ctx.message.text.match(/https:\/\/bugs.telegram.org\/c\/([0-9]+)/g)[0];
        const reason = ctx.message.text.replace(/\/delete https:\/\/bugs.telegram.org\/c\/(.+?)\s/g, '');

        if (reason.length <= 0) return ctx.reply('There\'s must be a reason.');

        const cookie = await cookieChecker().then(response => response);

        const Platform = require('../../platform/platform');
        const platform = new Platform({ 
            ssid: cookie.cookies[2].value, 
            dt: cookie.cookies[1].value, 
            token: cookie.cookies[0].value 
        });

        const card = await Card.find({ url: card_url }).then(response => response[0]);
        const user = await User.find({ id: card.author }).then(response => response[0]);

        // Not matter what platform actually returns, if I delete suggestion, it must be deleted from everywhere
        // so even if it's already removed from the platform, I gotta notify user and remove it from
        // my database.
        platform.deleteSuggestion({ url_id: card.url.replace(/https:\/\/bugs.telegram.org\/c\//g, '') }).then(() => {
            ctx.reply('Deleted the card.');

            ctx.telegram.sendMessage(user.id, ctx.i18n.t(user.language, 'service.cardDeleted', {
                title: card.title,
                reason: reason
            }), {
                parse_mode: 'Markdown'
            });

            Card.deleteOne({ card_id: card.card_id });
        });

    } catch (err) {

        console.error(err);

    }

}