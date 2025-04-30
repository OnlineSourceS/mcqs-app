 import { supabase } from './lib/supabase';
import { AuthProvider } from './contexts/AuthContext'
import { Auth } from './components/Auth'
import { QuestionForm } from './components/QuestionForm'
import { AdminDashboard } from './components/AdminDashboard'
import { useAuth } from './contexts/AuthContext'
import './App.css'
import logo from './assets/logo.png'
function AppContent() {
  const { user } = useAuth()

  const isAdmin = user?.email === 'admin@admin.com' || user?.email === 'admin@gmail.com'
  console.log(user, 'user')
  return (
   <>
      <header>
        <div className="header-content">
          <h1 style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <img src={logo} alt="Techmile Solutions" style={{width: '50px', height: '50px'}} />
            <span style={{fontSize: '20px', fontWeight: 'bold'}}>Techmile Solutions </span>
          </h1>
          <div className="header-right" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {user && (
              <>
                <p>Welcome, {user.email}</p>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="signout-btn"
                  style={{
                    marginTop: '10px'
                  }}>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main style={{height: '100vh'}}>
        {!user ? (
          <Auth />
        ) : isAdmin ? (
          <AdminDashboard />
        ) : (
          <QuestionForm />
        )}
      </main> 
        </>
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
