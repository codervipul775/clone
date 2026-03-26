// syncRoutes.ts — Sync routes
// All routes are protected (require Bearer token)
// POST /api/sync/push                  → push local changes
// GET  /api/sync/pull?workspaceId&since → pull cloud changes
// POST /api/sync/resolve               → resolve conflict
// GET  /api/sync/status?workspaceId    → sync status

import { Router } from "express";
import { SyncController } from "../controllers/SyncController";
import { authMiddleware } from "../middleware/authMiddleware";
import { AuthService, SyncService } from "../services";

export function createSyncRoutes(
  syncService: SyncService,
  authService: AuthService
): Router {
  const router = Router();
  const controller = new SyncController(syncService);
  const protect = authMiddleware(authService);

  // All sync routes require authentication
  router.use(protect);

  router.post("/push", controller.pushChanges);
  router.get("/pull", controller.pullChanges);
  router.post("/resolve", controller.resolveConflict);
  router.get("/status", controller.getStatus);

  return router;
}
