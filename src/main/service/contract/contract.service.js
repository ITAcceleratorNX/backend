import axios from "axios";
import * as orderService from "../order/OrderService.js";
import {getByType} from "../price/PriceService.js";

const TRUST_ME_API_TOKEN = process.env.TRUST_ME_API_TOKEN;
const TRUST_ME_API_URL = process.env.TRUST_ME_API_URL;
const createContract = async (id) => {

    const order = await orderService.getByIdForContract(id)
    const formatDate = (timestamp) => {
        if (String(timestamp).length === 10) {
            timestamp *= 1000;
        }
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    let summa;
    if (order.storage.storage_type === 'INDIVIDUAL') {
        summa = (await getByType('INDIVIDUAL')).price;
    } else {
        summa = (await getByType('CLOUD')).price;
    }

    const isPunct33Enabled = !!order.punct33 && order.punct33.trim() !== '';
    const data = {
        templateName: 'Драфт по складам для физ лиц',
        contractName: `Драфт по складам для физ лиц`,
        Requisites: {
            fio: order.user.name,
            IIN_BIN: order.user.iin,
            phoneNumber: order.user.phone,
        },
        templateData: [
            { key: 'contract.date', value: formatDate(order.start_date) },
            { key: 'contract.date2', value: formatDate(order.end_date) },
            { key: 'contract.punct33', value: isPunct33Enabled ? 'включен' : 'не включен' },
            ...(isPunct33Enabled ? [{ key: 'contract.text', value: order.punct33 }] : []),
            { key: 'contract.square', value: String(order.total_volume) },
            { key: 'contract.summa2', value: String(order.total_price) },
            { key: 'contract.summa', value: String(summa) },
            { key: 'client.name', value: order.user.name },
            { key: 'client.bday', value: order.user.bday },
            { key: 'client.iin', value: order.user.iin },
            { key: 'client.address', value: order.user.address },
            { key: 'client.email', value: order.user.email },
            { key: 'client.phone', value: order.user.phone }
        ]
    };

    try {
        const response = await axios.post(TRUST_ME_API_URL+'/contract/create', data, {
            headers: {
                Authorization: TRUST_ME_API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Ошибка создания договора:', error.response?.data || error.message);
        throw error;
    }
}
const getContractStatus = async (documentId) => {
    try {
        const response = await axios.get(TRUST_ME_API_URL+`/trust_contract_public_apis/ContractStatus/${documentId}`, {
            headers: {
                Authorization: TRUST_ME_API_TOKEN,
                'Content-Type': 'application/json',
            },
        });

        const { status, errorText, data } = response.data;

        if (status !== 'Ok') {
            console.error('Ошибка от TrustContract:', errorText);
            throw new Error(errorText || 'Не удалось получить статус документа');
        }

        return data;
    } catch (error) {
        console.error('Ошибка запроса статуса:', error.response?.data || error.message);
        throw error;
    }
};
const revokeContract = async (documentId) => {
    try {
        const response = await axios.get(TRUST_ME_API_URL+`/trust_contract_public_apis/RevokeContract/${documentId}`, {
            headers: {
                Authorization: TRUST_ME_API_TOKEN,
                'Content-Type': 'application/json',
            },
        });

        const { status, errorText, data } = response.data;

        if (status !== 'Ok') {
            console.error('Ошибка при отзыве контракта:', errorText);
            throw new Error(errorText || 'Не удалось отозвать документ');
        }

        return data;
    } catch (error) {
        console.error('Ошибка запроса отзыва контракта:', error.response?.data || error.message);
        throw error;
    }
};

