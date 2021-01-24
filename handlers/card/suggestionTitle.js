module.exports = () => (ctx) => {
    try {  

        if (ctx.updateType == 'callback_query') {

            ctx.editMessageText('Please enter the title for your feature suggestion (up to 128 characters).');
            ctx.answerCbQuery();

        } else {

            if (ctx.message.photo == undefined && 
                ctx.message.animation == undefined && 
                ctx.message.video == undefined) return ctx.replyWithMarkdown('Please send a media.');

            const suggestionMedia = ctx.message.photo || ctx.message.animation || ctx.message.video;
            ctx.session.suggestionMedia = {
                type: (ctx.message.photo) ? 'photo' : (ctx.message.animation) ? 'GIF' : 'video',
                content: suggestionMedia
            };

            ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.session.prevmsg, {});
            ctx.replyWithMarkdown('Please enter the title for your feature suggestion (up to 128 characters).');
                
        }

        ctx.scene.leave('suggestionMedia');
        ctx.scene.enter('suggestionTitle');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}