import {User} from "../../models/init/index.js";
import {generateSecureCode, verifyCode} from "../../utils/crypto/UniqueCodeGenerator.js";
import {sendVerificationCode} from "../../utils/sendgird/SendGrid.js";
import {comparePassword, getHashedPassword} from "../../utils/bcrypt/BCryptService.js";
import {generateToken, setTokenCookie} from "../../utils/jwt/JwtService.js";

async function findUserByEmail(email) {
    return await User.findOne({ where: { email } });
}

export async function checkEmail(req, res) {
    const { email } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            let uniqueCode = generateSecureCode(email);
            console.log("Generated unique code: ", uniqueCode, " for email: ", email);
            sendVerificationCode(email, uniqueCode);
            return res.status(200).json({ user_exists: false, email });
        }
        return res.status(200).json({ user_exists: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function checkEmailForRestorePassword(req, res) {
    const { email } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (user) {
            let uniqueCode = generateSecureCode(email);
            console.log("Generated unique code: ", uniqueCode, " for email: ", email);
            sendVerificationCode(email, uniqueCode);
            return res.status(200).json({ user_exists: true, email });
        }
        return res.status(200).json({ user_exists: false, email });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export async function login(req, res) {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ success: false, details: [{message: "Invalid email or password"}] });
    }
    if (!await comparePassword(password, user.password_hash)) {
        return res.status(401).json({ success: false, details: [{message: "Invalid email or password"}] });
    }

    user.last_login = Date.now();
    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(200).json({ success: true });
}

export async function restorePassword(req, res) {
    const { email, unique_code, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ success: false, details: [{message: "Invalid email or password"}] });
    }

    if (!verifyCode(unique_code, email)) {
        return res.status(400).json({ success: false, details: [{ message: "Invalid unique code"}] });
    }

    user.password_hash = await getHashedPassword(password);
    await user.save();

    const token = generateToken(user);
    setTokenCookie(res, token);

    console.log("Password restored for user: ", user.email);
    return res.status(200).json({ success: true });
}

export async function register(req, res) {
    const { email, unique_code, password } = req.body;

    const isUserExists = await findUserByEmail(email);
    if (isUserExists) {
        return res.status(401).json({ success: false, details: [{ message: "Invalid email or password"}] });
    }

    if (!verifyCode(unique_code, email)) {
        return res.status(400).json({ success: false, details: [{ message: "Invalid unique code"}] });
    }

    const user = await User.create({
        email,
        password_hash: await getHashedPassword(password),
        role_code: 1,
        last_login: Date.now()
    });

    const token = generateToken(user);
    setTokenCookie(res, token);

    console.log("Created user: ", user);
    return res.status(201).json({ success: true });
}
