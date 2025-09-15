import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginForm } from './components/Auth/LoginForm'
import { Layout } from './components/Layout/Layout'
import { Dashboard } from './pages/Dashboard'
import './App.css'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
