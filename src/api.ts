/**
 * API file that handles all the requests to the backend.
 *
 */

// should probably move this to an env variable
const backendUrl = 'http://localhost:3000';

export const getTodos = async (completed: boolean, query: string) => {
  const response = await fetch(
    `${backendUrl}/todos?completed=${completed}&query=${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    }
  );
  return await response.json();
};

export const addTodo = async (todo: string) => {
  const response = await fetch(`${backendUrl}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify({ todo }),
  });
  return await response.json();
};

export const putTodo = async (id: number, completed: boolean) => {
  const response = await fetch(`${backendUrl}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify({ completed }),
  });
  return await response.json();
};

export const deleteAllTodos = async () => {
  const response = await fetch(`${backendUrl}/todos`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });
  return await response.json();
};
