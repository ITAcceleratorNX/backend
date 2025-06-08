import express from "express";
import {
    checkEmail, checkEmailForRestorePassword, login, register, restorePassword
} from "../../service/auth/AuthService.js";
import {validateBody} from "../../middleware/validate.js";
import {LoginDto, RegisterDto, UserEmailDto} from "../../dto/user/User.dto.js";

const router = express.Router();

router.post("/email", validateBody(UserEmailDto), checkEmail);
router.post("/login", validateBody(LoginDto), login);
router.post("/register", validateBody(RegisterDto), register);
router.post("/restore-password", validateBody(RegisterDto), restorePassword);
router.post("/check-email", validateBody(UserEmailDto), checkEmailForRestorePassword);

export default router;