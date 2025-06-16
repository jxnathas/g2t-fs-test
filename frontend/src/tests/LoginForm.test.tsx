import { render, fireEvent, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext');

describe('LoginForm', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
    });
  });

  it('renders login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    render(<LoginForm />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<LoginForm />);
    
    fireEvent.input(screen.getByLabelText('Email address'), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});