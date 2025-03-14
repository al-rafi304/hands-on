import { useState } from "react"
import { useNavigate } from "react-router-dom"
import eventService from "../../services/eventService"
import toast from "react-hot-toast"

const CreateEvent = () => {
  console.log("CreateEvent")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
  })

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
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.category
    ) {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      // Combine date and time into ISO format
      const dateTimeString = `${formData.date}T${formData.time}:00`
      const dateObj = new Date(dateTimeString)

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: dateObj,
        location: formData.location,
        category: formData.category,
      }

      await eventService.createEvent(eventData)
      toast.success("Event created successfully!")
      navigate("/dashboard/events")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <p className="mt-1 text-sm text-gray-500">Fill in the details below to create a new volunteer event.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Give your event a clear, descriptive title"
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
                placeholder="Describe what volunteers will be doing and the impact they'll make"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
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
                placeholder="Where will this event take place?"
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

            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={() => navigate("/dashboard/events")}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent

