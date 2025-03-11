import { Toaster } from "react-hot-toast"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

function App() {

	return (
		<Router>
      <Toaster position="top-right"/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
	)
}

export default App
