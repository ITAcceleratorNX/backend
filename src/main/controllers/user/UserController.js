import * as UserService from "../../service/user/UserService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";

export const createUser = asyncHandler(async (req, res) => {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
    const [updated] = await UserService.updateUser(req.user.id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ updated });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const deleted = await UserService.deleteUser(req.user.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ deleted });
});
