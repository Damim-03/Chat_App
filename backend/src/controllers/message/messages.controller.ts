import { Response } from "express";
import prisma from "../../db/prisma.js";
import { getReceiverSocketId, io } from "../../socket/socket.js";
import { AuthRequest } from "../../middleware/authMiddleware.js";

// -----------------------------
// ✅ Send a new message
// -----------------------------
export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?.id;

        if (!senderId || !receiverId) {
            return res.status(400).json({ error: "Missing participants" });
        }

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: { hasEvery: [senderId, receiverId] },
            },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: { set: [senderId, receiverId] },
                },
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });

        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { messageIds: { push: newMessage.id } },
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error: any) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// -----------------------------
// ✅ Get messages between 2 users
// -----------------------------
export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user?.id;

        if (!senderId || !userToChatId) {
            return res.status(400).json({ error: "Missing participants" });
        }

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: { hasEvery: [senderId, userToChatId] },
            },
        });

        if (!conversation) {
            return res.status(200).json([]); // No messages yet
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: conversation.id },
            orderBy: { createdAt: "asc" },
        });

        res.status(200).json(messages);
    } catch (error: any) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// -----------------------------
// ✅ Get all users for sidebar
// -----------------------------
export const getUsersForSidebar = async (req: AuthRequest, res: Response) => {
    try {
        const authUserId = req.user?.id;

        if (!authUserId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const users = await prisma.user.findMany({
            where: { id: { not: authUserId } },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });

        res.status(200).json(users);
    } catch (error: any) {
        console.error("Error in getUsersForSidebar:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
