import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PC Monitoring Dashboard heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/PC Status Dashboard/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders Dashboard component', () => {
  render(<App />);
  const dashboardElement = screen.getByText(/PC Monitoring Dashboard/i);
  expect(dashboardElement).toBeInTheDocument();
});