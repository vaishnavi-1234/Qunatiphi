import React from 'react';
import { Filter } from 'lucide-react';
import { PRIORITIES } from '../utils/constants';

const PriorityFilter = ({ activePriority, onSelectPriority }) => {
  const options = ['All', PRIORITIES.LOW, PRIORITIES.MEDIUM, PRIORITIES.HIGH];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          fontWeight: 600,
        }}
      >
        <Filter size={14} /> Priority:
      </span>

      <div className="filter-pills-group" id="priority-filter-group">
        {options.map((option) => (
          <button
            key={option}
            id={`filter-${option.toLowerCase()}`}
            className={`filter-pill ${activePriority === option ? 'active' : ''}`}
            onClick={() => onSelectPriority(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityFilter;
