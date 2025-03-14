import api from "./api";

const helpRequestService = {

  async getAllHelpRequests(filters = {}) {
    try {
      if (filters.category === "") {
        delete filters.category
      }
      if (filters.location === "") {
        delete filters.location
      }
      const response = await api.get("/request", { params: filters })
      return response.data.helpRequests
    } catch (error) {
      throw error
    }
  },
}

export default helpRequestService;