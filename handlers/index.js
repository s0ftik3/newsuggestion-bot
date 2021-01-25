module.exports = {
    handleStart: require('./start'),
    handleCallback: require('./callback'),
    handleChooseApp: require('./card/chooseApp'),
    handleLanguage: require('./card/language'),
    handleSuggestion: require('./card/suggestion'),
    handleSuggestionMedia: require('./card/suggestionMedia'),
    handleSuggestionTitle: require('./card/suggestionTitle'),
    handleEnd: require('./card/end'),
    handleVote: require('./vote/updateMessage'),
    handleDebug: require('./admin/debug'),
    handleReset: require('./admin/reset'),
    handleCancel: require('./cancel')
}