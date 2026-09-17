import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import {
  LayoutDashboard,
  Kanban,
  Plus,
  FolderPlus,
  Activity,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ collapsed, onOpenCreateProject, isOpenMobile, onCloseMobile }) => {
  const { projects, activeProject } = useProjects();
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isOpenMobile ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={20} color="#4f46e5" />
          {!collapsed && (
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Workspace</span>
          )}
        </div>
      </div>

      <div className="sidebar-content">
        <div>
          <div className="nav-section-title">{!collapsed && 'Navigation'}</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link-item ${isActive ? 'active' : ''}`
            }
            onClick={onCloseMobile}
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              padding: '0 0.5rem',
            }}
          >
            <span className="nav-section-title" style={{ margin: 0, padding: 0 }}>
              {!collapsed && 'Projects'}
            </span>
            {!collapsed && onOpenCreateProject && (
              <button
                className="card-icon-btn"
                onClick={onOpenCreateProject}
                title="New Project"
                aria-label="Create New Project"
              >
                <Plus size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {projects.map((proj) => {
              const isActive = activeProject?._id === proj._id;
              return (
                <button
                  key={proj._id}
                  onClick={() => {
                    navigate(`/projects/${proj._id}`);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`nav-link-item ${isActive ? 'active' : ''}`}
                  style={{ width: '100%', textAlign: 'left' }}
                  title={proj.name}
                >
                  <Kanban size={18} />
                  {!collapsed && (
                    <span
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {proj.name}
                    </span>
                  )}
                  {!collapsed && isActive && <ChevronRight size={14} />}
                </button>
              );
            })}

            {!collapsed && projects.length === 0 && (
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  padding: '0.5rem',
                }}
              >
                No projects yet. Create one!
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
