import express from "express";
import * as UserController from "../../controllers/user/UserController.js";
import { validateBody } from "../../middleware/validate.js";
import {UpdateRoleDto, UpdateUserDto} from "../../dto/user/User.dto.js";
import {authenticateJWT, authorizeAdminOrManager} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", authenticateJWT, authorizeAdminOrManager, UserController.getAllUsers);
router.get("/me", authenticateJWT, UserController.getUserById);
router.put("/me", authenticateJWT, validateBody(UpdateUserDto), UserController.updateUser);
router.delete("/me", authenticateJWT, UserController.deleteUser);
router.get("/manager", authenticateJWT, UserController.getManagers);
router.patch("/{userId}/role", authenticateJWT, authorizeAdminOrManager, validateBody(UpdateRoleDto), UserController.updateUserRole)

export default router;
