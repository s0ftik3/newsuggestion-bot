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
    handleCheckSuggestion,
    handlePublishSuggestion,
    handleVote,
    handleDebug,
    handleReset,
    handleCancel,
    handleModerateSuggestion,
    handleMe
} = require('./handlers');

// Card creation's stages.
const suggestion = new Scene('suggestion');
stage.register(suggestion);
const suggestionMedia = new Scene('suggestionMedia');
stage.register(suggestionMedia);
const suggestionTitle = new Scene('suggestionTitle');
stage.register(suggestionTitle);

bot.use(session());
bot.use(stage.middleware());

// Handle start command.
bot.start(handleStart());
bot.command('me', handleMe());

// Creating a new suggestion.
bot.command('suggest', handleStart());
bot.action('app', handleChooseApp());
bot.action('language', handleLanguage());
bot.action('back', handleStart());
bot.action('publish', handlePublishSuggestion());
bot.action('cancel', handleCancel());
bot.action(/platform:\w+/, handleSuggestion());

// Support cancel command.
suggestion.command('cancel', handleCancel());
suggestionMedia.command('cancel', handleCancel());
suggestionTitle.command('cancel', handleCancel());

// Another part of creating a new suggestion.
suggestion.on('text', handleSuggestionMedia());
suggestionMedia.on('callback_query', handleSuggestionTitle());
suggestionMedia.on('message', handleSuggestionTitle());
suggestionTitle.on('text', handleCheckSuggestion());

// Handle likes/dislikes.
bot.action(/\blike:\b\w+/, handleVote());
bot.action(/\bdislike:\b\w+/, handleVote());

// Admin commands.
bot.command('debug', handleDebug());
bot.command('reset', handleReset());

// Handle any callback query.
bot.on('callback_query', handleCallback());

// Check admin's respond.
bot.on('message', handleModerateSuggestion());

// Start the bot.
bot.launch().then(() => {
    console.log('The bot has been started.');
    connect(); // Connect to the database.
});