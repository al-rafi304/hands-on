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

  async getOrganizedEvents() {
    try {
      const response = await api.get("/event/organized")
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
  },
  
  async logVolunteerHours(eventId, hours) {
    try {
      const response = await api.post(`/event/${eventId}/log-hours`, { hours })
      return response.data
    } catch (error) {
      throw error
    }
  },

  
  async getVerificationRequests(eventId) {
    try {
      const response = await api.get(`/event/${eventId}/verifications`)
      return response.data.logs
    } catch (error) {
      throw error
    }
  },

  
  async verifyHours(verificationId) {
    try {
      const response = await api.post(`/log/${verificationId}/verify`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default eventService;