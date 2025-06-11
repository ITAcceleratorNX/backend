import express from 'express';
import logger from "../../utils/winston/logger.js";

const router = express.Router();
router.post('/payment-callback', async (req, res) => {
    logger.info({message: req.body})
    res.status(200);
}, );

export default router;
