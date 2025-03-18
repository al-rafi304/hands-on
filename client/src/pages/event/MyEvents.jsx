import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import eventService from "../../services/eventService"
import { Calendar, MapPin, ArrowLeft, Plus } from 'lucide-react'
import toast from "react-hot-toast"

const MyEvents = () => {
  const navigate = useNavigate()
  const [organizedEvents, setOrganizedEvents] = useState([])
  const [participatedEvents, setParticipatedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("participated")

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true)
        
        // In a real app, these would be actual API calls
        // For now, we'll simulate the data
        const organizedData = await eventService.getOrganizedEvents()
        const participatedData = await eventService.getAttendingEvents()
        
        setOrganizedEvents(organizedData || [])
        setParticipatedEvents(participatedData || [])
      } catch (error) {
        console.error("Error fetching events:", error)
        toast.error("Failed to load your events")
      } finally {
        setLoading(false)
      }
    }

    fetchMyEvents()
  }, [])

  // Simulated data for development
  const simulatedOrganizedEvents = [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      description: "Join us for a day of cleaning up the beach and protecting our marine life.",
      date: "2025-04-15T09:00:00",
      location: "Sunset Beach",
      category: "Environmental",
      attendees: 24,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Food Distribution",
      description: "Help distribute food packages to homeless individuals in the downtown area.",
      date: "2025-03-10T10:00:00",
      location: "Downtown Community Center",
      category: "Humanitarian",
      attendees: 15,
      status: "completed"
    }
  ]

  const simulatedParticipatedEvents = [
    {
      id: 3,
      title: "Elderly Home Visit",
      description: "Spend time with elderly residents, engage in activities, and brighten their day.",
      date: "2025-04-25T14:00:00",
      location: "Sunshine Elderly Care",
      category: "Healthcare",
      attendees: 10,
      status: "upcoming"
    },
    {
      id: 4,
      title: "Tree Planting Initiative",
      description: "Help us plant trees in the city park to increase green cover and fight pollution.",
      date: "2025-03-05T08:00:00",
      location: "Central City Park",
      category: "Environmental",
      attendees: 30,
      status: "completed"
    },
    {
      id: 5,
      title: "Stray Rescue",
      description: "Help rescue and care for stray animals in our community.",
      date: "2025-03-01T09:00:00",
      location: "Dhaka Animal Shelter",
      category: "Animal Welfare",
      attendees: 12,
      status: "completed",
      hoursLogged: false
    }
  ]

  const isEventPast = (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    return eventDate < today
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
          </div>
          <Link
            to="/dashboard/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gray-800 hover:bg-gray-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("participated")}
              className={`${
                activeTab === "participated"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Events I've Joined
            </button>
            <button
              onClick={() => setActiveTab("organized")}
              className={`${
                activeTab === "organized"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Events I've Organized
            </button>
          </nav>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {activeTab === "participated" ? (
            participatedEvents.length > 0 ? (
              participatedEvents.map((event) => (
                <div key={event._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex justify-between">
                      <div className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {event.category}
                      </div>
                      <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isEventPast(event.date) 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isEventPast(event.date) ? 'Completed' : 'Upcoming'}
                      </div>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{event.description}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    
                    {isEventPast(event.date) && event.hoursLogged === false && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-md p-2">
                        <p className="text-xs text-yellow-700">
                          Don't forget to log your volunteer hours for this event!
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link
                        to={`/dashboard/events/${event._id}`}
                        className="font-medium text-primary hover:text-primary-dark"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-white p-6 text-center shadow rounded-lg">
                <p className="text-gray-500">You haven't joined any events yet.</p>
                <Link
                  to="/dashboard/events"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900"
                >
                  Find events to join
                </Link>
              </div>
            )
          ) : (
            // Organized events
            organizedEvents.length > 0 ? (
              organizedEvents.map((event) => (
                <div key={event._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex justify-between">
                      <div className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {event.category}
                      </div>
                      <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isEventPast(event.date) 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isEventPast(event.date) ? 'Completed' : 'Upcoming'}
                      </div>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{event.description}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>{event.attending.length} attendees</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link
                        to={`/dashboard/events/${event._id}`}
                        className="font-medium text-primary hover:text-primary-dark"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-white p-6 text-center shadow rounded-lg">
                <p className="text-gray-500">You haven't organized any events yet.</p>
                <Link
                  to="/dashboard/events/create"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900"
                >
                  Create your first event
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default MyEvents
