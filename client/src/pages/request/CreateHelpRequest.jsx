import { useState } from "react"
import { useNavigate } from "react-router-dom"
import helpRequestService from "../../services/requestService"
import { CATEGORY } from "../../constants/category"
import { URGENCY } from "../../constants/urgency"
import toast from "react-hot-toast"
import { ArrowLeft } from "lucide-react"

const CreateHelpRequest = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    urgency: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }))
  }

  const handleUrgencySelect = (urgency) => {
    setFormData((prev) => ({
      ...prev,
      urgency,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.location || !formData.category || !formData.urgency) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        urgency: formData.urgency,
      }

      await helpRequestService.createHelpRequest(requestData)
      toast.success("Help request created successfully!")
      navigate("/dashboard/help-requests")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create help request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300"
      case "Low":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
    }
  }

  const getSelectedUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-600 text-white"
      case "Medium":
        return "bg-yellow-600 text-white"
      case "Low":
        return "bg-green-600 text-white"
      default:
        return "bg-primary text-white"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/help-requests")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Help Requests
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Help Request</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to create a new help request. Be specific about what you need help with.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Give your help request a clear, descriptive title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Describe what you need help with in detail. Include any requirements or qualifications needed."
              ></textarea>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Where is help needed? (e.g., city, neighborhood, specific address)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      formData.category === category
                        ? "bg-gray-800 border border-gray-800 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {!formData.category && <p className="mt-2 text-sm text-red-500">Please select a category</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
              <div className="flex flex-wrap gap-2">
                {URGENCY.map((urgency) => (
                  <button
                    key={urgency}
                    type="button"
                    onClick={() => handleUrgencySelect(urgency)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      formData.urgency === urgency ? getSelectedUrgencyColor(urgency) : getUrgencyColor(urgency)
                    }`}
                  >
                    {urgency}
                  </button>
                ))}
              </div>
              {!formData.urgency && <p className="mt-2 text-sm text-red-500">Please select an urgency level</p>}
            </div>

            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={() => navigate("/dashboard/help-requests")}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Help Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateHelpRequest

