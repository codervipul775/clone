// workspaceRoutes.ts — Workspace routes
// All routes are protected (require Bearer token)
// GET    /api/workspaces          → list all
// POST   /api/workspaces          → create
// GET    /api/workspaces/:id      → get one
// PUT    /api/workspaces/:id      → update
// DELETE /api/workspaces/:id      → delete

import { Router } from "express";
import { WorkspaceController } from "../controllers/WorkspaceController";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthService, WorkspaceService } from "../services";

export function createWorkspaceRoutes(
    workspaceService: WorkspaceService,
    authService: AuthService
): Router {
    const router = Router();
    const controller = new WorkspaceController(workspaceService);
    const protect = authMiddleware(authService);

    // All workspace routes require authentication
    router.use(protect);

    router.post("/", controller.create);
    router.get("/", controller.getAll);
    router.get("/:id", controller.getById);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.delete);

    return router;
}
