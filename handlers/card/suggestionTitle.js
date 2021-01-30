module.exports = () => (ctx) => {
    try {  
        
        if (ctx.updateType == 'callback_query') {

            ctx.session.suggestionMedia = {
                type: 'text',
                content: null
            };
            ctx.editMessageText('Please enter the title for your feature suggestion (up to 128 characters).\n\nUse /cancel command to start over.');
            ctx.answerCbQuery();

        } else {

            // The worst kludge ever. Forbids sending albums.
            if (ctx.message.media_group_id != undefined) {
                if (ctx.session.albumDetected == true) return;
                ctx.session.albumDetected = true;
                ctx.scene.leave('suggestionMedia');
                ctx.scene.enter('suggestionMedia');
                return ctx.replyWithMarkdown('Please send only one media but not an album.');
            }

            if (ctx.session.albumDetected == true) ctx.session.albumDetected = undefined;

            if (ctx.message.photo == undefined && 
                ctx.message.animation == undefined && 
                ctx.message.document == undefined &&
                ctx.message.video == undefined) return ctx.replyWithMarkdown('Please send a media.');

            const suggestionMedia = ctx.message.photo || ctx.message.animation || ctx.message.video || ctx.message.document;
            ctx.session.suggestionMedia = {
                type: (ctx.message.photo) ? 'photo' : (ctx.message.animation) ? 'GIF' : (ctx.message.document) ? 'document' : 'video',
                content: suggestionMedia
            };

            ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.session.prevmsg, {});
            ctx.replyWithMarkdown('Please enter the title for your feature suggestion (up to 128 characters).\n\nUse /cancel command to start over.');
                
        }

        ctx.scene.leave('suggestionMedia');
        ctx.scene.enter('suggestionTitle');

    } catch (err) {

        ctx.reply('😔 Unfortunately, something went wrong. Please use /suggest command again.');
        console.error(err);

    }
}