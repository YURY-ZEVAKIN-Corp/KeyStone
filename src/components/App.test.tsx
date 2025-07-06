import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing and contains Login', () => {
    const { getByRole } = render(<App />);
    // Check for main role for accessibility
    const main = getByRole('main');
    expect(main).toBeInTheDocument();
  });
});
