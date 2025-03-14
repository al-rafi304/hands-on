import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, MapPin, Filter, Plus } from "lucide-react"
import eventService from "../../services/eventService"

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "",
    location: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  const CATEGORY = [
    "Education",
    "Healthcare",
    "Environment",
    "Human Rights",
    "Mental Health",
    "Arts & Culture",
    "Animal Welfare",
    "Disaster Relief",
    "Technology for Good",
    "Poverty Alleviation",
    "Community Development",
];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await eventService.getAllEvents(filters)
        setEvents(eventsData)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      location: "",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Volunteer Events</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <Link
            to="/dashboard/events/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gray-800 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 bg-white p-4 shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All Categories</option>
                {CATEGORY.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
              </input>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events
          .map((event) => (
            <div key={event.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex justify-between">
                  <div className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {event.category}
                  </div>
                  <div className="text-sm text-gray-500">{event.attending.length} attendees</div>
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
                <div className="mt-2 text-sm text-gray-500">Organized by: {event.organizer}</div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to={`/dashboard/events/${event.id}`}
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>

      {events.length === 0 && (
        <div className="mt-6 bg-white p-6 text-center shadow rounded-lg">
          <p className="text-gray-500">No events found. Try adjusting your filters or create a new event.</p>
        </div>
      )}
    </div>
  )
}

export default EventsPage

