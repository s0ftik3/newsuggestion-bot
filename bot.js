const Telegraf = require('telegraf');
const config = require('./config.js');
const bot = new Telegraf(config.token);

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
    handleUpdateVote
} = require('./src/handlers');

const description = new Scene('description');
stage.register(description);
const media = new Scene('media');
stage.register(media);
const title = new Scene('title');
stage.register(title);

bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

bot.start(handleStart());

bot.command('me', handleMe());
bot.command(['new', 'suggest'], handleChooseApp());

bot.action('backStart', handleStart());
bot.action('language', handleLanguage());
bot.action('sLanguage', handleSuggestLanguage());
bot.action('sFeature', handleChooseApp());
bot.action('skip', handleTitle());
bot.action('check', handleCheck());
bot.action('cancel', handleCancel());
bot.action('publish', handlePublish());
bot.action(/app:\w+/, handleDescription());
bot.action(/setLang:\w+/, handleLanguage());
bot.action(/allow:\w+/, handleAllowSendMessages());
bot.action(/\blike:\b\w+/, handleUpdateVote());
bot.action(/\bdislike:\b\w+/, handleUpdateVote());
bot.action(/back:\w+/, handleMe());
bot.action(/forward:\w+/, handleMe());
bot.action(/backward:\w+/, handleMe());
bot.action(/view:\w+/, handleMe());

description.on('text', handleMedia());
media.on(['text', 'photo', 'video'], handleTitle());
title.on('text', handleFindSimilar());
bot.on('new_chat_members', handleNewMember());
bot.on('left_chat_member', handleLeftMember());
bot.on('callback_query', handleCallback());

bot.launch().then(async () => {
    console.log('The bot has been started.');
    connect();
    await queueWorker().then(response => {
        (response) ? console.log('Work is done.') : false;
        setInterval(async () => {
            await queueWorker().then(response => (response) ? console.log('Work is done.') : false);
        }, 10000);
    });
});