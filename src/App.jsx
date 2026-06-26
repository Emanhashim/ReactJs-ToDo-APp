import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  const generateId = () =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = newTodo.trim()
    if (!trimmed) return

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: generateId(), text: trimmed, completed: false },
    ])
    setNewTodo('')
  }

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed))
  }

  const remaining = todos.filter((todo) => !todo.completed).length
  const hasCompleted = todos.some((todo) => todo.completed)

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>React Todo App</h1>
        <p>Write tasks, mark them done, and keep your day organized.</p>
      </header>

      <section className="todo-card">
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            aria-label="New todo"
          />
          <button type="submit" className="todo-add-button">
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="empty-state">No todos yet. Add your first task.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>
                <button
                  type="button"
                  className="todo-delete"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <div className="todo-footer">
            <span>{remaining} item{remaining !== 1 ? 's' : ''} left</span>
            <button
              type="button"
              className="clear-completed"
              onClick={clearCompleted}
              disabled={!hasCompleted}
            >
              Clear completed
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
