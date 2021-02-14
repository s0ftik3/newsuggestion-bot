const axios = require('axios');
const FormData = require('form-data');

async function getHash(data) {

    return await axios({
        method: 'GET',
        url: 'https://bugs.telegram.org/',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': 1
        }
    })
    .then(response => {

        const hash = response.data.match(/\/api\?hash=\w+/)[0].replace(/\/api\?hash=/gi, '');
        console.log('%s: Updated hash.', new Date().toUTCString());
        
        return hash;

    })
    .catch(err => console.error(err));

}

async function resetPage(data) {

    console.log('%s: Refreshed page.', new Date().toUTCString());

    return await axios({
        method: 'GET',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&mode=suggestion&init_hash=de7a3ea0be731b300b&query=&method=initDialog`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(() => true)
    .catch(err => console.error(err), false);

}

async function getFirstMsgId(data) {

    return await axios({
        method: 'GET',
        url: 'https://bugs.telegram.org/my?l=c%2Fnew%2Fsuggestion',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.l.match(/<input (.*) name="msg_id" value="(.*)" \/>/gi)[0];
        const msg_id = hiddenMsgId.match(/value="(.*)"/gi)[0].replace(/value=|['"]+/g, '');

        console.log('%s: Got first message ID.', new Date().toUTCString());
        
        return msg_id;

    })
    .catch(err => console.error(err));

}

async function skipFirstQuestion(data) {

    return await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&msg_id=${data.msg_id}&opt=0&method=selectDialogOption`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.messages_html.match(/<div (.*) data-comment-id="(.*)">/gi)[0];
        const next_msg_id = hiddenMsgId.match(/data-comment-id="(.*)"/gi)[0].replace(/data-comment-id=|['"]+/g, '');

        console.log('%s: Skipped the first step.', new Date().toUTCString());
        
        return next_msg_id;

    })
    .catch(err => console.error(err));

}

async function skipSecondQuestion(data) {

    return await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&msg_id=${data.msg_id}&opt=0&method=selectDialogOption`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.messages_html.match(/<div (.*) data-comment-id="(.*)">/gi)[0];
        const next_msg_id = hiddenMsgId.match(/data-comment-id="(.*)"/gi)[0].replace(/data-comment-id=|['"]+/g, '');

        console.log('%s: Skipped the second step.', new Date().toUTCString());
        
        return next_msg_id;

    })
    .catch(err => console.error(err));

}

async function chooseApplication(data) {

    return await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&msg_id=${data.msg_id}&opt=${data.application}&method=selectDialogOption`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.messages_html.match(/<div (.*) data-comment-id="(.*)">/gi)[0];
        const next_msg_id = hiddenMsgId.match(/data-comment-id="(.*)"/gi)[0].replace(/data-comment-id=|['"]+/g, '');

        console.log('%s: Chose an application.', new Date().toUTCString());
        
        return next_msg_id;

    })
    .catch(err => console.error(err));

}

async function setDescription(data) {

    return await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&text=${encodeURIComponent(data.description)}&files=&method=sendDialogMessage`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.messages_html.match(/<div (.*) data-comment-id="(.*)">/gi)[0];
        const next_msg_id = hiddenMsgId.match(/data-comment-id="(.*)"/gi)[0].replace(/data-comment-id=|['"]+/g, '');
        
        console.log('%s: Set the description.', new Date().toUTCString());

        return next_msg_id;

    })
    .catch(err => console.error(err));

}

async function uploadFile(data) {

    const form = new FormData();
    form.append('file', await axios({
        method: 'GET',
        url: `https://api.telegram.org/file/bot${process.env.TOKEN}/${data.media}`,
        responseType: 'stream'
    }).then(response => response.data));

    const image = await axios({
        method: 'POST',
        url: 'https://telegra.ph/upload?source=bugtracker',
        headers: {
            ...form.getHeaders()
        },
        data : form
    })
    .then(response => response.data.file_data)
    .catch(err => console.error(err));

    await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&text=&files=${image}&method=sendDialogMessage`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(() => console.log('%s: Uploaded a file.', new Date().toUTCString()))
    .catch(err => console.error(err));

}

async function skipAttachFile(data) {

    let msg_id = await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&msg_id=${data.msg_id}&opt=0&method=selectDialogOption`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.messages_html.match(/<div (.*) data-comment-id="(.*)">/gi)[0];
        const next_msg_id = hiddenMsgId.match(/data-comment-id="(.*)"/gi)[0].replace(/data-comment-id=|['"]+/g, '');

        return next_msg_id;

    })
    .catch(err => console.error(err));

    return await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&msg_id=${msg_id}&opt=0&method=selectDialogOption`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.messages_html.match(/<div (.*) data-comment-id="(.*)">/gi)[0];
        const next_msg_id = hiddenMsgId.match(/data-comment-id="(.*)"/gi)[0].replace(/data-comment-id=|['"]+/g, '');

        console.log('%s: Skipped media-attach step.', new Date().toUTCString());
        
        return next_msg_id;

    })
    .catch(err => console.error(err));

}

async function setTitle(data) {

    return await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&text=${encodeURIComponent(data.title)}&files=&method=sendDialogMessage`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const hiddenMsgId = response.data.messages_html.match(/<div (.*) data-comment-id="(.*)">/gi)[0];
        const next_msg_id = hiddenMsgId.match(/data-comment-id="(.*)"/gi)[0].replace(/data-comment-id=|['"]+/g, '');

        console.log('%s: Set the title.', new Date().toUTCString());
        
        return next_msg_id;

    })
    .catch(err => console.error(err));

}

async function submitSuggestion(data) {

    console.log('%s: Published the suggestion.', new Date().toUTCString());

    return await axios({
        method: 'POST',
        url: `https://bugs.telegram.org/api?hash=${data.hash}&msg_id=${data.msg_id}&opt=0&method=selectDialogOption`,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const url = response.data.messages_html.match(/https:\/\/bugs.telegram.org\/c\/(.+)/gi)[0].replace(/<\/?[^>]+(>|$)/gi, '');
        
        return { ok: true, suggestion: url };

    })
    .catch(err => console.error(err));

}

async function getMe(data) {

    return await axios({
        method: 'GET',
        url: 'https://bugs.telegram.org/my',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': `stel_ln=${data.stel_ln}; stel_ssid=${data.stel_ssid}; stel_dt=${data.stel_dt}; stel_token=${data.stel_token}`,
            'Host': 'bugs.telegram.org',
            'Referer':'https://bugs.telegram.org/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {

        const suggestionCount = response.data.h.match(/<h3 class="bt-header" data-count="(.+)">/gi)[0].match(/data-count="(.+)"/)[0].replace(/data-count=|['"]+/gi, '');
        const username = response.data.h.match(/<span class="bt-dropdown-item">(.+)<\/span>/gi)[0].split('<li>')[0].replace(/<\/?[^>]+(>|$)/g, '');
        
        return { user: username, cards: Number(suggestionCount) };

    })
    .catch(err => console.error(err));

}

module.exports = {
    getHash,
    resetPage,
    getFirstMsgId,
    skipFirstQuestion,
    skipSecondQuestion,
    chooseApplication,
    setDescription,
    uploadFile,
    skipAttachFile,
    setTitle,
    submitSuggestion,
    getMe
}