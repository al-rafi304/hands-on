import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import helpRequestService from "../../services/requestService"
import commentService from "../../services/commentService"
import { useAuth } from "../../contexts/AuthContext"
import { MapPin, Clock, ArrowLeft, ThumbsUp, Send, User } from "lucide-react"
import toast from "react-hot-toast"

const HelpRequestDetails = () => {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [helpRequest, setHelpRequest] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState({})

  useEffect(() => {
    const fetchHelpRequestDetails = async () => {
      try {
        setLoading(true)
        const helpRequestData = await helpRequestService.getHelpRequestById(requestId)
        setHelpRequest(helpRequestData)

        const commentsData = await commentService.getComments(requestId)
        setComments(commentsData)
      } catch (error) {
        console.error("Error fetching help request details:", error)
        toast.error("Failed to load help request details")
      } finally {
        setLoading(false)
      }
    }

    fetchHelpRequestDetails()
  }, [requestId])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setCommentLoading(true)
    try {
      const response = await commentService.addComment(requestId, newComment)
      var resData = response.comment
      resData.user = { _id: resData.user, name: currentUser.name }
      setComments([response.comment, ...comments])
      setNewComment("")
      toast.success("Comment added successfully")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setCommentLoading(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    setLikeLoading((prev) => ({ ...prev, [commentId]: true }))
    try {
      await commentService.likeComment(commentId)
      setComments(
        comments.map((comment) => (comment._id === commentId ? { ...comment, likes: comment.likes + 1, has_liked: true } : comment)),
      )
    } catch (error) {
      console.error("Error liking comment:", error)
      // toast.error("Failed to like comment")
    } finally {
      setLikeLoading((prev) => ({ ...prev, [commentId]: false }))
    }
  }

  const handleUnlikeComment = async (commentId) => {
    setLikeLoading((prev) => ({ ...prev, [commentId]: true }))
    try {
      await commentService.unlikeComment(commentId)
      setComments(
        comments.map((comment) => (comment._id === commentId ? { ...comment, likes: comment.likes - 1, has_liked: false } : comment)),
      )
    } catch (error) {
      console.error("Error unliking comment:", error)
      // toast.error("Failed to unlike comment")
    } finally {
      setLikeLoading((prev) => ({ ...prev, [commentId]: false }))
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  // Fallback for when the help request doesn't exist or there was an error
  if (!helpRequest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Help Request Not Found</h1>
            <p className="text-gray-500 mb-6">The help request you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate("/dashboard/help-requests")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Requests
            </button>
          </div>
        </div>
      </div>
    )
  }


  // Use simulated data for development
  const helpRequestData = helpRequest
  const commentsData = comments

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/help-requests")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Help Requests
          </button>
        </div>

        {/* Help Request Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{helpRequestData.title}</h1>
                  <span
                    className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${getUrgencyColor(helpRequestData.urgency)}`}
                  >
                    {helpRequestData.urgency} Urgency
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Posted by {helpRequestData.user.name}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${helpRequestData.is_open ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {helpRequestData.is_open ? "Open" : "Closed"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">{helpRequestData.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Posted on</p>
                  <p className="text-sm text-gray-900">{formatDate(helpRequestData.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Description</h2>
              <div className="mt-2 text-gray-600 space-y-4">
                <p>{helpRequestData.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <span className="text-sm text-gray-600">
                  Category: <span className="font-medium">{helpRequestData.category}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Comments ({commentsData.length})</h2>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="relative">
                    <textarea
                      id="comment"
                      name="comment"
                      rows="3"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                      {commentLoading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Posting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          Post
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {commentsData.length > 0 ? (
                commentsData.map((comment) => (
                  <div key={comment._id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-500">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 sm:px-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => comment.has_liked ? handleUnlikeComment(comment._id) : handleLikeComment(comment._id)}
                          disabled={likeLoading[comment._id]}
                          className="inline-flex items-center text-sm text-gray-500 hover:text-primary"
                        >
                          {likeLoading[comment._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                          ) : (
                            <>
                              {comment.has_liked ?
                                <ThumbsUp className="h-4 w-4 mr-1 fill-gray-500" />
                                : <ThumbsUp className="h-4 w-4 mr-1" />}
                              <span>{comment.likes}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpRequestDetails

