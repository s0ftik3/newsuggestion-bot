'use strict'

const Cookie = require('../database/models/Cookie');
const puppeteer = require('puppeteer');

module.exports = class Authentication {

    constructor(number) {
        this.number = number;
    }

    async login() {

        try {

            // Open browser and open the platform.
            const browser = await puppeteer.launch({ args: ["--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox'] });
            const page = await browser.newPage();

            await page.goto('https://bugs.telegram.org/', {
                waitUntil: 'load'
            });

            // Open auth window.
            await page.click('#header-panel > div.header-auth > div > a');

            // Click on input field & fill it with a phone number.
            await page.type('#phone-number', this.number);

            // Click on 'next' button to carry over authentication.
            await page.click('#send-form > div.popup-buttons > button')

            // Wait for 30 seconds until admin confirms login.
            await page.waitForNavigation({ timeout: 30000, waitUntil: 'networkidle2' }, console.log('Waiting for authentication. Timeout: 30 seconds.')).then(() => {
                console.log('Successfully logged in.');
            }).catch(() => {
                console.log('Authentication failed.');
                return console.log({ status: 408, username: null, cookies: null });
            });

            await page.reload({ waitUntil: 'load' });

            // Fetch & save cookies.
            const newCookies = await page.cookies();
            const username = await page.$eval('#header-panel > div.header-auth > div > span > span.dropdown-menu > ul > li:nth-child(1) > span', el => el.textContent);
            await Cookie.find({ username: username }).then(async response => {
                if (response.length <= 0) {
    
                    const data = {
                        account: username,
                        cookies: newCookies
                    };
                    const cookie = new Cookie(data);
                    await cookie.save().then(() => console.log('Cookies saved.'));
    
                }
            });

            console.log('Authenticated without cookies.');

            return { 
                status: 200,
                message: 'Authenticated without cookies successfully passed.'
            };

        } catch (err) {

            console.error(err);

        }

    }

}