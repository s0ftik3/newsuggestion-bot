module.exports = {
    handleStart: require('./start'),
    handleLanguage: require('./language'),
    handleSuggestLanguage: require('./suggestLanguage'),
    handleChooseApp: require('./suggestion/chooseApplication'),
    handleDescription: require('./suggestion/description'),
    handleMedia: require('./suggestion/media'),
    handleTitle: require('./suggestion/title'),
    handleFindSimilar: require('./suggestion/findSimilar'),
    handleCheck: require('./suggestion/check'),
    handleCancel: require('./cancel'),
    handlePublish: require('./suggestion/publish'),
    handleCallback: require('./callback'),
    handleNewMember: require('./chat/newMember'),
    handleLeftMember: require('./chat/leftMember'),
    handleAllowSendMessages: require('./chat/allowSendMessages'),
    handleMe: require('./me'),
    handleUpdateVote: require('./updateVote')
}