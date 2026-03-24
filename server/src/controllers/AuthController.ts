// AuthController.ts — Authentication route handlers
// Handles register, login, and profile endpoints
// Demonstrates: Dependency Injection, Separation of Concerns

import { Request, Response } from "express";
import { AuthService } from "../services";
import { AuthRequest } from "../middleware/authMiddleware";

export class AuthController {
    private authService: AuthService;

    // Dependency Injection
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/register
     * Body: { name, email, password }
     */
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.register({ name, email, password });

            res.status(201).json({
                message: "Registration successful",
                token: result.token,
                user: result.user.toJSON(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Registration failed";
            res.status(400).json({ error: message });
        }
    };

    /**
     * POST /api/auth/login
     * Body: { email, password }
     */
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login({ email, password });

            res.status(200).json({
                message: "Login successful",
                token: result.token,
                user: result.user.toJSON(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Login failed";
            res.status(401).json({ error: message });
        }
    };

    /**
     * GET /api/auth/profile
     * Requires: Bearer token
     * Returns the authenticated user's profile
     */
    getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }

            res.status(200).json({
                user: req.user.toJSON(),
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch profile" });
        }
    };
}
