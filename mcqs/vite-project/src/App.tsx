import { AuthProvider } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { QuestionForm } from './components/QuestionForm'
import { AdminDashboard } from './components/AdminDashboard'
import { useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
  const { user } = useAuth()

  const isAdmin = user?.email === 'admin@admin.com' || user?.email === 'admin@gmail.com'
  console.log(user, 'user')
  return (
    <div className="app">
      <header>
        <h1>Techmile Solutions</h1>
        {user && <p>Welcome, {user.email}</p>}
      </header>
      <main>
        {!user ? (
          <Auth />
        ) : isAdmin ? (
          <AdminDashboard />
        ) : (
          <QuestionForm />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
