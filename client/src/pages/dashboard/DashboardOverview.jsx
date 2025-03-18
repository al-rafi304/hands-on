import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, HelpCircle, Users, Award } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import eventService from "../../services/eventService"

const DashboardOverview = () => {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    helpRequests: 0,
    volunteerHours: 14,
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [recentHelpRequests, setRecentHelpRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        // Fetch user events
        const userEvents = await eventService.getAttendingEvents()
        const upcomingEvents = userEvents.filter(event => new Date(event.date) > new Date())
        setRecentEvents(upcomingEvents)
        // setRecentEvents(userEvents.slice(0, 3))

        // Fetch help requests
        // const helpRequests = await helpRequestService.getUserHelpRequests()
        // setRecentHelpRequests(helpRequests.slice(0, 3))

        // Set stats
        setStats({
          upcomingEvents: upcomingEvents.length,
          helpRequests: 4, // Simulated data
          volunteerHours: 24, // Simulated data
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const simulatedHelpRequests = [
    {
      id: 1,
      title: "Need volunteers for tutoring",
      description: "Looking for math and science tutors for underprivileged children",
      urgency: "Medium",
      postedBy: "Education For All",
      postedAt: "2023-06-10T08:30:00",
    },
    {
      id: 2,
      title: "Help needed for animal shelter",
      description: "Volunteers needed to walk dogs and clean kennels",
      urgency: "High",
      postedBy: "Animal Rescue",
      postedAt: "2023-06-12T14:45:00",
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-xl font-medium text-gray-900">Welcome back, {currentUser?.name || "Volunteer"}!</h2>
        <p className="mt-1 text-gray-500">Here's what's happening with your volunteering activities.</p>
      </div>

      {/* Stats Section */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.upcomingEvents}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/events" className="font-medium text-primary hover:text-primary-dark">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Help Requests</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.helpRequests}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/help-requests" className="font-medium text-primary hover:text-primary-dark">
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Teams</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.teams}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/teams" className="font-medium text-primary hover:text-primary-dark">
                View all
              </Link>
            </div>
          </div>
        </div> */}

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Volunteer Hours</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.volunteerHours}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/dashboard/impact" className="font-medium text-primary hover:text-primary-dark">
                View details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Section */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Your Upcoming Events</h2>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <li key={event._id}>
                  <Link to={`/dashboard/events/${event._id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary truncate">{event.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {event.category}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">{event.location}</p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No upcoming events.{" "}
                <Link to="/dashboard/events" className="text-primary">
                  Find events to join
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Recent Help Requests Section */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Help Requests</h2>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {simulatedHelpRequests.length > 0 ? (
              simulatedHelpRequests.map((request) => (
                <li key={request.id}>
                  <Link to={`/dashboard/help-requests/${request.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary truncate">{request.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.urgency === "High"
                                ? "bg-red-100 text-red-800"
                                : request.urgency === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                          >
                            {request.urgency}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {request.description.substring(0, 100)}
                            {request.description.length > 100 ? "..." : ""}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>Posted by: {request.postedBy}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No recent help requests.{" "}
                <Link to="/dashboard/help-requests" className="text-primary">
                  View all help requests
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview

