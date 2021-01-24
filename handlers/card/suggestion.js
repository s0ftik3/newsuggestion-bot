module.exports = () => (ctx) => {
    try {

        const chosenOption = ctx.match.toString().split(':')[1];
        ctx.session.suggestionPlatform = chosenOption;

        ctx.editMessageText(
            'Please describe your suggestion in English below 👇\n\n' +
            '_For example:_\n' +
            '_An option to translate particular chat messages using the context menu of the app._\n\n' +
            'To submit a suggestion in another language, please contact our support team: _Settings > Ask a question._', {
            parse_mode: 'Markdown'
        });

        ctx.answerCbQuery();
        ctx.scene.enter('suggestion');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}