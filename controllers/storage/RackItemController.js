import * as RackItemService from '../../service/storage/RackItemService.js';
import RackItem from '../../models/RackItem.js';

export const createItem = async (req, res) => {
    try {
        const item = await RackItemService.createItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await RackItemService.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await RackItemService.getItemById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const updated = await RackItemService.updateItem(req.params.id, req.body);
        res.json({ updated });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await RackItemService.deleteItem(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getItemsByRackId = async (req, res) => {
    try {
        const { rack_id } = req.params;
        const items = await RackItem.findAll({ where: { rack_id } });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

