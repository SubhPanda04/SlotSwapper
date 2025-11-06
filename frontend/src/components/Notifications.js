import { useState, useEffect } from "react"
import axios from "axios"

const Notifications = () => {
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const incomingRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/swaps/incoming`)
    const outgoingRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/swaps/outgoing`)
    setIncoming(incomingRes.data)
    setOutgoing(outgoingRes.data)
  }

  const handleResponse = async (requestId, accepted) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/swaps/swap-response/${requestId}`, { accepted })
    alert(accepted ? "Swap accepted" : "Swap rejected")
    fetchRequests()
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
        {/* Header */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-12">
          Notifications
        </h1>

        {/* Navigation */}
        <nav className="mb-12 flex gap-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 w-fit">
          <a href="/dashboard" className="text-purple-200 hover:text-white transition-colors duration-200 font-medium">
            Dashboard
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/marketplace"
            className="text-purple-200 hover:text-white transition-colors duration-200 font-medium"
          >
            Marketplace
          </a>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Incoming Requests */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Incoming Requests</h3>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
              {incoming.length === 0 ? (
                <p className="text-gray-300 text-center py-8">No incoming swap requests.</p>
              ) : (
                <ul className="space-y-3">
                  {incoming.map((req) => (
                    <li key={req._id} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white mb-3">
                        <span className="font-semibold text-cyan-400">{req.requesterId.name}</span> wants to swap their{" "}
                        <span className="text-pink-300 font-medium">{req.offeredSlotId.title}</span> for your{" "}
                        <span className="text-purple-300 font-medium">{req.requestedSlotId.title}</span>
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleResponse(req._id, true)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleResponse(req._id, false)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                        >
                          Reject
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Outgoing Requests */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Outgoing Requests</h3>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
              {outgoing.length === 0 ? (
                <p className="text-gray-300 text-center py-8">No outgoing swap requests.</p>
              ) : (
                <ul className="space-y-3">
                  {outgoing.map((req) => (
                    <li key={req._id} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-white mb-2">
                        You requested to swap your{" "}
                        <span className="text-pink-300 font-medium">{req.offeredSlotId.title}</span> for{" "}
                        <span className="text-purple-300 font-medium">{req.requestedSlotId.title}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Status:</span>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            req.status === "PENDING"
                              ? "bg-yellow-500/30 text-yellow-200 border border-yellow-500/50"
                              : req.status === "ACCEPTED"
                                ? "bg-green-500/30 text-green-200 border border-green-500/50"
                                : "bg-red-500/30 text-red-200 border border-red-500/50"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
