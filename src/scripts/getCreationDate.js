'use strict'

const moment = require('moment');

module.exports = (date, language) => {
    if (language === 'ua') {
        language = 'uk';
    } else if (language === 'po') {
        language = 'pl'
    };
    moment.locale(language);
    return moment(date).fromNow();
};