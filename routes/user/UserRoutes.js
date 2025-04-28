// routes/UserRoutes.js
import express from "express";
import * as UserController from "../../controllers/user/UserController.js";
import { validateBody } from "../../middleware/validate.js";
import { UpdateUserDto } from "../../dto/user/User.dto.js";
import {authenticateJWT, authorizeAdmin} from "../../middleware/jwt.js";

const router = express.Router();

router.get("/", authenticateJWT, authorizeAdmin, UserController.getAllUsers);
router.get("/:id", authenticateJWT, UserController.getUserById);
router.put("/:id", authenticateJWT, validateBody(UpdateUserDto), UserController.updateUser);
router.delete("/:id", authenticateJWT, authorizeAdmin, UserController.deleteUser);

export default router;
