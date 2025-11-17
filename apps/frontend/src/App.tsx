// 🎯 MAIN APP COMPONENT - POLITICAL AUTH + ROUTING
import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import './App.css'
import toast from 'react-hot-toast'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [politicianProfile, setPoliticianProfile] = useState({
    id: '',
    name: '',
    position: '',
    availableKes: 0
  })

  useEffect(() => {
    // 🧠 Simulate politician authentication (in production: JWT validation)
    const savedAuth = localStorage.getItem('politician_auth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        setIsAuthenticated(true)
        setPoliticianProfile(authData.profile)
        
        toast.success(`Welcome back, ${authData.profile.name}!`, {
          style: { backgroundColor: '#10b981' }
        })
      } catch (error) {
        console.error('Invalid auth data')
        localStorage.removeItem('politician_auth')
      }
    }
  }, [])

  const handleLogin = (politicianData: any) => {
    setIsAuthenticated(true)
    setPoliticianProfile(politicianData)
    localStorage.setItem('politician_auth', JSON.stringify({
      token: 'mock_jwt_token_' + Date.now(),
      profile: politicianData,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }))
    
    toast.success(`Political warfare dashboard activated!`, {
      style: { backgroundColor: '#10b981' }
    })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPoliticianProfile({ id: '', name: '', position: '', availableKes: 0 })
    localStorage.removeItem('politician_auth')
    toast('Political session secure', {
      icon: '🔒',
      style: { backgroundColor: '#1f2937' }
    })
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 🔐 AUTH HEADER */}
      {isAuthenticated && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-red-500 font-bold">🎯 POLITICAL KALSHI</span>
              <span className="text-white">{politicianProfile.name}</span>
              <span className="text-green-400">Current Position: {politicianProfile.position}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* 🚀 ROUTE SYSTEM */}
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Landing onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard politicianProfile={politicianProfile} /> : 
            <Navigate to="/" replace />
          } 
        />
        
        {/* 📱 MOBILE APP ROUTES (Future) */}
        <Route path="/mobile" element={<div className="text-white text-center p-8">Mobile app coming soon...</div>} />
        
        {/* 🎯 CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
