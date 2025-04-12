import User from "../../models/User.js";
import {generateSecureCode, verifyCode} from "../../utils/crypto/UniqueCodeGenerator.js";
import {sendVerificationCode} from "../../utils/sendgird/SendGrid.js";
import validator from "validator";
import {comparePassword, getHashedPassword} from "../../utils/bcrypt/BCryptService.js";
import {generateToken} from "../../utils/jwt/JwtService.js";

export async function checkEmail(req, res) {
    const { email } = req.body;
    User.findOne({ email: email })
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
    if (!validator.isEmail(email)) {
        return res.status(400)
            .json({success: false, message: "Invalid email"});
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400)
        .json({success: false, message: "User not found"});
    }
    if (!comparePassword(password, user.password_hash)) {
        return res.status(400)
        .json({success: false, message: "Invalid password"});
    }
    user.last_login = Date.now();
    const token = generateToken(user);
    return res.status(200)
    .json({success: true, token: token});
}

export async function register(req, res) {
    let message = {};
    const { email, unique_code, password } = req.body;
    const isUserExists = await User.findOne({ email: email });
    if (isUserExists) {
        return res.status(400)
            .json({success: false, message: "User already exists"});
    }

    if (password.length < 6) {
        message.password_error = "Password must be at least 6 characters";
    }
    if (!validator.isEmail(email)) {
        message.email_error = "Invalid email address";
    }
    if (!verifyCode(unique_code, email)) {
        message.unique_code_error = "Invalid unique code";
    }
    if (Object.keys(message).length !== 0) {
        console.log(message);
        return res.status(400)
            .json({success: false, message});
    }
    const user = await User.create({
        email,
        password_hash: await getHashedPassword(password),
        role_code: 1,
        last_login: Date.now()
    });
    const token = generateToken(user);
    console.log("Created user: ", user);
    return res.status(201)
    .json({success: true, token});
}