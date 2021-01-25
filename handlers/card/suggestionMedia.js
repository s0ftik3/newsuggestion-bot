const Markup = require('telegraf/markup');
const saveFormatting = require('../../scripts/saveFormatting');

module.exports = () => (ctx) => {
    try {

        const suggestionText = saveFormatting(ctx.message.text, ctx.message.entities);
        ctx.session.suggestionText = suggestionText;

        ctx.replyWithMarkdown(
            'Please provide a demo screenshot or video of your suggested implementation.\n\n' +
            '*Warning:* your feature suggestion will be public, other users will be able to see all videos and screenshots you attach. Please make sure they don\'t show any private information – or blur/hide anything you don\'t want to share with others.\n\n' +
            'You may also be interested to see feature implementations suggested by other Telegram users in https://t.me/designers.\n\n' +
            'Use /cancel command to start over.', {
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('Skip this step »', 'skip')
            ]),
            disable_web_page_preview: true
        }).then(data => { ctx.session.prevmsg = data.message_id });

        ctx.scene.leave('suggestion');
        ctx.scene.enter('suggestionMedia');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}