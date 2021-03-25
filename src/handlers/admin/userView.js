const User = require('../../database/models/User');
const Markup = require('telegraf/markup');
const config = require('../../../config');
const moment = require('moment');

module.exports = () => async (ctx) => {
    try {
        const action = Array.isArray(ctx.match) ? ctx.match[0].split(':')[0] : ctx.match;

        if (action === 'adminUsersView') {
            const id = ctx.match[0].split(':')[1];
            const index = ctx.match.input.split(':')[2];
            const user = await User.find({ id: id }).then(response => { 
                return {
                    firstName: response[0].firstName,
                    lastName: response[0].lastName,
                    username: response[0].username,
                    role: response[0].role,
                    language: response[0].language,
                    isBanned: response[0].banned,
                    neverAskMedia: response[0].neverAskMedia,
                    autoTranslate: response[0].autoTranslate,
                    joined: response[0].timestamp,
                    cards: response[0].cards.length
                }
            });

            let buttons = [
                Markup.callbackButton(`${(user.role === 'moderator') ? 'Demote' : 'Promote'}`, `adminPromote:${id}:${(user.role === 'moderator') ? 'demote' : 'promote'}:${index}`),
                Markup.callbackButton(`${(user.isBanned === true) ? 'Unban' : 'Ban'}`, `adminBan:${id}:${(user.isBanned === true) ? 'unban' : 'ban'}:${index}`),
                Markup.callbackButton('Delete', `adminUsersDelete:${id}:${index}`)
            ];

            if (id === config.admin) {
                buttons = [
                    Markup.callbackButton('You can\'t do anything to God.', `nothing`)
                ];
            }
    
            ctx.editMessageText(
                `<b>User:</b> <i>${user.firstName}${(user.lastName !== null) ? ' ' + user.lastName : ''}</i>${(user.username !== null) ? ' (@' + user.username + ')' : ''}\n` +
                `<b>Role:</b> <i>${(user.role === undefined) ? 'user' : user.role}</i>\n` +
                `<b>Language:</b> <i>${user.language}</i>\n` +
                `<b>Is Banned:</b> <i>${(user.isBanned === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Skip media step:</b> <i>${(user.neverAskMedia === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Auto-translate turned on:</b> <i>${(user.autoTranslate === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Cards created:</b> <i>${user.cards}</i>\n` +
                `<b>Joined:</b> <i>${moment(user.joined).format('LLL')}</i>`,
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        buttons,
                        [Markup.callbackButton(ctx.i18n.t('« Back'), `adminUsersBack:${index}`)]
                    ])
                }
            );
    
            ctx.answerCbQuery();
        } else if (action === 'adminBan') {
            const id = ctx.match[0].split(':')[1];
            const index = ctx.match.input.split(':')[3];
            const toBan = (ctx.match.input.split(':')[2] === 'ban') ? true : false;
            await User.updateOne({ id: id }, { $set: { banned: (toBan) ? true: false } }, () => {});
            const user = await User.find({ id: id }).then(response => { 
                return {
                    firstName: response[0].firstName,
                    lastName: response[0].lastName,
                    username: response[0].username,
                    role: response[0].role,
                    language: response[0].language,
                    isBanned: response[0].banned,
                    neverAskMedia: response[0].neverAskMedia,
                    autoTranslate: response[0].autoTranslate,
                    joined: response[0].timestamp,
                    cards: response[0].cards.length
                }
            });
    
            let buttons = [
                Markup.callbackButton(`${(user.role === 'moderator') ? 'Demote' : 'Promote'}`, `adminPromote:${id}:${(user.role === 'moderator') ? 'demote' : 'promote'}:${index}`),
                Markup.callbackButton(`${(user.isBanned === true) ? 'Unban' : 'Ban'}`, `adminBan:${id}:${(user.isBanned === true) ? 'unban' : 'ban'}`),
                Markup.callbackButton('Delete', `adminUsersDelete:${id}:${index}`)
            ];
            
            if (id === config.admin) {
                buttons = [
                    Markup.callbackButton('You can\'t do anything to God.', `nothing`)
                ];
            }

            ctx.editMessageText(
                `<b>User:</b> <i>${user.firstName}${(user.lastName !== null) ? ' ' + user.lastName : ''}</i>${(user.username !== null) ? ' (@' + user.username + ')' : ''}\n` +
                `<b>Role:</b> <i>${(user.role === undefined) ? 'user' : user.role}</i>\n` +
                `<b>Language:</b> <i>${user.language}</i>\n` +
                `<b>Is Banned:</b> <i>${(user.isBanned === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Skip media step:</b> <i>${(user.neverAskMedia === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Auto-translate turned on:</b> <i>${(user.autoTranslate === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Cards created:</b> <i>${user.cards}</i>\n` +
                `<b>Joined:</b> <i>${moment(user.joined).format('LLL')}</i>`,
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        buttons,
                        [Markup.callbackButton(ctx.i18n.t('« Back'), `adminUsersBack:${index}`)]
                    ])
                }
            );

            ctx.answerCbQuery(`${(toBan) ? `User ${user.firstName} has been banned.` : `User ${user.firstName} has been unbanned.`}`, true);
        } else if (action === 'adminUsersDelete') {
            const id = ctx.match[0].split(':')[1];
            const index = ctx.match.input.split(':')[2];
            await User.deleteOne({ id: id });
            ctx.editMessageText('User has been deleted from the database.', {
                reply_markup: Markup.inlineKeyboard([Markup.callbackButton(ctx.i18n.t('« Back',), `adminUsersBack:${index}`)])
            });
            ctx.answerCbQuery();
        } else if (action === 'adminPromote') {
            const id = ctx.match[0].split(':')[1];
            const index = ctx.match.input.split(':')[3];
            const toPromote = (ctx.match.input.split(':')[2] === 'promote') ? true : false;
            await User.updateOne({ id: id }, { $set: { role: (toPromote) ? 'moderator' : 'user' } }, () => {});
            const user = await User.find({ id: id }).then(response => { 
                return {
                    firstName: response[0].firstName,
                    lastName: response[0].lastName,
                    username: response[0].username,
                    role: response[0].role,
                    language: response[0].language,
                    isBanned: response[0].banned,
                    neverAskMedia: response[0].neverAskMedia,
                    autoTranslate: response[0].autoTranslate,
                    joined: response[0].timestamp,
                    cards: response[0].cards.length
                }
            });
    
            let buttons = [
                Markup.callbackButton(`${(user.role === 'moderator') ? 'Demote' : 'Promote'}`, `adminPromote:${id}:${(user.role === 'moderator') ? 'demote' : 'promote'}:${index}`),
                Markup.callbackButton(`${(user.isBanned === true) ? 'Unban' : 'Ban'}`, `adminBan:${id}:${(user.isBanned === true) ? 'unban' : 'ban'}`),
                Markup.callbackButton('Delete', `adminUsersDelete:${id}:${index}`)
            ];
    
            if (id === config.admin) {
                buttons = [
                    Markup.callbackButton('You can\'t do anything to the God.', `nothing`)
                ];
            }

            ctx.editMessageText(
                `<b>User:</b> <i>${user.firstName}${(user.lastName !== null) ? ' ' + user.lastName : ''}</i>${(user.username !== null) ? ' (@' + user.username + ')' : ''}\n` +
                `<b>Role:</b> <i>${(user.role === undefined) ? 'user' : user.role}</i>\n` +
                `<b>Language:</b> <i>${user.language}</i>\n` +
                `<b>Is Banned:</b> <i>${(user.isBanned === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Skip media step:</b> <i>${(user.neverAskMedia === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Auto-translate turned on:</b> <i>${(user.autoTranslate === true) ? 'yes' : 'no'}</i>\n` +
                `<b>Cards created:</b> <i>${user.cards}</i>\n` +
                `<b>Joined:</b> <i>${moment(user.joined).format('LLL')}</i>`,
                {
                    parse_mode: 'HTML',
                    reply_markup: Markup.inlineKeyboard([
                        buttons,
                        [Markup.callbackButton(ctx.i18n.t('« Back'), `adminUsersBack:${index}`)]
                    ])
                }
            );

            ctx.answerCbQuery(`${(toPromote) ? `User ${user.firstName} has been promoted.` : `User ${user.firstName} has been demoted.`}`, true);
        }
    } catch (err) {
        console.error(err);
    }
};