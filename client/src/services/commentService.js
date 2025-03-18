import api from "./api";

const commentService = {

  async getComments(requestId) {
    try {
      const response = await api.get(`/comment/${requestId}`)
      return response.data.comments
    } catch (error) {
      throw error
    }
  },

  async addComment(requestId, comment) {
    try {
      const response = await api.post(`/comment/${requestId}`, {text: comment})
      return response.data
    } catch (error) {
      throw error
    }
  },

  async likeComment(commentId) {
    try {
      const response = await api.post(`/like/${commentId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default commentService;