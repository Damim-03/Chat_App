import jwt from 'jsonwebtoken'
import { Response } from "express";
import {JWT_SECRET, NODE_ENV} from "../env.js";

const generateToken = (userId: number | string, res: Response) => {
    const token = jwt.sign({userId}, JWT_SECRET!, {
        expiresIn: "15d"
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true,
        sameSite: "strict",
        secure: NODE_ENV !== "development", //HTTPS
    })

    return token;
}

export default generateToken;