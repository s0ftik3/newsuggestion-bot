const Markup = require('telegraf/markup');

module.exports = () => (ctx) => {

    try {

        if (ctx.update.message.chat.id != -1001431292906) return;
        
        ctx.deleteMessage(ctx.update.message.message_id);

        const user = `tg://user?id=${ctx.update.message.new_chat_member.id}`;
        ctx.reply(
            `Welcome, [${ctx.update.message.new_chat_member.first_name}](${user})!\n\n` +
            `This is a group chat for people who want to suggest new features for Telegram and don't leave them skipped. Read the article before asking something — telegra.ph/Must-Know-01-29\n\n` +
            `You can suggest your feature by using the button below _(for those, who still don't have an access to bugs.telegram.org OR who want to suggest a feature annonymously)_.`, {
                parse_mode: 'Markdown',
                reply_markup: Markup.inlineKeyboard([
                    Markup.urlButton('Suggest a feature', 'https://t.me/NewSuggestionBot')
                ], { columns: 1 }),
                disable_web_page_preview: true
        });

    } catch (error) {

        console.error(error);

    };

};