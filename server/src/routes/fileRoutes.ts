// fileRoutes.ts — File & Folder routes
// All routes are protected (require Bearer token)
// POST   /api/files                     → create file/folder
// PUT    /api/files/:id                 → update file
// DELETE /api/files/:id                 → delete file/folder
// GET    /api/files/:id                 → get single file
// GET    /api/files/:id/versions        → version history
// POST   /api/files/:id/restore         → restore version
// Note: getTree is mounted under workspace routes

import { Router } from "express";
import { FileController } from "../controllers/FileController";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthService, FileService } from "../services";

export function createFileRoutes(
    fileService: FileService,
    authService: AuthService
): Router {
    const router = Router();
    const controller = new FileController(fileService);
    const protect = authMiddleware(authService);

    // All file routes require authentication
    router.use(protect);

    router.post("/", controller.create);
    router.get("/:id", controller.getById);
    router.put("/:id", controller.update);
    router.delete("/:id", controller.delete);
    router.get("/:id/versions", controller.getVersions);
    router.post("/:id/restore", controller.restoreVersion);

    return router;
}
