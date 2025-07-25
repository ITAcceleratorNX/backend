import express from 'express';
import logger from "../../utils/winston/logger.js";
import {Contract, Order} from "../../models/init/index.js";
import {checkToActiveOrder} from "../../service/order/OrderService.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const {contract_id,status} = req.body;
    try {
        const contract = await Contract.findOne({
            where: {
                document_id: contract_id
            }
        });
        if (!contract) {
            logger.warn("Check To Active Order: Contract not found");
            return;
        }
        await Contract.update({
            status: status
        },{where: {document_id: contract_id}});
        if(status===2){
            await Order.update(
                { contract_status: 'SIGNED' },
                { where: { id: contract.order_id }}
            );
        }
        await checkToActiveOrder(contract.order_id);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Ошибка при обработке webhook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
