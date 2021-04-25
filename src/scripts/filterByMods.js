'use strict';

module.exports = (data) => {
    try {
        const arr = data;
        const moderators = arr.filter(e => e.role === 'moderator');

        for (let i = 0; i < moderators.length; i++) {
            const moderator = moderators[i];
            const index = arr.indexOf(moderator);
            arr.splice(index, 1);
            arr.unshift(moderator);
        }

        return arr;
    } catch (err) {
        console.error(err);
    }
};