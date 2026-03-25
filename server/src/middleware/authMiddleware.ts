// authMiddleware.ts — JWT authentication middleware
// Protects routes by verifying the Bearer token
// Attaches the authenticated user to req.user

import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";
import { User } from "../models";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
    user?: User;
}

export function authMiddleware(authService: AuthService) {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ error: "Access denied. No token provided." });
                return;
            }

            const token = authHeader.split(" ")[1];

            // Verify token and get user
            const user = await authService.verifyToken(token);
            req.user = user;

            next();
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    };
}
