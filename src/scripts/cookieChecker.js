const Authentication = require('../platform/login');
const authentication = new Authentication(process.env.NUMBER);
const Cookie = require('../database/models/Cookie');

module.exports = async () => {
    
    try {

        const cookie = await Cookie.find().then(async response => {

            if (response[0] === undefined) {
    
                console.log('Creating new cookies...');

                await authentication.login();
                const newCookie = await Cookie.find().then(response => response[0]);
    
                return newCookie;
    
            } else {
    
                return response[0];
    
            }
    
        });
    
        return cookie;

    } catch (err) {

        console.error(err);

    }

}