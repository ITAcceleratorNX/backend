// mobizon.js
import axios from 'axios';

export default class MobizonApi {
    constructor(apiKey, apiServer = 'api.mobizon.kz') {
        this.apiKey = apiKey;
        this.apiServer = apiServer;
    }

    async sendSms(recipient, text) {
        const response = await axios.post(
            `https://${this.apiServer}/service/message/sendSmsMessage?apiKey=${this.apiKey}&output=json`,
            new URLSearchParams({
                recipient,
                text
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    }
}
