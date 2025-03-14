import { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { id: reciverId } = req.params;
        const senderId = req.user?.id; // Ensure req.user exists

        if (!senderId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Find an existing conversation
        let conversation = await prisma.conversations.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, reciverId]
                }
            }
        });

        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await prisma.conversations.create({
                data: {
                    participantIds: [senderId, reciverId]
                }
            });
        }

        // Create new message
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        });

        // Respond with the new message
        res.status(201).json({ message: "Message sent", data: newMessage });

    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user?.id; // Ensure req.user exists

        if (!senderId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Find conversation between sender & receiver
        const conversation = await prisma.conversations.findFirst({
            where: {
                AND: [
                    { participantIds: { hasEvery: [senderId, userToChatId] } }
                ]
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(200).json([]); // Return empty array if no conversation
        }

        return res.status(200).json(conversation.messages);

    } catch (error) {
        console.log("Error in getMessages:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUsersSidebar = async (req: Request, res: Response) => {
    try {
        const authUserId = req.user.id; // Ensure req.user exists

        if (!authUserId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Fetch all users except the authenticated user
        const users = await prisma.user.findMany({
            where: {
                id: { not: authUserId }
            },
            select: {
                id: true,
                fullname: true,
                profilePic: true,
            }
        });

        return res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsersSidebar:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


