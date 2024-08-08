import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import NotFound from './NotFound';

// Wrap the component with BrowserRouter for testing
const NotFoundWrapper = () => (
  <BrowserRouter>
    <NotFound />
  </BrowserRouter>
);

describe('NotFound Component', () => {
  test('renders 404 text', () => {
    render(<NotFoundWrapper />);
    const notFoundText = screen.getByText('404');
    expect(notFoundText).toBeInTheDocument();
  });

  test('renders error message', () => {
    render(<NotFoundWrapper />);
    const errorMessage = screen.getByText(/The page you looking for doesn't exist/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders link to home page', () => {
    render(<NotFoundWrapper />);
    const homeLink = screen.getByText('Go to Home Page');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  test('renders MoveRightIcon', () => {
    render(<NotFoundWrapper />);
    const icon = screen.getByTestId('move-right-icon');
    expect(icon).toBeInTheDocument();
  });
});