import { AuthProvider } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { QuestionForm } from './components/QuestionForm'
import { useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
  const { user } = useAuth()

  return (
    <div className="app">
      <header>
        <h1>Question & Answer App</h1>
        {user && <p>Welcome, {user.email}</p>}
      </header>
      <main>
        {!user ? <Auth /> : <QuestionForm />}
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
