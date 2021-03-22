module.exports = {
    handleStart: require('./user/start'),
    handleLanguage: require('./user/language'),
    handleSuggestLanguage: require('./suggestion/suggestLanguage'),
    handleChooseApp: require('./suggestion/chooseApplication'),
    handleDescription: require('./suggestion/description'),
    handleMedia: require('./suggestion/media'),
    handleTitle: require('./suggestion/title'),
    handleFindSimilar: require('./suggestion/findSimilar'),
    handleCheck: require('./suggestion/check'),
    handleCancel: require('./user/cancel'),
    handlePublish: require('./suggestion/publish'),
    handleCallback: require('./callback'),
    handleNewMember: require('./chat/newMember'),
    handleLeftMember: require('./chat/leftMember'),
    handleAllowSendMessages: require('./chat/allowSendMessages'),
    handleMe: require('./user/me'),
    handleUpdateVote: require('./chat/updateVote'),
    handleView: require('./card/view'),
    handleEdit: require('./card/edit'),
    handleDelete: require('./card/delete'),
    handleReset: require('./admin/reset'),
    handleDeleteAdmin: require('./admin/delete'),
    handleDebug: require('./admin/debug'),
    handleBan: require('./admin/ban'),
    handlePardon: require('./admin/pardon'),
    handleSettings: require('./user/settings'),
    handleInline: require('./user/inline')
}