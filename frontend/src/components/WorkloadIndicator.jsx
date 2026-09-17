import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

const WorkloadIndicator = ({ workload }) => {
  const totalMembers = workload.length;
  const overloadedMembers = workload.filter((m) => m.overloaded || m.inProgressCount > 5);
  const isHealthy = overloadedMembers.length === 0;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: 'var(--radius-full)',
        background: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
        border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.4)'}`,
        fontSize: '0.8rem',
        fontWeight: 600,
        color: isHealthy ? '#6ee7b7' : '#fca5a5',
      }}
    >
      {isHealthy ? (
        <>
          <CheckCircle2 size={14} color="#10b981" />
          <span>Workload Balanced</span>
        </>
      ) : (
        <>
          <ShieldAlert size={14} color="#ef4444" />
          <span>{overloadedMembers.length} Overloaded Member(s)</span>
        </>
      )}
    </div>
  );
};

export default WorkloadIndicator;
