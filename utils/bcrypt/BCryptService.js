import bcrypt from "bcrypt";

export async function getHashedPassword(password) {
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
    let hash =  await bcrypt.hash(password);
    return hashedPassword === hash;
}