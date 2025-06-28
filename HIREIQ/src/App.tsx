import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthForm from './components/AuthForm'
import RoleSelection from './components/RoleSelection'
import InterviewChat from './components/InterviewChat'
import History from './components/History'
import { JobRole } from './lib/questions'
import { User } from '@supabase/supabase-js'

type AppState = 'auth' | 'role-selection' | 'interview' | 'history'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [appState, setAppState] = useState<AppState>('auth')
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAppState(session?.user ? 'role-selection' : 'auth')
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAppState(session?.user ? 'role-selection' : 'auth')
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthChange = () => {
    // Auth state will be handled by the listener
  }

  const handleRoleSelect = (role: JobRole) => {
    setSelectedRole(role)
    setAppState('interview')
  }

  const handleBackToRoles = () => {
    setSelectedRole(null)
    setAppState('role-selection')
  }

  const handleShowHistory = () => {
    setAppState('history')
  }

  const handleBackFromHistory = () => {
    setAppState(selectedRole ? 'interview' : 'role-selection')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSelectedRole(null)
    setAppState('auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (appState === 'auth') {
    return <AuthForm onAuthChange={handleAuthChange} />
  }

  if (appState === 'role-selection') {
    return (
      <div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
        <RoleSelection onRoleSelect={handleRoleSelect} />
      </div>
    )
  }

  if (appState === 'interview' && selectedRole) {
    return (
      <InterviewChat
        role={selectedRole}
        onBack={handleBackToRoles}
        onShowHistory={handleShowHistory}
      />
    )
  }

  if (appState === 'history') {
    return <History onBack={handleBackFromHistory} />
  }

  return null
}