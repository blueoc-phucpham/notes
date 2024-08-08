// SignUp.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';
import * as userHooks from '@/hooks/user';

vi.mock('@/hooks/user', () => ({
  useSignUpMutation: vi.fn()
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });


  it('calls mutation.mutate with form data on valid submission', async () => {
    const mockMutate = vi.fn();
    vi.mocked(userHooks.useSignUpMutation).mockReturnValue({
      mutation: {
        mutate: mockMutate,
        isError: false,
        isSuccess: false,
        isIdle: false,
      },
      error: null,
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        password2: 'password123'
      });
    });
  });

  it('displays server-side errors', async () => {
    const mockError = {
      username: ['Username already taken'],
      email: ['Email already registered']
    };
    vi.mocked(userHooks.useSignUpMutation).mockReturnValue({
      mutation: {
        mutate: vi.fn(),
        isLoading: false,
        isError: true,
        isSuccess: false,
      },
      error: mockError,
    });

    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    // Trigger a re-render to show the errors
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Username already taken')).toBeInTheDocument();
      expect(screen.getByText('Email already registered')).toBeInTheDocument();
    });
  });
});