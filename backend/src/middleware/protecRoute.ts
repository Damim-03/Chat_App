import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {DecodedToken} from "../interface/DecodedToken.js";
import {JWT_SECRET} from "../env.js";

interface JwtPayload {
    id: string;
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw res.status(401).json({ status: "error", error: "Unauthorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as DecodedToken;
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        throw res.status(401).json({ status: "error", error: "Invalid token" });
    }
};
