'use strict';

const LanguageDetect = require('languagedetect');
const lang = new LanguageDetect();

module.exports = (str) => {
    try {
        const language = lang.detect(str)[0][0];

        if (language != 'english') return false;
        else return true;
    } catch (err) {
        console.error(err);
    }
};