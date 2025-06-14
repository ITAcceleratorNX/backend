import axios from 'axios';
import { URLSearchParams } from 'url'; // 🔧 Добавь это

export default class MobizonApi {
    constructor(apiKey, apiServer = 'api.mobizon.kz') {
        this.apiKey = apiKey;
        this.apiServer = apiServer;
    }

    async sendSms(recipient, text) {
        const params = new URLSearchParams({
            recipient,
            text,
        });

        const response = await axios.post(
            `https://${this.apiServer}/service/message/sendSmsMessage?apiKey=${this.apiKey}&output=json`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    }
}
