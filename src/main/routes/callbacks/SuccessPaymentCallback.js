import express from 'express';
import logger from "../../utils/winston/logger.js";
import {Buffer} from "buffer";

const router = express.Router();
router.post('/payment-callback', async (req, res) => {
    logger.info(JSON.parse(Buffer.from(req.data.data, 'base64').toString('utf-8')));
    res.status(200);
}, );

export default router;
