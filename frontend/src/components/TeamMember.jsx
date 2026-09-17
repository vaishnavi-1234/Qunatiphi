import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { MAX_IN_PROGRESS_THRESHOLD } from '../utils/constants';

const TeamMember = ({ member }) => {
  const isOverloaded =
    member.overloaded || member.inProgressCount > MAX_IN_PROGRESS_THRESHOLD;

  return (
    <div
      id={`team-member-${member.userId}`}
      className={`team-member-card ${isOverloaded ? 'is-overloaded' : ''}`}
      title={
        isOverloaded
          ? `High workload warning: ${member.inProgressCount} tasks currently in progress!`
          : `${member.name}: ${member.inProgressCount} in progress, ${member.totalTaskCount} total`
      }
    >
      <div className="member-avatar-wrapper">
        <img
          src={
            member.avatar ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              member.name
            )}`
          }
          alt={member.name}
          className={`member-avatar ${isOverloaded ? 'avatar-overloaded' : ''}`}
          id={`member-avatar-${member.userId}`}
        />
      </div>

      <div className="member-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
          <h4 className="member-name">{member.name}</h4>
          {isOverloaded && (
            <span
              id={`overload-badge-${member.userId}`}
              className="overload-warning-badge"
              title="Potentially excessive workload (>5 In Progress tasks)"
            >
              <AlertTriangle size={12} strokeWidth={2.5} />
              {member.inProgressCount} In Progress
            </span>
          )}
        </div>

        <div className="member-stats">
          <span>{member.totalTaskCount} tasks</span>
          <span>•</span>
          {!isOverloaded ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} /> {member.inProgressCount} In Progress
            </span>
          ) : (
            <span style={{ color: '#ef4444', fontWeight: 600 }}>Overloaded</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
