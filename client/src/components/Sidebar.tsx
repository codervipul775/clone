// Sidebar.tsx — Left sidebar with logo, workspace selector, file tree, sync status

import { useState } from "react";
import {
  FolderPlus,
  FilePlus,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  File,
  CheckSquare,
  Plus,
  Layers,
} from "lucide-react";
import { FileType, SyncStatus } from "../types";
import type { FileTreeNode, Workspace } from "../types";

// ===== PROPS =====

interface SidebarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  fileTree: FileTreeNode[];
  activeFileId: string | null;
  isOnline: boolean;
  pendingChanges: number;
  sidebarOpen: boolean;
  onSelectWorkspace: (ws: Workspace) => void;
  onCreateWorkspace: () => void;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (parentId: string | null, type: FileType) => void;
  onToggleFolder: (folderId: string) => void;
}

// ===== FILE ICON HELPER =====

function getFileIcon(type: FileType, _language: string | null) {
  switch (type) {
    case FileType.FOLDER:
      return Folder;
    case FileType.MARKDOWN:
      return FileText;
    case FileType.CODE:
      return FileCode;
    case FileType.TODO:
      return CheckSquare;
    default:
      return File;
  }
}

// ===== SYNC STATUS DOT COLOR =====

function getSyncColor(status: string): string {
  switch (status) {
    case SyncStatus.SYNCED:
      return "var(--sync-synced)";
    case SyncStatus.PENDING:
      return "var(--sync-pending)";
    case SyncStatus.CONFLICT:
      return "var(--sync-conflict)";
    case SyncStatus.LOCAL_ONLY:
      return "var(--sync-local)";
    default:
      return "var(--sync-offline)";
  }
}

// ===== TREE ITEM COMPONENT =====

function TreeItem({
  node,
  depth,
  activeFileId,
  onSelect,
  onToggle,
  onCreateFile,
}: {
  node: FileTreeNode;
  depth: number;
  activeFileId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onCreateFile: (parentId: string | null, type: FileType) => void;
}) {
  const isFolder = node.type === FileType.FOLDER;
  const isActive = node.id === activeFileId;
  const Icon = isFolder && node.isExpanded ? FolderOpen : getFileIcon(node.type, node.language);

  return (
    <div>
      <div
        className={`tree-item ${isActive ? "active" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) {
            onToggle(node.id);
          } else {
            onSelect(node.id);
          }
        }}
      >
        {isFolder ? (
          <span style={{ width: 16, display: "flex", alignItems: "center" }}>
            {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        ) : (
          <span style={{ width: 16 }} />
        )}

        <Icon
          size={16}
          className="tree-item-icon"
          style={{
            color: isFolder
              ? "var(--warning)"
              : node.type === FileType.CODE
              ? "var(--accent-primary)"
              : node.type === FileType.MARKDOWN
              ? "var(--info)"
              : "var(--text-muted)",
          }}
        />

        <span className="tree-item-name">{node.name}</span>

        {node.syncStatus !== SyncStatus.SYNCED && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: getSyncColor(node.syncStatus),
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {isFolder && node.isExpanded && node.children.length > 0 && (
        <div className="tree-item-children">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              activeFileId={activeFileId}
              onSelect={onSelect}
              onToggle={onToggle}
              onCreateFile={onCreateFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== SIDEBAR COMPONENT =====

export default function Sidebar({
  workspaces,
  activeWorkspace,
  fileTree,
  activeFileId,
  isOnline,
  pendingChanges,
  sidebarOpen,
  onSelectWorkspace,
  onCreateWorkspace,
  onSelectFile,
  onCreateFile,
  onToggleFolder,
}: SidebarProps) {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* HEADER / LOGO */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Layers size={16} />
          </div>
          <span>SafarSetu</span>
          <span style={{ color: "var(--accent-primary)", fontWeight: 400, fontSize: "var(--font-size-sm)" }}>
            Pro
          </span>
        </div>
      </div>

      {/* WORKSPACE SELECTOR */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Workspace</div>
        <div style={{ position: "relative" }}>
          <button
            className="btn btn-ghost"
            style={{
              width: "100%",
              justifyContent: "space-between",
              padding: "var(--space-2) var(--space-3)",
              fontSize: "var(--font-size-sm)",
            }}
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {activeWorkspace?.name || "Select workspace"}
            </span>
            <ChevronDown size={14} />
          </button>

          {showWorkspaceDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--bg-elevated)",
                border: "1px solid var(--surface-border)",
                borderRadius: "var(--radius-md)",
                marginTop: 4,
                zIndex: 50,
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
              }}
            >
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="tree-item"
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    background: ws.id === activeWorkspace?.id ? "var(--accent-muted)" : "transparent",
                    color: ws.id === activeWorkspace?.id ? "var(--accent-hover)" : "var(--text-secondary)",
                  }}
                  onClick={() => {
                    onSelectWorkspace(ws);
                    setShowWorkspaceDropdown(false);
                  }}
                >
                  <Layers size={14} />
                  <span>{ws.name}</span>
                </div>
              ))}
              <div
                className="tree-item"
                style={{ padding: "var(--space-2) var(--space-3)", color: "var(--accent-primary)" }}
                onClick={() => {
                  onCreateWorkspace();
                  setShowWorkspaceDropdown(false);
                }}
              >
                <Plus size={14} />
                <span>New workspace</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW FILE / FOLDER BUTTONS */}
      {activeWorkspace && (
        <div style={{ display: "flex", gap: "var(--space-1)", padding: "0 var(--space-3) var(--space-2)" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onCreateFile(null, FileType.FOLDER)} title="New folder">
            <FolderPlus size={14} />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onCreateFile(null, FileType.TEXT)} title="New file">
            <FilePlus size={14} />
          </button>
        </div>
      )}

      {/* FILE TREE */}
      <div className="sidebar-tree">
        {fileTree.length > 0 ? (
          fileTree.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              depth={0}
              activeFileId={activeFileId}
              onSelect={onSelectFile}
              onToggle={onToggleFolder}
              onCreateFile={onCreateFile}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
            {activeWorkspace ? "No files yet. Create one!" : "Select or create a workspace"}
          </div>
        )}
      </div>

      {/* FOOTER / SYNC STATUS */}
      <div className="sidebar-footer">
        <div className="sync-indicator">
          <span className={`sync-dot ${isOnline ? "online" : "offline"}`} />
          <span>{isOnline ? "Online" : "Offline"}</span>
          {pendingChanges > 0 && (
            <span className="badge badge-pending" style={{ marginLeft: "auto" }}>
              {pendingChanges} pending
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
