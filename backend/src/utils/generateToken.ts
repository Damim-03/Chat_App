import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true, // 👈 prevents JS access (XSS safe)
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};

export default generateToken;
