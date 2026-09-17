import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import useTasks from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import TeamList from '../components/TeamList';
import PriorityFilter from '../components/PriorityFilter';
import WorkloadIndicator from '../components/WorkloadIndicator';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import AddUserModal from '../components/AddUserModal';
import CreateProjectModal from '../components/CreateProjectModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Plus,
  UserPlus,
  AlertCircle,
  FolderKanban,
  Users,
} from 'lucide-react';

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    projects,
    activeProject,
    selectProject,
    createProject,
    addMemberToProject,
    refreshActiveProject,
  } = useProjects();

  const {
    tasks,
    workload,
    loading,
    error,
    filterPriority,
    setFilterPriority,
    moveTask,
    createTask,
    updateTask,
    deleteTask,
    fetchTasksAndWorkload,
  } = useTasks(projectId);

  // Modal states
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sidebar responsive states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync active project with URL param
  useEffect(() => {
    if (projectId) {
      selectProject(projectId);
    }
  }, [projectId]);

  const isOwner =
    activeProject &&
    user &&
    activeProject.owner &&
    (activeProject.owner._id === user._id || activeProject.owner === user._id);

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    await updateTask(taskId, taskData);
  };

  const handleDeleteTaskConfirm = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete._id);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddMember = async (userId) => {
    await addMemberToProject(projectId, { userId });
    await fetchTasksAndWorkload();
    await refreshActiveProject(projectId);
  };

  const handleCreateProject = async (projectData) => {
    const newProj = await createProject(projectData);
    navigate(`/projects/${newProj._id}`);
  };

  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="main-content">
        <Navbar
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          onOpenAddMember={() => setIsAddMemberOpen(true)}
          onToggleSidebar={() => {
            if (window.innerWidth <= 768) {
              setMobileSidebarOpen(!mobileSidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
        />

        {/* Project Subheader with Filters & Actions */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                {activeProject?.name || 'Loading Project...'}
              </h1>
              <WorkloadIndicator workload={workload} />
            </div>
            {activeProject?.description && (
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  marginTop: '3px',
                }}
              >
                {activeProject.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <PriorityFilter
              activePriority={filterPriority}
              onSelectPriority={setFilterPriority}
            />

            {isOwner && (
              <button
                id="btn-add-member-top"
                className="btn btn-secondary"
                onClick={() => setIsAddMemberOpen(true)}
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
              >
                <UserPlus size={15} />
                <span>Add Member</span>
              </button>
            )}

            <button
              id="btn-create-task-main"
              className="btn btn-primary"
              onClick={() => setIsCreateTaskOpen(true)}
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              margin: '1rem 1.75rem 0',
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Board & Team Layout */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {loading ? (
            <LoadingSpinner fullPage text="Loading Kanban board & team data..." />
          ) : (
            <KanbanBoard
              tasks={tasks}
              onMoveTask={moveTask}
              onEditTask={(task) => setEditingTask(task)}
              onDeleteTask={(task) => setTaskToDelete(task)}
            />
          )}

          {/* Team Workload Panel */}
          <TeamList
            workload={workload}
            onOpenAddMember={isOwner ? () => setIsAddMemberOpen(true) : null}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        projectMembers={activeProject?.members || []}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        projectMembers={activeProject?.members || []}
      />

      <AddUserModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
        currentMembers={activeProject?.members || []}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSubmit={handleCreateProject}
      />

      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTaskConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
        loading={isDeleting}
      />
    </div>
  );
};

export default ProjectPage;
