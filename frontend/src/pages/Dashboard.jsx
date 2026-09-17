import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateProjectModal from '../components/CreateProjectModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FolderPlus,
  ArrowUpRight,
  Users,
  Kanban,
  Sparkles,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects, loadingProjects, createProject, deleteProject } = useProjects();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleCreateProject = async (projectData) => {
    const newProj = await createProject(projectData);
    navigate(`/projects/${newProj._id}`);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProject(projectToDelete._id);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        onOpenCreateProject={() => setIsCreateModalOpen(true)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="main-content">
        <Navbar
          onToggleSidebar={() => {
            if (window.innerWidth <= 768) {
              setMobileSidebarOpen(!mobileSidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
        />

        <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {/* Welcome Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: '0.78rem',
                  color: '#818cf8',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                }}
              >
                <Sparkles size={13} /> Personal & Team Productivity
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                Select a project below to open the Kanban board and view team workload.
              </p>
            </div>

            <button
              id="dashboard-btn-new-project"
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <FolderPlus size={18} strokeWidth={2.2} />
              <span>Create New Project</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(79, 70, 229, 0.15)',
                  color: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{projects.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Active Projects
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {projects.reduce((acc, p) => acc + (p.members?.length || 0), 0)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Team Assignments
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Kanban size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>3 Columns</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Drag & Drop Kanban
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              My Projects
            </h2>

            {loadingProjects ? (
              <LoadingSpinner text="Loading projects from database..." />
            ) : projects.length === 0 ? (
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                }}
              >
                <Kanban size={42} color="#64748b" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>No projects found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  Create your first project to start organizing tasks on a Kanban board.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <FolderPlus size={16} /> Create Project
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {projects.map((proj) => {
                  const isOwner =
                    proj.owner?._id === user?._id || proj.owner === user?._id;

                  return (
                    <div
                      key={proj._id}
                      id={`project-card-${proj._id}`}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.25rem',
                        boxShadow: 'var(--shadow-md)',
                        transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onClick={() => navigate(`/projects/${proj._id}`)}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              background: isOwner
                                ? 'rgba(99, 102, 241, 0.15)'
                                : 'rgba(100, 116, 139, 0.15)',
                              color: isOwner ? '#818cf8' : '#94a3b8',
                              border: `1px solid ${
                                isOwner
                                  ? 'rgba(99, 102, 241, 0.3)'
                                  : 'rgba(100, 116, 139, 0.3)'
                              }`,
                            }}
                          >
                            {isOwner ? 'Owner' : 'Member'}
                          </span>

                          {isOwner && (
                            <button
                              className="card-icon-btn delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProjectToDelete(proj);
                              }}
                              title="Delete Project"
                              aria-label="Delete Project"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                          {proj.name}
                        </h3>

                        <p
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.45,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {proj.description || 'No description provided.'}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid var(--border-subtle)',
                        }}
                      >
                        {/* Member Avatars */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {proj.members?.slice(0, 4).map((member, idx) => (
                            <img
                              key={member._id || idx}
                              src={
                                member.avatar ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  member.name
                                )}`
                              }
                              alt={member.name}
                              title={member.name}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                border: '2px solid var(--bg-secondary)',
                                marginLeft: idx > 0 ? '-8px' : '0',
                                objectFit: 'cover',
                              }}
                            />
                          ))}
                          {(proj.members?.length || 0) > 4 && (
                            <span
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'var(--bg-surface)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid var(--bg-secondary)',
                                marginLeft: '-8px',
                              }}
                            >
                              +{proj.members.length - 4}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#818cf8',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                          }}
                        >
                          Open Board <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <DeleteConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? All associated tasks will be permanently removed.`}
        loading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
