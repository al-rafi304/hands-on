import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-block px-6 py-2 mt-6 text-white bg-gray-800 rounded-md hover:bg-primary-dark">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound

