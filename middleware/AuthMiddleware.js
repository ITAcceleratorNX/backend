const isEmpty = (value) => {
    return typeof value !== 'string' || value.trim().length === 0;
};

export const checkEmailExists = (req, res, next) => {
    const { email } = req.body;
    if (isEmpty(email)) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    next();
};

export const checkEmailAndUniqueCode = (req, res, next) => {
    const { email, unique_code, password } = req.body;
    console.log("💡 req.body:", req.body);
    console.log("💡 unique_code:", unique_code);
    console.log("💡 req.body.unique_code:", req.body?.unique_code);

    const message = {};

    if (isEmpty(email)) {
        message.email_error = "Email is required";
    }
    if (isEmpty(unique_code)) {
        message.unique_code_error = "Unique code is required";
    }
    if (isEmpty(password)) {
        message.password_error = "Password is required";
    }

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ success: false, message });
    }

    next();
};

export const checkEmailAndPassword = (req, res, next) => {
    const { email, password } = req.body;
    const message = {};

    if (isEmpty(email)) {
        message.email_error = "Email is required";
    }
    if (isEmpty(password)) {
        message.password_error = "Password is required";
    }

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ success: false, message });
    }

    next();
};