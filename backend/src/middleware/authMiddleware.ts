import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string };
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.token; // 👈 must have cookie-parser middleware

        if (!token) {
            return res.status(401).json({ error: "Unauthorized, no token" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { id: string };

        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
