// controllers/UserController.js
import * as UserService from "../../service/user/UserService.js";

export const createUser = async (req, res) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const [updated] = await UserService.updateUser(req.user.id, req.body);
        if (!updated) return res.status(404).json({ message: "User not found" });
        res.json({ updated });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deleted = await UserService.deleteUser(req.user.id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ deleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
