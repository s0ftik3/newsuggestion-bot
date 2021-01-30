module.exports = () => (ctx) => {
    try {

        if (ctx.updateType == 'callback_query') return ctx.editMessageText('OK! Use /suggest command to make a new suggestion.');

        ctx.reply('👌 OK! Use /suggest command to make a new suggestion.');

        ctx.scene.leave('suggestion');
        ctx.scene.leave('suggestionMedia');
        ctx.scene.leave('suggestionTitle');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}