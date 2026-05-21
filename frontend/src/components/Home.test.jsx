import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

vi.mock('../hooks/useAlgorithmData.js', () => ({
  useAlgorithmData: vi.fn(),
}));

const mockCategories = [
  {
    id: 'sorting',
    name: 'Sorting',
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort', description: 'Simple comparison-based sort', complexity: { worst: 'O(n²)' }, stability: 'Stable' },
      { id: 'quick-sort', name: 'Quick Sort', description: 'Divide and conquer sort', complexity: { worst: 'O(n²)' }, stability: 'Unstable' },
    ],
  },
  {
    id: 'graph',
    name: 'Graph Algorithms',
    algorithms: [
      { id: 'dijkstra', name: "Dijkstra's Algorithm", description: 'Shortest path algorithm', complexity: { worst: 'O(V²)' }, stability: '—' },
    ],
  },
];

describe('Home', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders a loading state initially', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({ data: null, loading: true, error: null });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading algorithms...')).toBeDefined();
  });

  it('shows error state when API fails', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Network error'),
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Failed to load')).toBeDefined();
    expect(screen.getByText('Network error')).toBeDefined();
  });

  it('renders algorithm categories when data loads', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('All algorithms')).toBeDefined();
    });
    expect(screen.getAllByText('Sorting').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Graph Algorithms').length).toBeGreaterThan(0);
    expect(screen.getByText('Bubble Sort')).toBeDefined();
    expect(screen.getByText('Quick Sort')).toBeDefined();
    expect(screen.getAllByText("Dijkstra's Algorithm").length).toBeGreaterThan(0);
  });

  it('renders the total algorithm count', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/3 interactive visualizations/)).toBeDefined();
  });

  it('renders the search input', async () => {
    const { useAlgorithmData } = await import('../hooks/useAlgorithmData.js');
    useAlgorithmData.mockReturnValue({
      data: { categories: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Search algorithms…')).toBeDefined();
  });
});
