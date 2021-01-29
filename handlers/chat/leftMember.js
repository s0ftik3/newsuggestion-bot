module.exports = () => (ctx) => {

    try {
        
        if (ctx.update.message.chat.id != -1001431292906) return;
        
        ctx.deleteMessage(ctx.update.message.message_id);

    } catch (error) {

        console.error(error);

    };

};