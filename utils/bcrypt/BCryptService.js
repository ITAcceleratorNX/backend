import bcrypt from "bcrypt";

export async function getHashedPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    console.log("hash: ", hash);
    return hash;
}

export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
