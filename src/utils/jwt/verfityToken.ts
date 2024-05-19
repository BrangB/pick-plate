import { jwtVerify } from "jose";


export const verifyToken = async (tokenE: string, jwtSecretE: string) => {
    try {
        const secret = new TextEncoder().encode(jwtSecretE);
        const { payload } = await jwtVerify(tokenE, secret);
        return payload;
    } catch (error) {
        console.error("Invalid token:", error);
        return null
    }
};