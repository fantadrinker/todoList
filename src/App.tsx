import { useDeferredValue, useEffect, useState } from 'react'
import './App.css'
import { getTodos, putTodo, addTodo, deleteAllTodos } from './api'
import { TodoItemList } from './Components/TodoItemList'

interface TodoItem {
  id: number
  value: string
  completed: boolean
}

function App() {
  const [errors, setErrors] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [todos, setTodos] = useState([])
  const [completedTodos, setCompletedTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  const deferredQuery = useDeferredValue(query)
  useEffect(() => {
    setLoading(true)
    const todos = getTodos(false, query)
    const completed = getTodos(true, query)
    Promise.all([todos, completed]).then((res) => {
      setTodos(res[0].data)
      setCompletedTodos(res[1].data)
      setLoading(false)
    }).catch((err) => {
      setErrors(err.message)
      setLoading(false)
    })
  }, [deferredQuery])
  
  const updateTodo = (id: number, completed: boolean) => {
    setLoading(true)
    putTodo(id, completed).then(() => {
      Promise.all([getTodos(false, query), getTodos(true, query)]).then((res) => {
        setTodos(res[0].data)
        setCompletedTodos(res[1].data)
        setLoading(false)
      })
    }).catch((err) => {
      setErrors(err.message)
      setLoading(false)
    })
  }

  const postNewTodo = () => {
    if (!newTodo) return
    setLoading(true)
    addTodo(newTodo).then(() => {
      getTodos(false, query).then((res) => {
        setTodos(res.data)
        setLoading(false)
      })
      setNewTodo('')
    }).catch((err) => {
      setErrors(err.message)
      setLoading(false)
    })
  }

  const deleteAll = () => {
    setLoading(true)
    deleteAllTodos().then(() => {
      setTodos([])
      setCompletedTodos([])
      setLoading(false)
    }).catch((err) => {
      setErrors(err.message)
      setLoading(false)
    })
  }

  return (
    <>
      <nav className="navbar">
        <h1>Marvelous v2.0</h1>
        <button onClick={deleteAll}>Delete All Tasks</button>
      </nav>
      
      <div className="searchbar">
        <div>
          <input type="text" placeholder="Add a new task" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
          <button onClick={postNewTodo}>Add</button>
        </div>
        <input type="text" placeholder="search tasks" value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className='main'>
        {loading && <div>loading...</div>}
        {errors && <div>Error: {errors}</div>}
        <TodoItemList 
          title="Todo"
          items={todos} 
          onChange={updateTodo} 
        />
        <TodoItemList 
          title="Done"
          items={completedTodos.slice(0, 10)} 
          onChange={updateTodo} 
        />
      </div>
    </>
  )
}

export default App
