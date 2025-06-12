import express from 'express';

const router = express.Router();
router.get('/payment-callback', async (req, res) => {
    console.log(req.body)
    res.status(200);
}, );

export default router;
