import api from "./api";

export const authService = {

  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password })
      let token = response.data.token
      localStorage.setItem("token", token)
      return response.data.userId
    } catch (error) {
      throw error
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData)
      localStorage.setItem("token", response.data.token)
      return response.data.userId
    } catch (error) {
      throw error
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem("token")
      if (!token) return null

      const response = await api.get("/user")
      return response.data
    } catch (error) {
      localStorage.removeItem("token")
      return null
    }
  },

  async logout() {
    localStorage.removeItem("token")
  },
}