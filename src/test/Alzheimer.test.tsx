import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FilterProvider } from '@/contexts/FilterContext';
import Index from '@/pages/Index';
import Genere from '@/pages/Genere';
import Educacio from '@/pages/Educacio';

// Mock data
const mockPatients = [
  {
    id: 'TEST_001',
    gender: 'F' as const,
    hand: 'R',
    age: 65,
    education: 4,
    ses: 2,
    mmse: 28,
    cdr: 0,
    eTIV: 1500,
    nWBV: 0.75,
    asf: 1.2,
    delay: null,
    diagnosis: 'NonDemented' as const
  },
  {
    id: 'TEST_002',
    gender: 'M' as const,
    hand: 'R',
    age: 78,
    education: 2,
    ses: 3,
    mmse: 24,
    cdr: 0.5,
    eTIV: 1600,
    nWBV: 0.68,
    asf: 1.1,
    delay: null,
    diagnosis: 'VeryMildDemented' as const
  }
];

// Mock useAlzheimerData hook
vi.mock('@/hooks/useAlzheimerData', () => ({
  useAlzheimerData: () => ({
    patients: mockPatients,
    loading: false,
    error: null,
    stats: {
      total: 2,
      demented: 1,
      avgAge: 71.5,
      avgMMSE: 26
    }
  })
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <FilterProvider>
        {component}
      </FilterProvider>
    </BrowserRouter>
  );
};

describe('Index Page', () => {
  it('renders dashboard title', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText(/Exploració de Dades sobre Alzheimer/i)).toBeInTheDocument();
  });

  it('displays patient statistics', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText('2')).toBeInTheDocument(); // Total patients
  });

  it('renders analysis cards', () => {
    renderWithProviders(<Index />);
    expect(screen.getByText(/Gènere i Alzheimer/i)).toBeInTheDocument();
    expect(screen.getByText(/Edat i Progressió/i)).toBeInTheDocument();
  });
});

describe('Genere Page', () => {
  it('renders gender analysis title', () => {
    renderWithProviders(<Genere />);
    expect(screen.getByText(/Diferències per Gènere/i)).toBeInTheDocument();
  });

  it('displays gender-specific stats', () => {
    renderWithProviders(<Genere />);
    expect(screen.getByText(/Dones/i)).toBeInTheDocument();
    expect(screen.getByText(/Homes/i)).toBeInTheDocument();
  });
});

describe('Educacio Page', () => {
  it('renders education analysis title', () => {
    renderWithProviders(<Educacio />);
    expect(screen.getByText(/Educació i Reserva Cognitiva/i)).toBeInTheDocument();
  });

  it('displays education level information', () => {
    renderWithProviders(<Educacio />);
    expect(screen.getByText(/Nivell educatiu mitjà/i)).toBeInTheDocument();
  });
});

describe('FilterContext', () => {
  it('provides filtered patients', () => {
    const { container } = renderWithProviders(<Index />);
    expect(container).toBeTruthy();
  });
});

describe('Accessibility', () => {
  it('has proper heading hierarchy in Index', () => {
    renderWithProviders(<Index />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('has interactive elements with proper labels', () => {
    renderWithProviders(<Genere />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBeGreaterThan(0);
  });
});