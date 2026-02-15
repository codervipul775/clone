// BaseEntity.ts — Abstract base class for all models
// All model classes (User, Workspace, FileNode, etc.) inherit from this
// Demonstrates: Abstraction, Encapsulation, Inheritance

export abstract class BaseEntity {
    protected _id: string;
    protected _createdAt: Date;
    protected _updatedAt: Date;

    constructor(id: string, createdAt?: Date, updatedAt?: Date) {
        this._id = id;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();
    }

    // ===== GETTERS (Encapsulation) =====

    get id(): string {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    // ===== METHODS =====

    /**
     * Updates the updatedAt timestamp to current time.
     * Called internally whenever an entity is modified.
     */
    protected touch(): void {
        this._updatedAt = new Date();
    }

    /**
     * Abstract method — each subclass must implement its own validation.
     * Called before saving to ensure data integrity.
     */
    abstract validate(): void;

    /**
     * Converts the entity to a plain JSON object.
     * Subclasses should override and call super.toJSON() to include base fields.
     */
    toJSON(): Record<string, unknown> {
        return {
            id: this._id,
            createdAt: this._createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString(),
        };
    }
}
