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
    handleMe,
    handleNewMember,
    handleLeftMember,
    handleAllowSendMessages,
    handleFindSimilar,
    handleAdd
} = require('./handlers');

// Card creation's stages.
const suggestion = new Scene('suggestion');
stage.register(suggestion);
const suggestionMedia = new Scene('suggestionMedia');
stage.register(suggestionMedia);
const suggestionTitle = new Scene('suggestionTitle');
stage.register(suggestionTitle);

// Middlewares
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
bot.action('check', handleCheckSuggestion());
bot.action(/decline:\w+/, handleModerateSuggestion());
bot.action(/platform:\w+/, handleSuggestion());
bot.action(/allow:\w+/, handleAllowSendMessages());

// Add suggestion from the website.
bot.command('add', handleAdd());

// Support cancel command.
suggestion.command('cancel', handleCancel());
suggestionMedia.command('cancel', handleCancel());
suggestionTitle.command('cancel', handleCancel());

// Another part of creating a new suggestion.
suggestion.on('text', handleSuggestionMedia());
suggestionMedia.on('callback_query', handleSuggestionTitle());
suggestionMedia.on('message', handleSuggestionTitle());
suggestionTitle.on('text', handleFindSimilar());

// Handle likes/dislikes.
bot.action(/\blike:\b\w+/, handleVote());
bot.action(/\bdislike:\b\w+/, handleVote());

// Admin commands.
bot.command('debug', handleDebug());
bot.command('reset', handleReset());
bot.on('text', handleModerateSuggestion());

// Handle users' join/leave in https://t.me/SuggestFeature
bot.on('new_chat_members', handleNewMember());
bot.on('left_chat_member', handleLeftMember());

// Handle any callback query.
bot.on('callback_query', handleCallback());

// Start the bot.
bot.launch().then(() => {
    console.log('The bot has been started.');
    connect(); // Connect to the database.
});