import express from "express";
import {
    checkEmail, checkEmailForRestorePassword,
    login,
    register,
    restorePassword
} from "../../service/auth/AuthService.js";
import {
    checkEmailExists,
    checkEmailAndUniqueCode,
    checkEmailAndPassword
} from "../../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/email", checkEmailExists, checkEmail);
router.post("/login", checkEmailAndPassword, login);
router.post("/register", checkEmailAndUniqueCode, register);
router.post("/restore-password", checkEmailAndUniqueCode, restorePassword);
router.post("/check-email",checkEmailExists, checkEmailForRestorePassword);

export default router;