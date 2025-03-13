import api from "./api";

const eventService = {

  async getAllEvents() {
    try {
      const response = await api.get("/event/all")
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
  }
}

export default eventService;