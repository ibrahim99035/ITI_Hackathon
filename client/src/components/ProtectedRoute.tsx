import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Role = 'Admin' | 'Librarian' | 'Member'

interface Props {
  children: React.ReactNode
  roles?: Role[]
}

export const ProtectedRoute = ({ children, roles }: Props) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return <>{children}</>
}
