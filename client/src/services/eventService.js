import api from "./api";

const eventService = {

  async getEventById(eventId) {
    try {
      const response = await api.get(`/event/${eventId}`)
      return response.data.event
    } catch (error) {
      throw error
    }
  },

  async getAllEvents(filters = {}) {
    try {
      if (filters.category === "") {
        delete filters.category
      }
      if (filters.location === "") {
        delete filters.location
      }
      const response = await api.get("/event", { params: filters })
      return response.data.events
    } catch (error) {
      throw error
    }
  },

  async getAttendingEvents() {
    try {
      const response = await api.get("/event/attending")
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

  async joinEvent(eventId) {
    try {
      const response = await api.post(`/event/${eventId}/join`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async leaveEvent(eventId) {
    try {
      const response = await api.post(`/event/${eventId}/leave`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default eventService;