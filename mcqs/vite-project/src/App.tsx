import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
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
   <>
      <header>
        <div className="header-content">
          <h1>Techmile Solutions</h1>
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
      <main>
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
