// User.ts — User model class
// Inherits from BaseEntity
// Demonstrates: Inheritance, Encapsulation, Single Responsibility

import { BaseEntity } from "./BaseEntity";

export class User extends BaseEntity {
    private _email: string;
    private _name: string;
    private _passwordHash: string;

    constructor(
        id: string,
        email: string,
        name: string,
        passwordHash: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        super(id, createdAt, updatedAt);
        this._email = email;
        this._name = name;
        this._passwordHash = passwordHash;
    }

    // ===== GETTERS (Encapsulation) =====

    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    // ===== SETTERS =====

    set name(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error("User name cannot be empty");
        }
        this._name = value.trim();
        this.touch();
    }

    set email(value: string) {
        if (!User.isValidEmail(value)) {
            throw new Error("Invalid email format");
        }
        this._email = value.toLowerCase().trim();
        this.touch();
    }

    // ===== VALIDATION =====

    /**
     * Validates user data integrity.
     * Implements abstract method from BaseEntity.
     */
    validate(): void {
        if (!this._email || !User.isValidEmail(this._email)) {
            throw new Error("Invalid email format");
        }
        if (!this._name || this._name.trim().length === 0) {
            throw new Error("User name is required");
        }
        if (!this._passwordHash || this._passwordHash.length === 0) {
            throw new Error("Password hash is required");
        }
    }

    // ===== STATIC METHODS =====

    /**
     * Email format validation using regex.
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Factory method — creates a User instance from a Prisma database record.
     * Demonstrates the Factory Pattern.
     */
    static fromPrisma(data: {
        id: string;
        email: string;
        name: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }): User {
        return new User(
            data.id,
            data.email,
            data.name,
            data.passwordHash,
            data.createdAt,
            data.updatedAt
        );
    }

    // ===== SERIALIZATION =====

    /**
     * Converts to JSON — EXCLUDES passwordHash for security.
     * Overrides BaseEntity.toJSON().
     */
    toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            email: this._email,
            name: this._name,
            // passwordHash is intentionally excluded
        };
    }
}
