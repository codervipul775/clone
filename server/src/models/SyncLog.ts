// SyncLog.ts — Sync audit trail model
// Tracks every sync event (push, pull, conflict resolution)
// Inherits from BaseEntity
// Demonstrates: Inheritance, Encapsulation, State Pattern

import { BaseEntity } from "./BaseEntity";

// ===== ENUMS =====

export enum SyncAction {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    RESOLVE_CONFLICT = "RESOLVE_CONFLICT",
}

export enum SyncLogStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    PENDING = "PENDING",
}

// ===== SYNC LOG CLASS =====

export class SyncLog extends BaseEntity {
    private _fileId: string;
    private _action: SyncAction;
    private _status: SyncLogStatus;
    private _details: string | null;
    private _timestamp: Date;

    constructor(
        id: string,
        fileId: string,
        action: SyncAction,
        status: SyncLogStatus = SyncLogStatus.PENDING,
        details: string | null = null,
        timestamp?: Date,
        createdAt?: Date
    ) {
        super(id, createdAt, createdAt);
        this._fileId = fileId;
        this._action = action;
        this._status = status;
        this._details = details;
        this._timestamp = timestamp || new Date();
    }

    // ===== GETTERS =====

    get fileId(): string {
        return this._fileId;
    }

    get action(): SyncAction {
        return this._action;
    }

    get status(): SyncLogStatus {
        return this._status;
    }

    get details(): string | null {
        return this._details;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    // ===== STATE TRANSITIONS (State Pattern) =====

    /**
     * Marks this sync log entry as successful.
     * Transition: PENDING → SUCCESS
     */
    markSuccess(): void {
        if (this._status !== SyncLogStatus.PENDING) {
            throw new Error(`Cannot mark as success: current status is "${this._status}"`);
        }
        this._status = SyncLogStatus.SUCCESS;
        this.touch();
    }

    /**
     * Marks this sync log entry as failed with an error message.
     * Transition: PENDING → FAILED
     */
    markFailed(errorMessage: string): void {
        if (this._status !== SyncLogStatus.PENDING) {
            throw new Error(`Cannot mark as failed: current status is "${this._status}"`);
        }
        this._status = SyncLogStatus.FAILED;
        this._details = errorMessage;
        this.touch();
    }

    // ===== UTILITY =====

    /**
     * Checks if this log entry represents a failed sync.
     */
    isFailed(): boolean {
        return this._status === SyncLogStatus.FAILED;
    }

    /**
     * Checks if this log entry is still pending.
     */
    isPending(): boolean {
        return this._status === SyncLogStatus.PENDING;
    }

    /**
     * Returns a human-readable summary of this sync event.
     */
    getSummary(): string {
        const actionLabel = this._action.toLowerCase().replace("_", " ");
        return `[${this._status}] ${actionLabel} at ${this._timestamp.toISOString()}`;
    }

    // ===== VALIDATION =====

    validate(): void {
        if (!this._fileId || this._fileId.length === 0) {
            throw new Error("SyncLog must reference a file");
        }
        if (!Object.values(SyncAction).includes(this._action)) {
            throw new Error(`Invalid sync action: ${this._action}`);
        }
        if (!Object.values(SyncLogStatus).includes(this._status)) {
            throw new Error(`Invalid sync status: ${this._status}`);
        }
    }

    // ===== FACTORY METHOD =====

    static fromPrisma(data: {
        id: string;
        fileId: string;
        action: string;
        status: string;
        details: string | null;
        timestamp: Date;
    }): SyncLog {
        return new SyncLog(
            data.id,
            data.fileId,
            data.action as SyncAction,
            data.status as SyncLogStatus,
            data.details,
            data.timestamp
        );
    }

    // ===== SERIALIZATION =====

    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            fileId: this._fileId,
            action: this._action,
            status: this._status,
            details: this._details,
            timestamp: this._timestamp.toISOString(),
            summary: this.getSummary(),
        };
    }
}
