'use strict';

const LanguageDetect = require('languagedetect');
const lang = new LanguageDetect();

module.exports = (str) => {
    try {
        const topLanguages = [];
        const languages = lang.detect(str);
        for (let i = 0; i < 3; i++) {
            topLanguages.push(languages[i][0]);
        }

        if (!topLanguages.includes('english', 0)) return false;
            else return true;
    } catch (err) {
        console.error(err);
    }
};