import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import eventService from "../../services/eventService"
import { useAuth } from "../../contexts/AuthContext"
import { Calendar, MapPin, Users, ArrowLeft, Clock } from "lucide-react"
import toast from "react-hot-toast"

const EventDetails = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)
        const eventData = await eventService.getEventById(eventId)
        setEvent(eventData)

        setHasJoined(eventData.attending.includes(currentUser._id) || false)
      } catch (error) {
        console.error("Error fetching event details:", error)
        toast.error("Failed to load event details")
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [eventId])

  const handleJoinLeave = async () => {
    try {
      setJoining(true)
      if (hasJoined) {
        await eventService.leaveEvent(eventId)
        toast.success("You have left this event")
        setHasJoined(false)
      } else {
        await eventService.joinEvent(eventId)
        toast.success("You have joined this event!")
        setHasJoined(true)
      }
    } catch (error) {
      console.error("Error joining/leaving event:", error)
      toast.error(hasJoined ? "Failed to leave event" : "Failed to join event")
    } finally {
      setJoining(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  // Fallback for when the event doesn't exist or there was an error
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-500 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/dashboard/events")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gray-800 hover:bg-gray-950"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  const eventData = event

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Event Image */}
          <div className="w-full h-64 bg-gray-300 relative">
            <img
              src={eventData.imageUrl || "/placeholder.svg?height=300&width=600"}
              alt={eventData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-800 shadow">
                {eventData.category}
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{eventData.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Organized by {eventData.organizer.name}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleJoinLeave}
                  disabled={joining || new Date(eventData.date) < new Date()}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold ${hasJoined ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-800 hover:bg-primary-dark text-white"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50`}
                >
                  {new Date(eventData.date) < new Date() ? (
                    <span className="flex items-center">
                      Event Ended
                    </span>
                  ) : (
                    joining ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        {hasJoined ? "Leaving..." : "Joining..."}
                      </span>
                    ) : (
                      <span>{hasJoined ? "Leave Event" : "Join Event"}</span>
                    ))}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">{formatDate(eventData.date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-sm text-gray-900">{formatTime(eventData.date)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">{eventData.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">About this event</h2>
              <div className="mt-2 text-gray-600 space-y-4">
                <p>{eventData.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {eventData.attending.length} people have joined
                  {/* {eventData.maxAttendees && ` (${eventData.maxAttendees - eventData.attendees} spots left)`} */}
                </span>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{
                    width: `${eventData.maxAttendees ? Math.min(100, (eventData.attendees / eventData.maxAttendees) * 100) : 50
                      }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => navigate("/dashboard/events")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails

