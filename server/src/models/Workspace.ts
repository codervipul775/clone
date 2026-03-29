// Workspace.ts — Workspace model class
// A container for files and folders (like a project)
// Inherits from BaseEntity
// Demonstrates: Inheritance, Encapsulation, Composition

import { BaseEntity } from "./BaseEntity";

export class Workspace extends BaseEntity {
    private _name: string;
    private _ownerId: string;

    constructor(
        id: string,
        name: string,
        ownerId: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt);
        this._name = name;
        this._ownerId = ownerId;
    }

    // ===== GETTERS =====

    get name(): string {
        return this._name;
    }

    get ownerId(): string {
        return this._ownerId;
    }

    // ===== SETTERS =====

    set name(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error("Workspace name cannot be empty");
        }
        if (value.trim().length > 100) {
            throw new Error("Workspace name cannot exceed 100 characters");
        }
        this._name = value.trim();
        this.touch();
    }

    // ===== VALIDATION =====

    /**
     * Validates workspace data integrity.
     * Implements abstract method from BaseEntity.
     */
    validate(): void {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error("Workspace name is required");
        }
        if (this._name.trim().length > 100) {
            throw new Error("Workspace name cannot exceed 100 characters");
        }
        if (!this._ownerId || this._ownerId.length === 0) {
            throw new Error("Workspace must have an owner");
        }
    }

    // ===== STATIC METHODS =====

    /**
     * Factory method — creates a Workspace instance from a Prisma database record.
     */
    static fromPrisma(data: {
        id: string;
        name: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }): Workspace {
        return new Workspace(
            data.id,
            data.name,
            data.ownerId,
            data.createdAt,
            data.updatedAt
        );
    }

    // ===== SERIALIZATION =====

    /**
     * Converts to JSON.
     * Overrides BaseEntity.toJSON().
     */
    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            name: this._name,
            ownerId: this._ownerId,
        };
    }
}
