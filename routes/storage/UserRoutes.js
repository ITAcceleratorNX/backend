// routes/UserRoutes.js
import express from "express";
import * as UserController from "../../controllers/user/UserController.js";
import { validateBody } from "../../middleware/validate.js";
import { UserDto, UpdateUserDto } from "../../dto/storage/User.dto.js";

const router = express.Router();

router.post("/", validateBody(UserDto), UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", validateBody(UpdateUserDto), UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
