import * as DeliveryService from '../../service/storage/DeliveryService.js';

export const requestDelivery = async (req, res) => {
    try {
        const { rack_id, package_type } = req.body;

        if (!rack_id || !package_type) {
            return res.status(400).json({ error: 'Rack ID және Package Type міндетті' });
        }

        const newDelivery = await DeliveryService.createDeliveryRequest({ rack_id, package_type });

        res.status(201).json(newDelivery); // ✅ базаға сақталады
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
