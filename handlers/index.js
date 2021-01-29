module.exports = {
    handleStart: require('./start'),
    handleCallback: require('./callback'),
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
    handleCancel: require('./cancel'),
    handleModerateSuggestion: require('./admin/moderateSuggestion'),
    handleMe: require('./me'),
    handleNewMember: require('./newMember'),
    handleLeftMember: require('./leftMember')
}