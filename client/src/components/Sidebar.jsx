import { Link, useLocation } from "react-router-dom"
import { Home, Calendar, HelpCircle, Users, Award, Settings } from "lucide-react"

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    { name: "Overview", icon: Home, path: "/dashboard" },
    { name: "Events", icon: Calendar, path: "/dashboard/events" },
    { name: "Help Requests", icon: HelpCircle, path: "/dashboard/help-requests" },
    { name: "Impact", icon: Award, path: "/dashboard/impact" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ]

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-white text-xl font-bold">HandsOn</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  isActive(item.path) ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    isActive(item.path) ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300"
                  } mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

