import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import App from './App';

const mockFetch = jest.fn((url) => {
  if (url === 'http://localhost:3000/todos?completed=false&query=') {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 1,
              value: 'task 1',
              completed: false,
            },
            {
              id: 2,
              value: 'task 2',
              completed: false,
            },
          ],
        }),
    });
  } else if (url === 'http://localhost:3000/todos?completed=true&query=') {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          data: [
            {
              id: 3,
              value: 'task 3',
              completed: true,
            },
          ],
        }),
    });
  }
});

beforeAll(() => {
  global.fetch = mockFetch;
});

test('loads and displays greeting', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText('Todo')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('task 1')).toBeInTheDocument();
    expect(screen.getByText('task 2')).toBeInTheDocument();
    expect(screen.getByText('task 3')).toBeInTheDocument();
  });
});

test('add new task', async () => {
  render(<App />);
  await waitFor(() => {
    const input = screen.getByPlaceholderText('Add a new task');
    fireEvent.change(input, { target: { value: 'task 4' } });
    const button = screen.getByText('Add');
    fireEvent.click(button);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo: 'task 4' }),
      mode: 'cors',
    });
  });
});

test('search task with query', async () => {
  render(<App />);
  await waitFor(() => {
    const input = screen.getByPlaceholderText('search tasks');
    fireEvent.change(input, { target: { value: 'task' } });
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/todos?completed=false&query=task',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      }
    );
  });
});

test('mark task as done', async () => {
  render(<App />);
  await waitFor(() => {
    // find the checkbox that's not checked
    const checkbox = screen.getAllByRole('checkbox', { checked: false })[0];
    fireEvent.click(checkbox);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/todos/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
      mode: 'cors',
    });
  });
});

test('mark task as undone', async () => {
  render(<App />);
  await waitFor(() => {
    // find the checkbox that's not checked
    const checkbox = screen.getAllByRole('checkbox', { checked: true })[0];
    fireEvent.click(checkbox);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/todos/3', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: false }),
      mode: 'cors',
    });
  });
});
