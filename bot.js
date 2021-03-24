const Telegraf = require('telegraf');
const config = require('./config.js');
const bot = new Telegraf(config.token);

const rateLimit = require('telegraf-ratelimit');
const limitConfig = config.limit;

const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const stage = new Stage();

const path = require('path');
const TelegrafI18n = require('telegraf-i18n');
const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, './src/locales'),
    defaultLanguage: 'en',
    defaultLanguageOnMissing: true
});

const queueWorker = require('./src/scripts/queueWorker');
const commentsChecker = require('./src/scripts/commentsChecker.js');

const connect = require('./src/database/connect');

const {
    handleStart,
    handleLanguage,
    handleSuggestLanguage,
    handleChooseApp,
    handleDescription,
    handleMedia,
    handleTitle,
    handleFindSimilar,
    handleCheck,
    handleCancel,
    handlePublish,
    handleCallback,
    handleNewMember,
    handleLeftMember,
    handleAllowSendMessages,
    handleMe,
    handleUpdateVote,
    handleView,
    handleEdit,
    handleDelete,
    handleReset,
    handleDeleteAdmin,
    handleSettings,
    handleInline,
    handleMenu,
    handleStats,
    handleManageCards,
    handleAdminView,
    handleManageUsers,
    handleAdminViewUser
} = require('./src/handlers');

const description = new Scene('description');
stage.register(description);
const media = new Scene('media');
stage.register(media);
const title = new Scene('title');
stage.register(title);

const titleEdit = new Scene('titleEdit');
stage.register(titleEdit);
const descriptionEdit = new Scene('descriptionEdit');
stage.register(descriptionEdit);

bot.use(session());
bot.use(i18n.middleware());
bot.use(rateLimit(limitConfig));
bot.use(stage.middleware());

description.on('text', handleMedia());
media.on(['text', 'photo', 'video'], handleTitle());
title.on('text', handleFindSimilar());
titleEdit.on('text', handleEdit());
descriptionEdit.on('text', handleEdit());

bot.start(handleStart());
bot.command('me', handleMe());
bot.command(['new', 'suggest'], handleChooseApp());
bot.command('settings', handleSettings());
bot.command('reset', handleReset());

bot.action('backStart', handleStart());
bot.action('language', handleLanguage());
bot.action('sLanguage', handleSuggestLanguage());
bot.action('sFeature', handleChooseApp());
bot.action('skip', handleTitle());
bot.action('check', handleCheck());
bot.action('cancel', handleCancel());
bot.action('publish', handlePublish());
bot.action('settings', handleSettings());
bot.action('adminPanel', handleMenu());
bot.action('mCards', handleManageCards());
bot.action('mUsers', handleManageUsers());
bot.action(/adminForward:\w+/, handleManageCards());
bot.action(/adminBackward:\w+/, handleManageCards());
bot.action(/adminBack:\w+/, handleManageCards());
bot.action(/adminView:\w+/, handleAdminView());
bot.action(/adminDelete:\w+/, handleDeleteAdmin());
bot.action(/adminUsersForward:\w+/, handleManageUsers());
bot.action(/adminUsersBackward:\w+/, handleManageUsers());
bot.action(/adminUsersBack:\w+/, handleManageUsers());
bot.action(/adminUsersView:\w+/, handleAdminViewUser());
bot.action(/adminPromote:\w+/, handleAdminViewUser());
bot.action(/adminBan:\w+/, handleAdminViewUser());
bot.action(/adminUsersDelete:\w+/, handleAdminViewUser());
bot.action('vStats', handleStats());
bot.action('backAdmin', handleMenu());
bot.action(/app:\w+/, handleDescription());
bot.action(/setLang:\w+/, handleLanguage());
bot.action(/allow:\w+/, handleAllowSendMessages());
bot.action(/\blike:\b\w+/, handleUpdateVote());
bot.action(/\bdislike:\b\w+/, handleUpdateVote());
bot.action(/back:\w+/, handleMe());
bot.action(/forward:\w+/, handleMe());
bot.action(/backward:\w+/, handleMe());
bot.action(/view:\w+/, handleView());
bot.action(/edit:\w+/, handleEdit());
bot.action(/titleEdit:\w+/, handleEdit());
bot.action(/descriptionEdit:\w+/, handleEdit());
bot.action(/delete:\w+/, handleDelete());
bot.action(/reallyDelete:\w+/, handleDelete());
bot.action(/nam:\w+/, handleSettings());
bot.action(/at:\w+/, handleSettings());

bot.on('new_chat_members', handleNewMember());
bot.on('left_chat_member', handleLeftMember());
bot.on('inline_query', handleInline());
bot.on('callback_query', handleCallback());

let commentChecking = false;
let queueChecking = false;

bot.launch().then(async () => {
    console.log('The bot has been started.');
    connect();
    setInterval(async () => {
        if (!commentChecking) {
            commentChecking = true;
            await commentsChecker().then(() => commentChecking = false);
        };
    }, 30 * 1000);
    setInterval(async () => {
        if (!queueChecking) {
            queueChecking = true;
            await queueWorker().then(() => queueChecking = false);
        };
    }, 15 * 1000);
});