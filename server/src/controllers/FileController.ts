// FileController.ts — File & Folder route handlers
// CRUD, tree, versioning, and version restore
// Demonstrates: Dependency Injection, Separation of Concerns

import { Response } from "express";
import { FileService } from "../services";
import { FileType } from "../models";
import { AuthRequest } from "../middleware/authMiddleware";

export class FileController {
    private fileService: FileService;

    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

    /**
     * POST /api/files
     * Body: { name, type, workspaceId, parentId?, content?, language? }
     */
    create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { name, type, workspaceId, parentId, content, language } = req.body;

            // Validate file type
            if (!Object.values(FileType).includes(type)) {
                res.status(400).json({ error: `Invalid file type. Must be one of: ${Object.values(FileType).join(", ")}` });
                return;
            }

            const file = await this.fileService.create({
                name,
                type,
                workspaceId,
                parentId: parentId || null,
                content,
                language: language || null,
            });

            res.status(201).json({
                message: "File created",
                file: file.toJSON(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create file";
            res.status(400).json({ error: message });
        }
    };

    /**
     * PUT /api/files/:id
     * Body: { name?, content?, syncStatus? }
     */
    update = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { name, content, syncStatus } = req.body;
            const file = await this.fileService.update(req.params.id as string, {
                name,
                content,
                syncStatus,
            });

            res.status(200).json({
                message: "File updated",
                file: file.toJSON(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update file";
            res.status(400).json({ error: message });
        }
    };

    /**
     * DELETE /api/files/:id
     * Recursively deletes folders and their children
     */
    delete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            await this.fileService.delete(req.params.id as string);

            res.status(200).json({
                message: "File deleted",
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete file";
            res.status(400).json({ error: message });
        }
    };

    /**
     * GET /api/files/:id
     * Returns a single file by ID
     */
    getById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const file = await this.fileService.findById(req.params.id as string);

            res.status(200).json({
                file: file.toJSON(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "File not found";
            res.status(404).json({ error: message });
        }
    };

    /**
     * GET /api/workspaces/:workspaceId/files
     * Returns the full file tree for a workspace
     */
    getTree = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const tree = await this.fileService.getTree(req.params.workspaceId as string);

            res.status(200).json({
                files: tree.map((node) => node.toJSON()),
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch file tree" });
        }
    };

    /**
     * GET /api/files/:id/versions
     * Returns version history for a file
     */
    getVersions = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const versions = await this.fileService.getVersions(req.params.id as string);

            res.status(200).json({
                versions: versions.map((v) => v.toJSON()),
            });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch versions" });
        }
    };

    /**
     * POST /api/files/:id/restore
     * Body: { versionId }
     * Restores a file to a previous version
     */
    restoreVersion = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { versionId } = req.body;
            if (!versionId) {
                res.status(400).json({ error: "versionId is required" });
                return;
            }

            const file = await this.fileService.restoreVersion(req.params.id as string, versionId);

            res.status(200).json({
                message: "Version restored",
                file: file.toJSON(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to restore version";
            res.status(400).json({ error: message });
        }
    };
}
