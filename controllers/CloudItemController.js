import {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} from '../service/CloudItemService.js';

export const getItems = async (req, res) => {
    try {
        const items = await getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const getItem = async (req, res) => {
    try {
        const item = await getItemById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Элемент не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const createNewItem = async (req, res) => {
    try {
        const newItem = await createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании элемента' });
    }
};

export const updateExistingItem = async (req, res) => {
    try {
        const updated = await updateItem(req.params.id, req.body);
        if (updated) {
            res.json({ message: 'Элемент обновлен' });
        } else {
            res.status(404).json({ message: 'Элемент не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении элемента' });
    }
};

export const deleteExistingItem = async (req, res) => {
    try {
        const deleted = await deleteItem(req.params.id);
        if (deleted) {
            res.json({ message: 'Элемент удален' });
        } else {
            res.status(404).json({ message: 'Элемент не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении элемента' });
    }
};
