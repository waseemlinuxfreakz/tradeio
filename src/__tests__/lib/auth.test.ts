import { describe, it, expect, beforeEach } from 'vitest';
import { useAuth } from '../../lib/auth';

describe('auth store', () => {
  beforeEach(() => {
    useAuth.setState({
      isAuthenticated: false,
      user: null
    });
  });

  it('initializes with default state', () => {
    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('handles successful login', async () => {
    const { login } = useAuth.getState();
    
    await login('ew5933070@gmail.com', 'Logitech@101');
    
    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ email: 'ew5933070@gmail.com' });
  });

  it('handles failed login', async () => {
    const { login } = useAuth.getState();
    
    await expect(login('wrong@email.com', 'wrongpass'))
      .rejects.toThrow('Invalid credentials');
    
    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('handles logout', () => {
    const { login, logout } = useAuth.getState();
    
    login('ew5933070@gmail.com', 'Logitech@101');
    logout();
    
    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});