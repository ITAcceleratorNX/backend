import bcrypt from "bcrypt";

export async function getHashedPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    console.log("hash: ", hash);
    return hash;
}

export async function comparePassword(password, hashedPassword) {
    console.log(password, hashedPassword);
    console.log(await bcrypt.compare(password, hashedPassword));
    console.log(hashedPassword === await bcrypt.hash(password, 10));
    return await bcrypt.compare(password, hashedPassword);
}