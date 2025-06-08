import * as UserService from "../../service/user/UserService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import {createBaseController} from "../base/BaseController.js";

const base = createBaseController(UserService);

export const createUser = base.create;
export const getAllUsers = base.getAll;

export const getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
    const [updated] = await UserService.update(req.user.id, req.body);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ updated });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const deleted = await UserService.deleteById(req.user.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ deleted });
});
