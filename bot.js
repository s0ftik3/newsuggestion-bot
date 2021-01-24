const Telegraf = require('telegraf');
const config = require('./config.js');
const bot = new Telegraf(config.token);
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const stage = new Stage();

const connect = require('./database/connect');

const {
    handleStart,
    handleCallback,
    handleChooseApp,
    handleLanguage,
    handleSuggestion,
    handleSuggestionTitle,
    handleSuggestionMedia,
    handleEnd,
    handleVote,
    handleDebug,
    handleReset
} = require('./handlers');

const suggestion = new Scene('suggestion');
stage.register(suggestion);
const suggestionMedia = new Scene('suggestionMedia');
stage.register(suggestionMedia);
const suggestionTitle = new Scene('suggestionTitle');
stage.register(suggestionTitle);

bot.use(session());
bot.use(stage.middleware());

bot.start(handleStart());
bot.command('suggest', handleStart());
bot.command('debug', handleDebug());
bot.command('reset', handleReset());
bot.action('app', handleChooseApp());
bot.action('language', handleLanguage());
bot.action('back', handleStart());
bot.action(/platform:\w+/, handleSuggestion());
bot.action(/\blike:\b\w+/, handleVote());
bot.action(/\bdislike:\b\w+/, handleVote());
suggestion.on('text', handleSuggestionMedia());
suggestionMedia.on('callback_query', handleSuggestionTitle());
suggestionMedia.on('message', handleSuggestionTitle());
suggestionTitle.on('text', handleEnd());

bot.on('callback_query', handleCallback());

bot.launch().then(() => {
    console.log('The bot has been started.');
    connect();
});