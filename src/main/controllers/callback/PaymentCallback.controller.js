import logger from '../../utils/winston/logger.js';
import {handleCallbackData} from '../../service/callback/PaymentCallback.service.js';
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const handlePaymentCallback = asyncHandler(async (req, res) => {
    try {
        await handleCallbackData(req.body.data);
        res.sendStatus(200);
    } catch (err) {
        logger.error('Error in payment callback:', err);
    }
});