import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import eventService from "../../services/eventService"
import { Calendar, MapPin, Users, ArrowLeft, Clock, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../contexts/AuthContext"

const EventDetails = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [verificationRequests, setVerificationRequests] = useState([])
  const [isLoggingHours, setIsLoggingHours] = useState(false)
  const [hours, setHours] = useState("")
  const [isVerifying, setIsVerifying] = useState({})

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true)
        const eventData = await eventService.getEventById(eventId)
        setEvent(eventData)
        setHasJoined(eventData.attending.includes(currentUser._id))

        // If the event has ended and the user has joined, fetch verification requests
        if (isEventPast(eventData.date) && eventData.attending.includes(currentUser._id)) {
          console.log('fetching req')
          const verifications = await eventService.getVerificationRequests(eventId)
          console.log(verifications)
          setVerificationRequests(verifications || [])
        }
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

  const handleLogHours = async (e) => {
    e.preventDefault()

    if (!hours || isNaN(hours) || Number.parseFloat(hours) <= 0) {
      toast.error("Please enter a valid number of hours")
      return
    }

    setIsLoggingHours(true)
    try {
      await eventService.logVolunteerHours(eventId, Number.parseFloat(hours))
      toast.success("Your volunteer hours have been submitted for verification")

      // Update the verification requests
      const verifications = await eventService.getVerificationRequests(eventId)
      setVerificationRequests(verifications || [])

      // Reset the form
      setHours("")
    } catch (error) {
      console.error("Error logging volunteer hours:", error)
      toast.error("Failed to log volunteer hours")
    } finally {
      setIsLoggingHours(false)
    }
  }

  const handleVerify = async (verificationId) => {
    setIsVerifying((prev) => ({ ...prev, [verificationId]: true }))
    try {
      await eventService.verifyHours(verificationId)

      const updatedRequests = verificationRequests
        .map((req) => (req._id === verificationId ? { ...req, hasVerified: true, peerVerifications: [...req.peerVerifications, currentUser._id] } : req))
        .filter((req) => req.peerVerifications.length < 3)

      setVerificationRequests(updatedRequests)
      toast.success("Hours verified successfully")
    } catch (error) {
      console.error("Error verifying hours:", error)
      toast.error("Failed to verify hours")
    } finally {
      setIsVerifying((prev) => ({ ...prev, [verificationId]: false }))
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

  const isEventPast = (dateString) => {
    const eventDate = new Date(dateString)
    const today = new Date()
    return eventDate < today
  }

  const hasUserLoggedHours = () => {
    return verificationRequests.some((req) => req.user._id === currentUser?._id)
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
  const isPastEvent = isEventPast(eventData.date)
  const isOrganizer = currentUser?._id === eventData.organizer._id
  const verificationRequestsData = verificationRequests

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/events")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Event Image */}
          <div className="w-full h-64 bg-gray-300 relative">
            <img
              src={eventData.imageUrl || "/placeholder.svg?height=300&width=600"}
              alt=''
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-800 shadow">
                {eventData.category}
              </span>
            </div>
            {isPastEvent && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-medium shadow">
                  Event Completed
                </span>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{eventData.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Organized by {eventData.organizer.name}</p>
              </div>
              <div className="mt-4 md:mt-0">
                {!isPastEvent && (
                  <button
                    onClick={handleJoinLeave}
                    disabled={joining}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                      hasJoined
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-800 hover:bg-gray-900 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50`}
                  >
                    {joining ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        {hasJoined ? "Leaving..." : "Joining..."}
                      </span>
                    ) : (
                      <span>{hasJoined ? "Leave Event" : "Join Event"}</span>
                    )}
                  </button>
                )}
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
              {/* <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gray-800 h-2.5 rounded-full"
                  style={{
                    width: `${
                      eventData.maxAttendees ? Math.min(100, (eventData.attendees / eventData.maxAttendees) * 100) : 50
                    }%`,
                  }}
                ></div>
              </div> */}
            </div>

            {/* Log Volunteer Hours Section - Only show if event is past and user participated */}
            {isPastEvent && hasJoined && !hasUserLoggedHours() && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Log Your Volunteer Hours</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please log the number of hours you volunteered at this event. Your submission will be verified by
                  other participants.
                </p>
                <form onSubmit={handleLogHours} className="mt-4">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                        Hours Volunteered
                      </label>
                      <input
                        type="number"
                        id="hours"
                        name="hours"
                        min="0.5"
                        step="0.5"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Enter hours (e.g., 3.5)"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoggingHours}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                      {isLoggingHours ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Hours"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Verification Requests Section - Only show if event is past and user participated */}
            {isPastEvent && hasJoined && verificationRequestsData.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Verification Requests</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please help verify the volunteer hours of other participants. Each request needs 3 verifications.
                </p>
                <div className="mt-4 space-y-4">
                  {verificationRequestsData.map((request) => (
                    <div key={request._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{request.user.name}</p>
                          <p className="text-sm text-gray-500">
                            Logged {request.hours} {request.hours === 1 ? "hour" : "hours"} on{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-3">
                            {request.peerVerifications.length}/3 verifications
                          </span>
                          {request.user._id !== currentUser?._id && !request.hasVerified && (
                            <button
                              onClick={() => handleVerify(request._id)}
                              disabled={isVerifying[request._id]}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              {isVerifying[request._id] ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                              ) : (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              Verify
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${(request.peerVerifications.length / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails

