import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import UsersTable from '@/components/users/UsersTable';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@tanstack/react-query');
jest.mock('@/contexts/AuthContext');

const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
  },
];

describe('UsersTable', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      error: null,
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 1, role: 'admin' },
    });
  });

  it('renders user table with data', async () => {
    render(<UsersTable />);
    
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(3);
    });
  });

  it('shows edit and delete buttons for admin', async () => {
    render(<UsersTable />);
    
    await waitFor(() => {
      expect(screen.getAllByLabelText('Edit')).toHaveLength(2);
      expect(screen.getAllByLabelText('Delete')).toHaveLength(1);
    });
  });
});