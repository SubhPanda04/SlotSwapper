import { useState, useEffect, useContext } from "react"
import axios from "axios"
import AuthContext from "../context/AuthContext"

const Dashboard = () => {
  const [events, setEvents] = useState([])
  const [newEvent, setNewEvent] = useState({ title: "", startTime: "", endTime: "" })
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`)
    setEvents(res.data)
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, newEvent)
    setNewEvent({ title: "", startTime: "", endTime: "" })
    fetchEvents()
  }

  const handleToggleSwappable = async (id, currentStatus) => {
    const newStatus = currentStatus === "BUSY" ? "SWAPPABLE" : "BUSY"
    await axios.put(`${process.env.REACT_APP_API_URL}/api/events/${id}`, { status: newStatus })
    fetchEvents()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white">
            Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>

        {/* Navigation */}
        <nav className="mb-12 flex gap-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 w-fit">
          <a
            href="/marketplace"
            className="text-purple-200 hover:text-white transition-colors duration-200 font-medium"
          >
            Marketplace
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/notifications"
            className="text-purple-200 hover:text-white transition-colors duration-200 font-medium"
          >
            Notifications
          </a>
        </nav>

        {/* Your Events Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Your Events</h3>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            {events.length === 0 ? (
              <p className="text-gray-300 text-center py-8">No events yet. Create one to get started!</p>
            ) : (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li
                    key={event._id}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                        <p className="text-sm text-purple-200 mt-1">
                          {new Date(event.startTime).toLocaleString()} to {new Date(event.endTime).toLocaleString()}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                          {event.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleSwappable(event._id, event.status)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                      >
                        {event.status === "BUSY" ? "Make Swappable" : "Make Busy"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Create New Event Form */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Create New Event</h3>
          <form
            onSubmit={handleCreateEvent}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6"
          >
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="datetime-local"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <input
                    type="datetime-local"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
