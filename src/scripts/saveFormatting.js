'use strict';

module.exports = (str, ents) => {
    if (ents == undefined) return str;

    const entities = ents;
    const toReplace = [];

    entities.forEach((e) => {
        const type = e.type;

        switch (type) {
            case 'bold':
                let toReplaceBold = str.slice(e.offset, e.offset + e.length);
                toReplace.push({ type: 'bold', string: toReplaceBold });

                break;

            case 'italic':
                let toReplaceItalic = str.slice(e.offset, e.offset + e.length);
                toReplace.push({ type: 'italic', string: toReplaceItalic });

                break;

            case 'code':
                let toReplaceCode = str.slice(e.offset, e.offset + e.length);
                toReplace.push({ type: 'code', string: toReplaceCode });

                break;
        }
    });

    toReplace.forEach((e) => {
        const type = e.type;

        if (e.string.split('').find((e) => e === '\n') !== undefined) {
            let spareArr = e.string.split('');

            let index = spareArr.indexOf('↵');
            spareArr.splice(index, 1);
            e.string = spareArr.join('');
        }

        switch (type) {
            case 'bold':
                str = str.replace(e.string, `**${e.string}**`);
                break;

            case 'italic':
                str = str.replace(e.string, `*${e.string}*`);

                break;

            case 'code':
                str = str.replace(e.string, `\`\`${e.string}\`\``);

                break;
        }
    });

    str = str.replace(/[\r\n]{3,}/g, ' ');

    return str;
};