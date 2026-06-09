import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const { user, logout } = useAuth()

  return (
    <>
      <header>
        {user ? (
          <>
            <span>{user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </header>
      <Routes>
        <Route path="/" element={<div>Home (public)</div>} />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/unauthorized" element={<div>403 — Not authorized</div>} />
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['Admin', 'Librarian']}>
            <div>Dashboard</div>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['Admin']}>
            <div>Admin only</div>
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
