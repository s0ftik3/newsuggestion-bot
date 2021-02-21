const Markup = require('telegraf/markup');

module.exports = () => (ctx) => {

    try {

        if (ctx.update.message.chat.id != -1001431292906) return;
        
        ctx.deleteMessage(ctx.update.message.message_id);

        const user = `tg://user?id=${ctx.update.message.new_chat_member.id}`;

        ctx.restrictChatMember(ctx.update.message.new_chat_member.id, {
            can_send_messages: false
        });

        ctx.replyWithMarkdown(
            `Welcome, [${ctx.update.message.new_chat_member.first_name}](${user})!\nPress on the button below to get an access to send messages.\n\n` +
            `This group chat is for people who would like to discuss suggestions on bugs.telegram.org.\n\n` +
            `You can suggest your feature by using the button below.`, {
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('Allow me to send messages', `allow:${ctx.update.message.new_chat_member.id}`),
                Markup.urlButton('Suggest a feature', 'https://t.me/NewSuggestionBot')
            ], { columns: 1 }),
            disable_web_page_preview: true
        });

    } catch (error) {

        console.error(error);

    };

};