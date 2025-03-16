import { Routes, Route } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import DashboardOverview from "./DashboardOverview"
import EventsPage from "../event/EventsPage"
import CreateEvent from "../event/CreateEvent"
import EventDetails from "../event/EventDetails"
import HelpRequestsPage from "../request/RequestsPage"
import CreateHelpRequest from "../request/CreateHelpRequest"

const Dashboard = () => {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/events/:eventId" element={<EventDetails />} />
                <Route path="/help-requests" element={<HelpRequestsPage />} />
                <Route path="/help-requests/create" element={<CreateHelpRequest />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard