import { Request, Response } from "express";
import prisma from "../../db/prisma.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";
import { NODE_ENV } from "../../env.js";

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ status: "error", error: "All fields are required" });
            return;
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(400).json({ status: "error", error: "Invalid username or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ status: "error", error: "Invalid username or password" });
            return;
        }

        // ✅ set JWT cookie
        generateToken(user.id, res);

        res.status(200).json({
            status: "success",
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                gender: user.gender,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ status: "error", error: "Internal server error" });
    }
};

/**
 * @desc Signup user
 * @route POST /api/auth/signup
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            res.status(400).json({ status: "error", error: "All fields are required" });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ status: "error", error: "Passwords do not match" });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            res.status(400).json({ status: "error", error: "Username already taken" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profilePic =
            gender === "male"
                ? `https://avatar.iran.liara.run/public/boy?username=${username}`
                : `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const user = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic,
            },
        });

        // ✅ set JWT cookie
        generateToken(user.id, res);

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                gender: user.gender,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ status: "error", error: "Internal server error" });
    }
};

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 */
export const logout = (req: Request, res: Response): void => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "lax",
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            status: "error",
            error: "Internal server error during logout",
        });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user?.id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error: any) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};