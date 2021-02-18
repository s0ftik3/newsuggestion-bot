'use strict'

const {
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
    editTitle,
    editDescription,
    deleteCard,
    loadComments,
    getMe
} = require('./utils');

module.exports = class Platform {

    constructor(cookie = { ssid: String, dt: String, token: String }) {

        this.ssid = cookie.ssid;
        this.dt = cookie.dt;
        this.token = cookie.token;

    }

    async createSuggestion(data) {
        
        const stel_ln = 'en'; 
        const stel_ssid = this.ssid; 
        const stel_dt = this.dt; 
        const stel_token= this.token;
        const hash = await getHash({
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        });

        await resetPage({
            hash: hash,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        });

        const msg_id = await getFirstMsgId({
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        const stage1 = await skipFirstQuestion({
            hash: hash,
            msg_id: msg_id,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        const stage2 = await skipSecondQuestion({
            hash: hash,
            msg_id: stage1,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        const stage3 = await chooseApplication({
            hash: hash,
            msg_id: stage2,
            application: data.app,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        const stage4 = await setDescription({
            hash: hash,
            description: data.description,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        if (data.media === null) {

            await skipAttachFile({
                hash: hash,
                msg_id: parseInt(stage4) + 1,
                stel_ln: stel_ln, 
                stel_ssid: stel_ssid, 
                stel_dt: stel_dt, 
                stel_token: stel_token
            })
            .then(response => response)
            .catch(err => console.error(err));

        } else {

            await uploadFile({
                hash: hash,
                media: data.media.data,
                stel_ln: stel_ln, 
                stel_ssid: stel_ssid, 
                stel_dt: stel_dt, 
                stel_token: stel_token
            })
            .then(response => response)
            .catch(err => console.error(err));

        }

        const stage6 = await setTitle({
            hash: hash,
            title: data.title,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        let result = await submitSuggestion({
            hash: hash,
            msg_id: parseInt(stage6) + 1,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        return result;

    }

    async editSuggestionTitle(data) {

        const stel_ln = 'en'; 
        const stel_ssid = this.ssid; 
        const stel_dt = this.dt; 
        const stel_token= this.token;
        const hash = await getHash({
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        });

        return await editTitle({
            hash: hash,
            title: data.title,
            description: data.description,
            url_id: data.url_id,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => (response.data.error !== undefined) ? false : true)
        .catch(err => console.error(err));

    }

    async editSuggestionDescription(data) {

        const stel_ln = 'en'; 
        const stel_ssid = this.ssid; 
        const stel_dt = this.dt; 
        const stel_token= this.token;
        const hash = await getHash({
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        });

        return await editDescription({
            hash: hash,
            title: data.title,
            description: data.description,
            url_id: data.url_id,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => (response.data.error !== undefined) ? false : true)
        .catch(err => console.error(err));

    }

    async deleteSuggestion(data) {

        const stel_ln = 'en'; 
        const stel_ssid = this.ssid; 
        const stel_dt = this.dt; 
        const stel_token= this.token;
        const hash = await getHash({
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        });

        return await deleteCard({
            hash: hash,
            url_id: data.url_id,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => (response.data.error !== undefined) ? false : true)
        .catch(err => console.error(err));

    }

    async getComments(data) {

        const stel_ln = 'en'; 
        const stel_ssid = this.ssid; 
        const stel_dt = this.dt; 
        const stel_token= this.token;
        const hash = await getHash({
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        });

        return await loadComments({
            hash: hash,
            url_id: data.url_id,
            after_id: data.after_id,
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

    }

    async getMe() {

        const stel_ln = 'en'; 
        const stel_ssid = this.ssid; 
        const stel_dt = this.dt; 
        const stel_token= this.token;

        let data = await getMe({
            stel_ln: stel_ln, 
            stel_ssid: stel_ssid, 
            stel_dt: stel_dt, 
            stel_token: stel_token
        })
        .then(response => response)
        .catch(err => console.error(err));

        return data;

    }

}