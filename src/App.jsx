import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [newCategory, setNewCategory] = useState('work')
  const [newDueDate, setNewDueDate] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Persist dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) {
      setDarkMode(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

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
      {
        id: generateId(),
        text: trimmed,
        completed: false,
        category: newCategory,
        dueDate: newDueDate,
      },
    ])
    setNewTodo('')
    setNewDueDate('')
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

  // Filter todos based on search query
  const filteredTodos = todos.filter(
    (todo) =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const remaining = filteredTodos.filter((todo) => !todo.completed).length
  const hasCompleted = todos.some((todo) => todo.completed)

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <main className={`app-shell ${darkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <div className="header-top">
          <h1>React Todo App</h1>
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p>Write tasks, mark them done, and keep your day organized.</p>
      </header>

      <section className="todo-card">
        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search todos or categories..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search todos"
          />
        </div>

        {/* Main form */}
        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo-input"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            aria-label="New todo"
          />
          <select
            className="todo-category"
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            aria-label="Todo category"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
          <input
            type="date"
            className="todo-date"
            value={newDueDate}
            onChange={(event) => setNewDueDate(event.target.value)}
            aria-label="Due date"
          />
          <button type="submit" className="todo-add-button">
            Add
          </button>
        </form>

        {filteredTodos.length === 0 && todos.length === 0 ? (
          <p className="empty-state">No todos yet. Add your first task.</p>
        ) : filteredTodos.length === 0 ? (
          <p className="empty-state">No todos match your search.</p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-content">
                  <label className="todo-label">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span>{todo.text}</span>
                  </label>
                  <div className="todo-meta">
                    <span className={`todo-category-badge category-${todo.category}`}>
                      {todo.category}
                    </span>
                    {todo.dueDate && (
                      <span className="todo-date-badge">
                        📅 {formatDate(todo.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
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
