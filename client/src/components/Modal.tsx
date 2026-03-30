// Modal.tsx — Reusable modal component
// Used for: creating workspaces, creating files/folders, confirmations

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// ===== PROPS =====

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

// ===== MODAL COMPONENT =====

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal" ref={modalRef}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-4)",
          }}
        >
          <h3 className="modal-title" style={{ margin: 0 }}>
            {title}
          </h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content (passed as children) */}
        {children}
      </div>
    </div>
  );
}

// ===== CREATE FILE MODAL =====

interface CreateFileModalProps {
  isOpen: boolean;
  isFolder: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function CreateFileModal({
  isOpen,
  isFolder,
  onClose,
  onSubmit,
}: CreateFileModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (name) {
      onSubmit(name);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={isFolder ? "New Folder" : "New File"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "block",
            fontSize: "var(--font-size-sm)",
            color: "var(--text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          {isFolder ? "Folder name" : "File name (e.g. notes.md, app.tsx)"}
        </label>
        <input
          ref={inputRef}
          className="input"
          type="text"
          placeholder={isFolder ? "My Folder" : "untitled.txt"}
          autoFocus
        />
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ===== CREATE WORKSPACE MODAL =====

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateWorkspaceModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputRef.current?.value.trim();
    if (name) {
      onSubmit(name);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Modal isOpen={isOpen} title="New Workspace" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "block",
            fontSize: "var(--font-size-sm)",
            color: "var(--text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          Workspace name
        </label>
        <input
          ref={inputRef}
          className="input"
          type="text"
          placeholder="e.g. Travel Notes, Code Projects"
          autoFocus
        />
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
