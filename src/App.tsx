import { useDeferredValue, useEffect, useState } from 'react';
import './App.css';
import { getTodos, putTodo, addTodo, deleteAllTodos } from './api';
import { TodoItemList } from './Components/TodoItemList';

/**
 * renders the todo app, including the search bar, todo list, and done list
 * If there were more time or the search bar functionality was more complex
 * (like search suggestions), I would consider putting them away as a separate
 * component/module.
 * @returns JSX Element App
 */

function App() {
  const [errors, setErrors] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const deferredQuery = useDeferredValue(query);
  useEffect(() => {
    setLoading(true);
    const todos = getTodos(false, deferredQuery);
    const completed = getTodos(true, deferredQuery);
    Promise.all([todos, completed])
      .then((res) => {
        setTodos(res[0].data);
        setCompletedTodos(res[1].data);
        setLoading(false);
      })
      .catch((err) => {
        setErrors(err.message);
        setLoading(false);
      });
  }, [deferredQuery]);

  const updateTodo = (id: number, completed: boolean) => {
    setLoading(true);
    putTodo(id, completed)
      .then(() => {
        Promise.all([getTodos(false, query), getTodos(true, query)]).then(
          (res) => {
            setTodos(res[0].data);
            setCompletedTodos(res[1].data);
            setLoading(false);
          }
        );
      })
      .catch((err) => {
        setErrors(err.message);
        setLoading(false);
      });
  };

  const postNewTodo = () => {
    if (!newTodo) return;
    setLoading(true);
    addTodo(newTodo)
      .then(() => {
        getTodos(false, query).then((res) => {
          setTodos(res.data);
          setLoading(false);
        });
        setNewTodo('');
      })
      .catch((err) => {
        setErrors(err.message);
        setLoading(false);
      });
  };

  const deleteAll = () => {
    setLoading(true);
    deleteAllTodos()
      .then(() => {
        setTodos([]);
        setCompletedTodos([]);
        setLoading(false);
      })
      .catch((err) => {
        setErrors(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <nav className="navbar">
        <h1>Marvelous v2.0</h1>
        <button onClick={deleteAll}>Delete All Tasks</button>
      </nav>

      <div className="searchbar">
        <div>
          <input
            type="text"
            placeholder="Add a new task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={postNewTodo}>Add</button>
        </div>
        <input
          type="text"
          placeholder="search tasks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="main">
        {loading && <div>loading...</div>}
        {errors && <div>Error: {errors}</div>}
        {!loading && !errors && (
          <>
            <TodoItemList title="Todo" items={todos} onChange={updateTodo} />
            <TodoItemList
              title="Done"
              items={completedTodos.slice(0, 10)}
              onChange={updateTodo}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
