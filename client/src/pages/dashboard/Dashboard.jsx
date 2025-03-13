import { Routes, Route } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import DashboardOverview from "./DashboardOverview"

const Dashboard = () => {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <h1>{currentUser.name}</h1>
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard