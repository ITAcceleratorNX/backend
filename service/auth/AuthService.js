import User from "../../models/User.js";
import {generateSecureCode} from "../../utils/crypto/UniqueCodeGenerator.js";
import {sendVerificationCode} from "../../utils/sendgird/SendGrid.js";
import validator from "validator";
import {comparePassword, getHashedPassword} from "../../utils/bcrypt/BCryptService.js";
// import {comparePassword, getHashedPassword} from "../../utils/bcrypt/BCryptService.js";
import CloudStorage from "../../models/CloudStorage.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../middleware/jwt.js";


export async function checkEmail(req, res) {
    const { email } = req.body;
    User.findOne({
        where: { email: email }
    })
        .then(user => {
            if (!user) {
                let uniqueCode = generateSecureCode(email);
                console.log("Generated unique code: ", uniqueCode, " for email: ", email);
                sendVerificationCode(email, uniqueCode);
                return res.status(200)
                    .json({user_exists: false, email: email});
            } else {
                return res.status(200).json({user_exists: true});
            }
        }).catch(err => {
        console.error(err);
        return res.status(500)
            .json({success: false, message: "Internal Server Error"});
    });
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await comparePassword(password, user.password_hash))) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ success: true, accessToken });
}

export async function refreshTokenHandler(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const newAccessToken = generateAccessToken(user);
        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}




export async function register(req, res) {
    let message = {};
    const { email, unique_code, password, name, phone, role_code } = req.body;

    const isUserExists = await User.findOne({ where: { email } });
    if (isUserExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (password.length < 6) {
        message.password_error = "Password must be at least 6 characters";
    }
    if (!validator.isEmail(email)) {
        message.email_error = "Invalid email address";
    }

    const cloudStorage = await CloudStorage.findOne({ where: { custom_id: unique_code } });
    if (!cloudStorage) {
        message.unique_code_error = "Invalid unique code";
    }

    if (Object.keys(message).length !== 0) {
        return res.status(400).json({ success: false, message });
    }

    const user = await User.create({
        name,
        email,
        phone,
        password_hash: await getHashedPassword(password),
        role_code: role_code || 1,
        last_login: new Date()
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({ success: true, accessToken });
}
