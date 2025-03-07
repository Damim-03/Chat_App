import {Request, Response} from "express";
import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
//import generateToken from "../utils/generateToken.js";

export const login = (_req:Request, res:Response) => {
    res.send("Logged in Successfully")
}

export const logout = (_req:Request, res:Response) => {
    res.send("Logged out Successfully")
}

export const signup = async (req:Request, res:Response) => {
    try {
        const { fullname: fullname, username, email, password, confirmPassword, gender } = req.body

        if(!fullname || !username || !email || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill out the required fields" })
        }

        if(password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" })
        }

        const user = await prisma.user.findUnique({
            where: { username }
        })

        if(user) {
            return res.status(400).json({ error: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await prisma.user.create({
            data: {
                fullname,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic
            }
        })

        if(newUser) {
            // Generate token in a sec
            //generateToken(newUser.id, res)

            res.status(201).json({
                id: newUser.id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }
    } catch (error:any) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}