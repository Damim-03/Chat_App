import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { DecodedToken } from "../interface/DecodedToken.js";
import prisma from "../db/prisma.js";

const protecRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.jwt ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return; // ⬅️ stop here
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, fullname: true, profilePic: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // @ts-ignore - extend Request type to include user
    req.user = user;

    next();
  } catch (error) {
    console.error("Error while verifying user:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default protecRoute;
