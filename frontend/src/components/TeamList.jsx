import React from 'react';
import TeamMember from './TeamMember';
import { UserPlus, Users, AlertOctagon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';

const TeamList = ({ workload, onOpenAddMember }) => {
  const { user } = useAuth();
  const { activeProject } = useProjects();

  const isOwner =
    activeProject &&
    user &&
    activeProject.owner &&
    (activeProject.owner._id === user._id || activeProject.owner === user._id);

  const overloadedCount = workload.filter((m) => m.overloaded || m.inProgressCount > 5).length;

  return (
    <aside className="team-panel" id="team-workload-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="#94a3b8" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Team Workload</h3>
        </div>

        {isOwner && onOpenAddMember && (
          <button
            id="btn-add-member"
            className="btn btn-secondary"
            onClick={onOpenAddMember}
            style={{ padding: '4px 8px', fontSize: '0.78rem' }}
            title="Add Project Member"
          >
            <UserPlus size={14} />
            <span>Add</span>
          </button>
        )}
      </div>

      {overloadedCount > 0 && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertOctagon size={18} color="#ef4444" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: '#fca5a5', lineHeight: 1.3 }}>
            <strong>{overloadedCount} member(s)</strong> have excessive workloads (&gt;5 In Progress tasks).
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {workload.length > 0 ? (
          workload.map((member) => (
            <TeamMember key={member.userId} member={member} />
          ))
        ) : (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            No team members found.
          </p>
        )}
      </div>
    </aside>
  );
};

export default TeamList;
