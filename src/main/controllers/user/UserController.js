import logger from "../../utils/winston/logger.js";
import * as UserService from "../../service/user/UserService.js";
import {asyncHandler} from "../../utils/handler/asyncHandler.js";
import {createBaseController} from "../base/BaseController.js";

const base = createBaseController(UserService);

export const createUser = base.create;
export const getAllUsers = base.getAll;

export const getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getById(req.user.id);
    logger.info('Fetched user by ID', {
      userId: req.user?.id || null,
      endpoint: req.originalUrl,
      requestId: req.id
    });
    res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
    const [updated] = await UserService.update(req.user.id, req.body);
    logger.info('Updated user', {
      userId: req.user?.id || null,
      endpoint: req.originalUrl,
      requestId: req.id,
      updates: req.body
    });
    res.json({ updated });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const deleted = await UserService.deleteById(req.user.id);
    logger.info('Deleted user', {
      userId: req.user?.id || null,
      endpoint: req.originalUrl,
      requestId: req.id
    });
    res.json({ deleted });
});

export const getManagers = asyncHandler(async (req, res) => {
    const response = await UserService.getManagers();
    res.json(response);
})
