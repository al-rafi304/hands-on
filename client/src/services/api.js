import axios from "axios"
import toast from "react-hot-toast"

const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    if (response) {
      // Handle different error status codes
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (window.location.pathname != '/login') {
            localStorage.removeItem("token")
            window.location.href = "/login"
            toast.error("Session expired. Please login again.")
          }
          break
        case 403:
          toast.error("You do not have permission to perform this action.")
          break
        case 404:
          toast.error("Resource not found.")
          break
        case 500:
          toast.error("Server error. Please try again later.")
          break
        default:
          toast.error(response.data.message || "Something went wrong.")
      }
    } else {
      toast.error("Network error. Please check your connection.")
    }

    return Promise.reject(error)
  },
)

export default api

