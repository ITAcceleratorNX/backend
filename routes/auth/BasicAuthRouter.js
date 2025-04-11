import express from "express";
import {checkEmail, login, register} from "../../service/auth/AuthService.js";
import {checkEmailExists, checkEmailAndUniqueCode, checkEmailAndPassword} from "../../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/email", checkEmailExists, checkEmail);
router.post("/login", checkEmailAndPassword, login);
router.post("/register", checkEmailAndUniqueCode, register);

export default router;