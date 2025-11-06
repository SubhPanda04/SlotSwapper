import { useState, useEffect } from "react"
import axios from "axios"

const Marketplace = () => {
  const [slots, setSlots] = useState([])
  const [userSlots, setUserSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  useEffect(() => {
    fetchSlots()
    fetchUserSlots()
  }, [])

  const fetchSlots = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/swaps/swappable-slots`)
    setSlots(res.data)
  }

  const fetchUserSlots = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`)
    setUserSlots(res.data.filter((event) => event.status === "SWAPPABLE"))
  }

  const handleRequestSwap = async (theirSlotId, mySlotId) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/swaps/swap-request`, { mySlotId, theirSlotId })
    alert("Swap request sent")
    fetchSlots()
    fetchUserSlots()
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
          Marketplace
        </h1>

        {/* Navigation */}
        <nav className="mb-12 flex gap-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 w-fit">
          <a href="/dashboard" className="text-purple-200 hover:text-white transition-colors duration-200 font-medium">
            Dashboard
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/notifications"
            className="text-purple-200 hover:text-white transition-colors duration-200 font-medium"
          >
            Notifications
          </a>
        </nav>

        {/* Available Slots Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Available Slots</h3>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
            {slots.length === 0 ? (
              <p className="text-gray-300 text-center py-8">No available slots at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200"
                  >
                    <h4 className="text-lg font-semibold text-white mb-2">{slot.title}</h4>
                    <p className="text-sm text-purple-200 mb-3">
                      {new Date(slot.startTime).toLocaleString()} to {new Date(slot.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-300 mb-4">
                      By: <span className="text-cyan-400 font-medium">{slot.userId.name}</span>
                    </p>
                    <button
                      onClick={() => setSelectedSlot(slot)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      Request Swap
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap Request Modal */}
        {selectedSlot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md w-full">
              <h4 className="text-xl font-bold text-white mb-4">Select Your Slot to Offer</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                {userSlots.length === 0 ? (
                  <p className="text-gray-300 text-center py-4">You don't have any swappable slots.</p>
                ) : (
                  userSlots.map((mySlot) => (
                    <div key={mySlot._id} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3">
                      <h5 className="text-white font-medium mb-1">{mySlot.title}</h5>
                      <p className="text-xs text-purple-200 mb-3">
                        {new Date(mySlot.startTime).toLocaleString()} to {new Date(mySlot.endTime).toLocaleString()}
                      </p>
                      <button
                        onClick={() => {
                          handleRequestSwap(selectedSlot._id, mySlot._id)
                          setSelectedSlot(null)
                        }}
                        className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                      >
                        Offer This Slot
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace
