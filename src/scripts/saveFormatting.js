module.exports = (str, ents) => {
    
    if (ents == undefined) return str;

    let entities = ents;
    let string = str;
    let toReplace = [];

    entities.forEach(e => {
        
        let type = e.type;

        switch(type) {
            
            case 'bold':
                let toReplaceBold = string.slice(e.offset, (e.offset + e.length));
                toReplace.push({ type: 'bold', string: toReplaceBold });

                break;

            case 'italic':
                let toReplaceItalic = string.slice(e.offset, (e.offset + e.length));
                toReplace.push({ type: 'italic', string: toReplaceItalic });

                break;

            case 'code':
                let toReplaceCode = string.slice(e.offset, (e.offset + e.length));
                toReplace.push({ type: 'code', string: toReplaceCode });

                break;

        }

    });

    toReplace.forEach(e => {

        let type = e.type;

        if (e.string.split('').find(e => e === '\n') !== undefined) {
            let spareArr = e.string.split('');

            let index = spareArr.indexOf('↵');
            spareArr.splice(index, 1);
            e.string = spareArr.join('');
        }

        switch(type) {
            
            case 'bold':
                string = string.replace(e.string, `**${e.string}**`);
                break;

            case 'italic':
                string = string.replace(e.string, `*${e.string}*`);

                break;

            case 'code':
                string = string.replace(e.string, `\`\`${e.string}\`\``);

                break;

        }

    });

    string = string.replace(/[\r\n]{3,}/g, ' ');

    return string;

}