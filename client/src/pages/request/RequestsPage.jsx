import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Clock, Filter, Plus } from "lucide-react"
import helpRequestService from "../../services/requestService"
import { CATEGORY } from "../../constants/category"
import { URGENCY } from "../../constants/urgency"

const HelpRequestsPage = () => {
  const [helpRequests, setHelpRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    urgency: "",
    category: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const requestsData = await helpRequestService.getAllHelpRequests(filters)
        setHelpRequests(requestsData)
      } catch (error) {
        console.error("Error fetching help requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHelpRequests()
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
      urgency: "",
      category: "",
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
        <h1 className="text-2xl font-semibold text-gray-900">Community Help Requests</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <Link
            to="/dashboard/help-requests/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Request
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 bg-white p-4 shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                Urgency
              </label>
              <select
                id="urgency"
                name="urgency"
                value={filters.urgency}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="">All Urgency Levels</option>
                {URGENCY.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
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

      {/* Help Requests List */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {helpRequests
            .filter(
              (request) =>
                (!filters.urgency || request.urgency === filters.urgency) &&
                (!filters.category || request.category === filters.category),
            )
            .map((request) => (
              <li key={request._id}>
                <Link to={`/dashboard/help-requests/${request._id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {!request.is_open ?
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600 text-red-100">
                            Closed
                          </p>
                          : <></>
                        }
                        <p className="text-sm font-medium text-primary truncate">{request.title}</p>
                      </div>
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
                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>Posted {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-gray-500">Category: {request.category}</span>
                      <span className="text-sm text-gray-500">
                        {request.comments.length} {request.comments.length === 1 ? "comment" : "comments"}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {helpRequests.length === 0 && (
        <div className="mt-6 bg-white p-6 text-center shadow rounded-lg">
          <p className="text-gray-500">No help requests found. Try adjusting your filters or post a new request.</p>
        </div>
      )}
    </div>
  )
}

export default HelpRequestsPage

