import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Nav from './Nav';

describe('Nav', () => {
  it('renders the logo', () => {
    render(<BrowserRouter><Nav /></BrowserRouter>);
    expect(screen.getByText('Algo')).toBeDefined();
  });

  it('renders navigation links', () => {
    render(<BrowserRouter><Nav /></BrowserRouter>);
    expect(screen.getByText('Algorithms')).toBeDefined();
  });

  it('renders Home link', () => {
    render(<BrowserRouter><Nav /></BrowserRouter>);
    expect(screen.getByText('Home')).toBeDefined();
  });

  it('renders Playground link with Coming soon badge', () => {
    render(<BrowserRouter><Nav /></BrowserRouter>);
    expect(screen.getByText('Playground')).toBeDefined();
    expect(screen.getByText('Coming soon')).toBeDefined();
  });

  it('renders Docs link', () => {
    render(<BrowserRouter><Nav /></BrowserRouter>);
    expect(screen.getByText('Docs')).toBeDefined();
  });

  it('renders Sign in and Get started buttons when no breadcrumb', () => {
    render(<BrowserRouter><Nav /></BrowserRouter>);
    expect(screen.getByText('Sign in')).toBeDefined();
    expect(screen.getByText('Get started')).toBeDefined();
  });

  it('renders breadcrumb and Back button when breadcrumb is provided', () => {
    render(
      <BrowserRouter>
        <Nav breadcrumb={[{ label: 'Sorting', href: '/sorting' }]} />
      </BrowserRouter>
    );
    expect(screen.getByText('Algorithms')).toBeDefined();
    expect(screen.getByText('Sorting')).toBeDefined();
    expect(screen.getByText(/← Back/i)).toBeDefined();
  });
});
