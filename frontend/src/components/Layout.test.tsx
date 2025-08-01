import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Layout from './Layout';

test('renders layout component', () => {
  const { getByText } = render(<MemoryRouter><Layout>Test Content</Layout></MemoryRouter>);
  const layoutElement = getByText(/G\. Stocks/i);
  expect(layoutElement).toBeInTheDocument();
});