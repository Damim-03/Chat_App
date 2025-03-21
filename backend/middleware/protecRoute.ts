import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import {DecodedToken} from "../interface/DecodedToken.js";
import prisma from "../db/prisma";

const protecRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }


        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullname: true, profilePic: true },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Error while verifying user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protecRoute;