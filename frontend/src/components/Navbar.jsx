import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { CheckSquare, LogOut, FolderKanban, Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onOpenCreateTask, onOpenAddMember, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { activeProject } = useProjects();

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-ghost"
          onClick={onToggleSidebar}
          style={{ padding: '6px', borderRadius: '6px' }}
          title="Toggle Navigation"
          aria-label="Toggle Navigation"
        >
          <FolderKanban size={20} />
        </button>

        <Link to="/dashboard" className="nav-brand">
          <div className="nav-logo-icon">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <span style={{ letterSpacing: '-0.02em' }}>TaskPulse</span>
        </Link>

        {activeProject && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingLeft: '12px',
              borderLeft: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {activeProject.name}
            </span>
          </div>
        )}
      </div>

      <div className="nav-actions">
        {onOpenCreateTask && (
          <button
            id="btn-create-task-nav"
            className="btn btn-primary"
            onClick={onOpenCreateTask}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.84rem' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Task</span>
          </button>
        )}

        {user && (
          <div className="user-profile-pill">
            <img
              src={
                user.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  user.name
                )}`
              }
              alt={user.name}
              className="user-avatar-sm"
            />
            <span
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.name}
            </span>
            <button
              id="btn-logout"
              onClick={logout}
              className="card-icon-btn"
              title="Logout"
              aria-label="Logout"
              style={{ marginLeft: '4px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
