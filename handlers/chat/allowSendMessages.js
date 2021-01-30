module.exports = () => (ctx) => {

    try {

        if (ctx.update.callback_query.message.chat.id != -1001431292906) return;

        const user = ctx.match.toString().split(':')[1];

        if (user != ctx.from.id) {

            return ctx.answerCbQuery('This button is not for you.');

        } else {

            ctx.deleteMessage(ctx.update.callback_query.message.message_id);
            ctx.restrictChatMember(ctx.from.id, {
                can_send_messages: true,
                can_send_media_messages: true,
                can_send_other_messages: true,
                can_add_web_page_previews: true
            });
            
            ctx.answerCbQuery('Now you can send messages.');

        }

    } catch (error) {

        console.error(error);

    };

};