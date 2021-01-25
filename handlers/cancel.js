module.exports = () => (ctx) => {
    try {

        ctx.reply('OK! Use /suggest command to make a new suggestion.');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}