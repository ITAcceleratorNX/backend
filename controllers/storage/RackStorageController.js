// controllers/storage/RackStorageController.js
import * as RackStorageService from "../../service/storage/RackStorageService.js";

const createRack = async (req, res) => {
    try {
        const rack = await RackStorageService.createRack(req.body);
        return res.status(201).json(rack);
    } catch (error) {
        console.error("Ошибка при создании стеллажа:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getAllRacks = async (req, res) => {
    try {
        const racks = await RackStorageService.getAllRacks();
        return res.json(racks);
    } catch (error) {
        console.error("Ошибка при получении всех стеллажей:", error);
        return res.status(500).json({ error: error.message });
    }
};

const getRackById = async (req, res) => {
    try {
        const rack = await RackStorageService.getRackById(req.params.id);
        if (!rack) {
            return res.status(404).json({ error: "Стеллаж не найден" });
        }
        return res.json(rack);
    } catch (error) {
        console.error("Ошибка при получении стеллажа по id:", error);
        return res.status(500).json({ error: error.message });
    }
};

const updateRack = async (req, res) => {
    try {
        const updated = await RackStorageService.updateRack(req.params.id, req.body);
        if (updated[0] === 0) {
            return res.status(404).json({ error: "Стеллаж не найден" });
        }
        return res.json({ updated: updated[0] });
    } catch (error) {
        console.error("Ошибка при обновлении стеллажа:", error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteRack = async (req, res) => {
    try {
        const deleted = await RackStorageService.deleteRack(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Стеллаж не найден" });
        }
        return res.json({ deleted });
    } catch (error) {
        console.error("Ошибка при удалении стеллажа:", error);
        return res.status(500).json({ error: error.message });
    }
};

export default {
    createRack,
    getAllRacks,
    getRackById,
    updateRack,
    deleteRack,
};
