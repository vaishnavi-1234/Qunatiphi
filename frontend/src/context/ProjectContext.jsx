import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import projectService from '../services/projectService';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingProjects(true);
    setError(null);
    try {
      const res = await projectService.getProjects();
      if (res.success) {
        setProjects(res.data);
        // If no active project selected yet or active project no longer exists, select first project
        setActiveProject((current) => {
          if (!current && res.data.length > 0) {
            return res.data[0];
          }
          if (current) {
            const stillExists = res.data.find((p) => p._id === current._id);
            return stillExists || (res.data.length > 0 ? res.data[0] : null);
          }
          return null;
        });
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      setProjects([]);
      setActiveProject(null);
    }
  }, [isAuthenticated, fetchProjects]);

  const selectProject = (projectId) => {
    const found = projects.find((p) => p._id === projectId);
    if (found) {
      setActiveProject(found);
    }
  };

  const createProject = async (projectData) => {
    const res = await projectService.createProject(projectData);
    if (res.success && res.data) {
      setProjects((prev) => [res.data, ...prev]);
      setActiveProject(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Failed to create project');
  };

  const updateProject = async (id, projectData) => {
    const res = await projectService.updateProject(id, projectData);
    if (res.success && res.data) {
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? res.data : p))
      );
      if (activeProject && activeProject._id === id) {
        setActiveProject(res.data);
      }
      return res.data;
    }
    throw new Error(res.message || 'Failed to update project');
  };

  const deleteProject = async (id) => {
    const res = await projectService.deleteProject(id);
    if (res.success) {
      const remaining = projects.filter((p) => p._id !== id);
      setProjects(remaining);
      if (activeProject && activeProject._id === id) {
        setActiveProject(remaining.length > 0 ? remaining[0] : null);
      }
      return true;
    }
    throw new Error(res.message || 'Failed to delete project');
  };

  const addMemberToProject = async (projectId, memberData) => {
    const res = await projectService.addMember(projectId, memberData);
    if (res.success && res.data) {
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? res.data : p))
      );
      if (activeProject && activeProject._id === projectId) {
        setActiveProject(res.data);
      }
      return res.data;
    }
    throw new Error(res.message || 'Failed to add member');
  };

  const removeMemberFromProject = async (projectId, userId) => {
    const res = await projectService.removeMember(projectId, userId);
    if (res.success && res.data) {
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? res.data : p))
      );
      if (activeProject && activeProject._id === projectId) {
        setActiveProject(res.data);
      }
      return res.data;
    }
    throw new Error(res.message || 'Failed to remove member');
  };

  const refreshActiveProject = async (projectId) => {
    const idToFetch = projectId || activeProject?._id;
    if (!idToFetch) return;
    try {
      const res = await projectService.getProjectById(idToFetch);
      if (res.success && res.data) {
        setActiveProject(res.data);
        setProjects((prev) =>
          prev.map((p) => (p._id === idToFetch ? res.data : p))
        );
      }
    } catch (err) {
      console.error('Failed to refresh project:', err);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        loadingProjects,
        error,
        fetchProjects,
        selectProject,
        createProject,
        updateProject,
        deleteProject,
        addMemberToProject,
        removeMemberFromProject,
        refreshActiveProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext;
