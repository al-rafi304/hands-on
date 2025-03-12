import { createContext, useState, useEffect, useContext } from "react"
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        const userData = await authService.getCurrentUser()
        setCurrentUser(userData)
      } catch (error) {
        console.error("Failed to get current user:", error)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const userData = await authService.login(email, password)
      setCurrentUser(userData)
      return userData
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const newUser = await authService.register(userData)
      setCurrentUser(newUser)
      return newUser
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      setCurrentUser(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}