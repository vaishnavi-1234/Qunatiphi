import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
        }}
      >
        <div className="spinner" style={{ width: '38px', height: '38px', borderWidth: '4px' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{text}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        gap: '12px',
      }}
    >
      <div className="spinner" />
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{text}</span>
    </div>
  );
};

export default LoadingSpinner;
