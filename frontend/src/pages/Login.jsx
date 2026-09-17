import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'radial-gradient(circle at top, #1e1e38 0%, #0b0f17 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              color: '#ffffff',
              marginBottom: '1rem',
              boxShadow: '0 8px 16px var(--primary-glow)',
            }}
          >
            <CheckSquare size={26} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Welcome to TaskPulse
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Log in to manage tasks and monitor team workload
          </p>
        </div>

        {error && (
          <div
            id="login-error-alert"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.86rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <input
              id="email-input"
              className="form-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Demo Quick Fill Section */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={14} color="#6366f1" /> Quick-Login Demo Accounts:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              id="quick-vaishnavi"
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', padding: '6px 8px' }}
              onClick={() => handleQuickLogin('vaishnavi@example.com', 'password123')}
            >
              Vaishnavi (Owner)
            </button>
            <button
              type="button"
              id="quick-rahul"
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', padding: '6px 8px', borderColor: '#ef4444', color: '#fca5a5' }}
              onClick={() => handleQuickLogin('rahul@example.com', 'password123')}
              title="Has 7 In Progress tasks (Overloaded - Pulses Red!)"
            >
              Rahul (Overloaded!)
            </button>
            <button
              type="button"
              id="quick-priya"
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', padding: '6px 8px' }}
              onClick={() => handleQuickLogin('priya@example.com', 'password123')}
            >
              Priya (Member)
            </button>
            <button
              type="button"
              id="quick-alex"
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', padding: '6px 8px' }}
              onClick={() => handleQuickLogin('alex@example.com', 'password123')}
            >
              Alex (Member)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
