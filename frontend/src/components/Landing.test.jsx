import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from './Landing';

vi.mock('../hooks/useAlgorithmData.js', () => ({
  useAlgorithmData: vi.fn(),
}));

const mockCategories = [
  {
    id: 'sorting',
    name: 'Sorting',
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort', description: 'Simple comparison-based sort', complexity: { worst: 'O(n²)' }, stability: 'Stable' },
    ],
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    algorithms: [
      { id: 'dijkstra', name: "Dijkstra's Algorithm", description: 'Shortest path', complexity: { worst: 'O(V²)' }, stability: '—' },
    ],
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    algorithms: [
      { id: 'fibonacci', name: 'Fibonacci', description: 'Classic DP', complexity: { worst: 'O(n)' }, stability: '—' },
    ],
  },
];

describe('Landing', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders a loading state initially', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({ data: null, loading: true, error: null });

    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('renders the hero section', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Algorithms click/i)).toBeDefined();
    });
    expect(screen.getByText(/when you see them/i)).toBeDefined();
  });

  it('renders the Explore algorithms link', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    expect(screen.getByText('Explore algorithms →')).toBeDefined();
  });

  it('renders category cards', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Browse by category')).toBeDefined();
    });
    expect(screen.getByText('Sorting')).toBeDefined();
    expect(screen.getByText('Graph Algorithms')).toBeDefined();
    expect(screen.getByText('Dynamic Programming')).toBeDefined();
    expect(screen.getByText('String Algorithms')).toBeDefined();
  });

  it('renders the How it works section', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    expect(screen.getByText('Pick an algorithm')).toBeDefined();
    expect(screen.getByText('Step through it')).toBeDefined();
    expect(screen.getByText('Change the input')).toBeDefined();
  });

  it('renders stats with algorithm and category counts', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    expect(screen.getByText('3+')).toBeDefined();
    expect(screen.getByText('algorithms')).toBeDefined();
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    expect(screen.getByText('categories')).toBeDefined();
    expect(screen.getByText('Free')).toBeDefined();
    expect(screen.getByText('to start')).toBeDefined();
  });
});
