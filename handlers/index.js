module.exports = {
    handleStart: require('./commands/start'),
    handleCallback: require('./other/callback'),
    handleChooseApp: require('./card/chooseApp'),
    handleLanguage: require('./card/suggestLanguage'),
    handleSuggestion: require('./card/suggestion'),
    handleSuggestionMedia: require('./card/suggestionMedia'),
    handleSuggestionTitle: require('./card/suggestionTitle'),
    handleCheckSuggestion: require('./card/checkSuggestion'),
    handlePublishSuggestion: require('./card/publishSuggestion'),
    handleVote: require('./vote/updateVote'),
    handleDebug: require('./admin/debug'),
    handleReset: require('./admin/reset'),
    handleCancel: require('./commands/cancel'),
    handleModerateSuggestion: require('./admin/moderateSuggestion'),
    handleMe: require('./commands/me'),
    handleNewMember: require('./chat/newMember'),
    handleLeftMember: require('./chat/leftMember')
}