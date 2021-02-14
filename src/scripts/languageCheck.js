module.exports = (str) => {
    
    try {

        if (str.match(/[a-zA-Z0-9]|[~!@#$%^&*()_+{}:"?><,./';[\]=\-`]/ig) === null) return false;
        const length = str.match(/[a-zA-Z0-9\s]|[~!@#$%^&*()_+{}:"?><,./';[\]=\-`]/ig).length;

        if (str.length !== length) return false;
            else return true;

    } catch (err) {

        console.error(err);

    }

}