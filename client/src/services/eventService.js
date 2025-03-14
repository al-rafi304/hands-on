import api from "./api";

const eventService = {

  async getAllEvents(filters = {}) {
    try {
      if (filters.category === "") {
        delete filters.category
      }
      if (filters.location === "") {
        delete filters.location
      }
      const response = await api.get("/event/all", { params: filters })
      return response.data.events
    } catch (error) {
      throw error
    }
  },

  async getAttendingEvents() {
    try {
      const response = await api.get("/event")
      return response.data.events
    } catch (error) {
      throw error
    }
  },

  async createEvent(eventData) {
    try {
      const response = await api.post("/event", eventData)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default eventService;