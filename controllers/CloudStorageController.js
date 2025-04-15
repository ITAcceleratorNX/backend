import * as CloudStorageService from "../service/CloudStorageService.js"; // Қызметті импорттау

const getAllCloud = async (req, res) => {
    try {
        const clouds = await CloudStorageService.getAllCloud(); // CloudStorageService-тен барлық мәліметтерді алу
        return res.json(clouds); // Мәліметтерді жауап ретінде қайтару
    } catch (err) {
        console.error('Error occurred:', err); // Қате болса, журналға жазу
        return res.status(500).json({ error: err.message }); // 500 қатесімен жауап қайтару
    }
};

const getCloudById = async (req, res) => {
    try {
        const cloud = await CloudStorageService.getCloudById(req.params.id); // ID бойынша мәліметтерді алу
        if (!cloud) {
            return res.status(404).json({ error: 'Cloud storage not found' }); // Егер мәлімет табылмаса, 404 қатесі
        }
        return res.json(cloud); // Мәліметті қайтару
    } catch (err) {
        console.error('Error occurred:', err); // Қате болса, журналға жазу
        return res.status(500).json({ error: err.message }); // 500 қатесімен жауап қайтару
    }
};

const createCloud = async (req, res) => {
    try {
        const cloud = await CloudStorageService.createCloud(req.body); // Жаңа cloud сақтау жасау
        return res.status(201).json(cloud); // Жаңа сақталған мәліметті қайтару
    } catch (err) {
        console.error('Error occurred:', err); // Қате болса, журналға жазу
        return res.status(500).json({ error: err.message }); // 500 қатесімен жауап қайтару
    }
};

const updateCloud = async (req, res) => {
    try {
        const updatedCloud = await CloudStorageService.updateCloud(req.params.id, req.body); // Cloud сақтау жаңарту
        if (updatedCloud[0] === 0) {
            return res.status(404).json({ error: 'Cloud storage not found' }); // Егер жаңартылмаған болса, 404 қатесі
        }
        return res.json({ updated: updatedCloud[0] }); // Жаңартылған мәліметті қайтару
    } catch (err) {
        console.error('Error occurred:', err); // Қате болса, журналға жазу
        return res.status(500).json({ error: err.message }); // 500 қатесімен жауап қайтару
    }
};

const deleteCloud = async (req, res) => {
    try {
        const deletedCount = await CloudStorageService.deleteCloud(req.params.id); // Cloud сақтау жою
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Cloud storage not found' }); // Егер жойылмаса, 404 қатесі
        }
        return res.json({ deleted: deletedCount }); // Жойылған мәліметтер саны
    } catch (err) {
        console.error('Error occurred:', err); // Қате болса, журналға жазу
        return res.status(500).json({ error: err.message }); // 500 қатесімен жауап қайтару
    }
};

export default {
    getAllCloud,
    getCloudById,
    createCloud,
    updateCloud,
    deleteCloud,
};
