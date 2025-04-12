import bcrypt from "bcrypt";

export async function getHashedPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    console.log("hash: ", hash);
    return hash;
}

export async function comparePassword(password, hashedPassword) {
    let hash =  await bcrypt.hash(password, 10);
    return hashedPassword === hash;
}