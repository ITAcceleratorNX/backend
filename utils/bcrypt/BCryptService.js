import bcrypt from "bcrypt";

export async function getHashedPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    console.log("hash: ", hash);
    return hash;
}

export function comparePassword(password, hashedPassword) {
    console.log(password, hashedPassword);
    return bcrypt.compare(password, hashedPassword);
}