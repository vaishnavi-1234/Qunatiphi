import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { FolderKanban, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectSelector = () => {
  const { projects, activeProject } = useProjects();
  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const projectId = e.target.value;
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <FolderKanban size={16} color="#6366f1" />
      <select
        id="project-selector-dropdown"
        className="form-select"
        value={activeProject?._id || ''}
        onChange={handleSelectChange}
        style={{
          padding: '0.4rem 0.8rem',
          fontSize: '0.86rem',
          fontWeight: 600,
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
      >
        {projects.map((proj) => (
          <option key={proj._id} value={proj._id}>
            {proj.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
