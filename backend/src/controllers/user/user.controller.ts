import {Response, Request} from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsersForSidebar = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const loggedInUserId = req.user.id;

        const filteredUsers = await prisma.user.findMany({
            where: {
                id: { not: loggedInUserId },
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                gender: true,
                profilePic: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json(filteredUsers);
    } catch (error: any) {
        console.error("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
