import { JwtPayload } from "jsonwebtoken";

// ✅ Interface for decoded JWT payload
export interface DecodedToken extends JwtPayload {
    userId: string;
}

// ✅ Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}
