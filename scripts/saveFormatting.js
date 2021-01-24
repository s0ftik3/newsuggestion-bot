module.exports = (str, ents) => {
    
    let entities = ents;
    let string = str;
    let toReplace = [];

    if (entities == undefined) return string;

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

        switch(type) {
            
            case 'bold':
                string = string.replace(e.string, `*${e.string}*`);
                break;

            case 'italic':
                string = string.replace(e.string, `_${e.string}_`);

                break;

            case 'code':
                string = string.replace(e.string, `\`${e.string}\``);

                break;

        }

    });

    return string;

}