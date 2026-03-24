// SyncController.ts — Sync route handlers
// Push/pull sync, conflict resolution, sync status
// Demonstrates: Dependency Injection, Separation of Concerns

import { Response } from "express";
import { SyncService } from "../services";
import { AuthRequest } from "../middleware/authMiddleware";

export class SyncController {
  private syncService: SyncService;

  constructor(syncService: SyncService) {
    this.syncService = syncService;
  }

  /**
   * POST /api/sync/push
   * Body: { changes: [{ fileId, content, updatedAt }] }
   * Pushes local changes to the cloud
   */
  pushChanges = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const { changes } = req.body;
      if (!changes || !Array.isArray(changes)) {
        res.status(400).json({ error: "changes array is required" });
        return;
      }

      const result = await this.syncService.pushChanges(req.user.id, changes);

      res.status(200).json({
        message: "Sync push complete",
        result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync push failed";
      res.status(500).json({ error: message });
    }
  };

  /**
   * GET /api/sync/pull?workspaceId=xxx&since=ISO_DATE
   * Pulls cloud changes since a given timestamp
   */
  pullChanges = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { workspaceId, since } = req.query;

      if (!workspaceId || typeof workspaceId !== "string") {
        res.status(400).json({ error: "workspaceId query param is required" });
        return;
      }

      const sinceDate = since ? new Date(since as string) : new Date(0);
      const files = await this.syncService.pullChanges(workspaceId, sinceDate);

      res.status(200).json({
        files: files.map((f) => f.toJSON()),
        pulledAt: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Sync pull failed" });
    }
  };

  /**
   * POST /api/sync/resolve
   * Body: { fileId, resolution: "local" | "cloud", localContent? }
   * Resolves a sync conflict
   */
  resolveConflict = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { fileId, resolution, localContent } = req.body;

      if (!fileId || !resolution) {
        res.status(400).json({ error: "fileId and resolution are required" });
        return;
      }

      if (!["local", "cloud"].includes(resolution)) {
        res.status(400).json({ error: 'resolution must be "local" or "cloud"' });
        return;
      }

      const file = await this.syncService.resolveConflict(fileId, resolution, localContent);

      res.status(200).json({
        message: "Conflict resolved",
        file: file.toJSON(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to resolve conflict";
      res.status(400).json({ error: message });
    }
  };

  /**
   * GET /api/sync/status?workspaceId=xxx
   * Returns sync status for a workspace
   */
  getStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { workspaceId } = req.query;

      if (!workspaceId || typeof workspaceId !== "string") {
        res.status(400).json({ error: "workspaceId query param is required" });
        return;
      }

      const status = await this.syncService.getStatus(workspaceId);

      res.status(200).json({ status });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sync status" });
    }
  };
}
