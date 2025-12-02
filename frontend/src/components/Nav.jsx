import { useContext, useEffect, useState } from "react"
import vvybe from "../assets/vvybe.png"
import { IoSearchSharp } from "react-icons/io5"
import { TiHome } from "react-icons/ti"
import { FaFacebookMessenger, FaUserGroup } from "react-icons/fa6"
import { IoNotificationsSharp } from "react-icons/io5"
import dp from "../assets/dp.webp"
import { userDataContext } from "../context/UserContext"
import { authDataContext } from "../context/AuthContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useConnection } from "../context/ConnectionContext"
import { useNotification } from "../context/NotificationContext"

function Nav() {
  const [activeSearch, setActiveSearch] = useState(false)
  const { userData, setUserData, handleGetProfile } = useContext(userDataContext)
  const navigate = useNavigate()
  const { serverUrl } = useContext(authDataContext)
  const [searchInput, setSearchInput] = useState("")
  const [searchData, setSearchData] = useState([])

  const { pendingRequests } = useConnection()
  const { notificationCount } = useNotification()

  const handleSignOut = async () => {
  try {
    // Call backend logout
    await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
    
    // Clear frontend state
    setUserData(null)
    
    // Clear any storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Navigate with replace to prevent back button
    navigate("/login", { replace: true })
    
  } catch (error) {
    console.log("Logout error:", error)
    // Even on error, clear frontend
    setUserData(null)
    localStorage.clear()
    sessionStorage.clear()
    navigate("/login", { replace: true })
  }
}


  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchData([])
      return
    }
    try {
      const result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true })
      setSearchData(result.data)
    } catch (error) {
      setSearchData([])
      console.log(error)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchInput])

  // FIXED: Add null check for userData
  if (!userData) {
    return null
  }

  return (
    <>
      {/* MOBILE TOP NAV */}
      <div className="w-full h-[60px] bg-[#070707] fixed top-0 left-0 z-[120] flex lg:hidden items-center justify-between px-4 shadow-lg shadow-blue-300/50">
        <img
          src={vvybe}
          alt="logo"
          className="w-[60px] h-[50px] ml-2 cursor-pointer drop-shadow-[0_5px_2px_white] "
          onClick={() => {
            setActiveSearch(false)
            navigate("/")
          }}
        />

        <button
          onClick={handleSignOut}
          className="px-3 py-1 rounded-full border-2 border-blue-500 text-blue-400 font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 mr-3"
        >
          Logout
        </button>
      </div>

      <div className="fixed left-0 top-[60px] lg:top-0 h-full w-[70px] lg:w-[300px] bg-[#02010c] shadow-lg shadow-blue-900 z-[100] flex-col justify-between py-5 hidden lg:flex">
        <div className="flex flex-col items-center lg:items-start w-full px-3 gap-6">
          <img
            src={vvybe}
            alt=""
            onClick={() => {
              setActiveSearch(false)
              navigate("/")
            }}
            className="w-[45px] lg:w-[120px] cursor-pointer items-center justify-center ml-12 mt-3 drop-shadow-[0_5px_2px_white]"
          />

          {/* Search Bar */}
          <div className="hidden lg:flex w-full h-[40px] bg-[#2a2a2a] items-center px-3 rounded-md border border-gray-700">
            <IoSearchSharp className="text-gray-400 w-[20px] h-[20px]" />
            <input
              className="w-full ml-2 bg-transparent outline-none text-gray-200 placeholder-gray-500"
              placeholder="search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Search dropdown */}
          {searchData.length > 0 && (
            <div className="absolute top-[80px] left-[70px] lg:left-[250px] h-[500px] w-[300px] bg-[#2a2a2a] shadow-lg shadow-blue-900/30 rounded-lg p-4 overflow-auto z-[200] border border-gray-700">
              {searchData.map((sea) => (
                <div
                  key={sea._id}
                  className="flex items-center gap-4 p-3 border-b border-gray-700 cursor-pointer hover:bg-[#3a3a3a] transition-colors"
                  onClick={() => handleGetProfile(sea.userName)}
                >
                  <img src={sea.profileImage || dp} className="w-[50px] h-[50px] rounded-full" />
                  <div>
                    <div className="text-lg font-semibold text-gray-200">
                      {sea.firstName} {sea.lastName}
                    </div>
                    <div className="text-sm text-gray-400">{sea.headline}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sidebar Buttons */}
          <div className="flex flex-col gap-6 text-gray-300 w-full px-1 lg:px-3">
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => navigate("/")}
            >
              <TiHome className="w-[30px] h-[30px]" />
              <span className="hidden lg:block font-semibold text-lg">Home</span>
            </div>
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => navigate("/messages")}
            >
              <FaFacebookMessenger className="w-[25px] h-[25px]" />
              <span className="hidden lg:block font-semibold text-lg">Messages</span>
            </div>

            {/* Friends icon with red dot */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => navigate("/network")}
            >
              <div className="relative">
                <FaUserGroup className="w-[25px] h-[25px]" />
                {pendingRequests > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border border-[#02010c]" />
                )}
              </div>
              <span className="hidden lg:block font-semibold text-lg">Friends</span>
            </div>

            {/* Notifications icon with red dot */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => navigate("/notification")}
            >
              <div className="relative">
                <IoNotificationsSharp className="w-[25px] h-[25px]" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border border-[#02010c]" />
                )}
              </div>
              <span className="hidden lg:block font-semibold text-lg">Notifications</span>
            </div>
          </div>
        </div>

        {/* User Profile Icon - FIXED */}
        <div className="hidden lg:flex items-center justify-between px-3 pb-5 w-full">
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => userData && handleGetProfile(userData.userName)}
          >
            <img src={userData?.profileImage || dp} className="w-[45px] h-[45px] rounded-full object-cover" />
            <span className="font-semibold text-lg text-gray-200">{userData?.firstName}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="px-2 py-1 rounded-full border-2 border-blue-500 text-blue-400 font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="w-full h-[60px] bg-[#1a1a1a] fixed bottom-[-1px] left-0 z-[90] flex lg:hidden justify-around items-center shadow-[0_-2px_10px_rgba(59,130,246,0.2)]">
        <div
          className="flex flex-col items-center justify-center cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
          onClick={() => navigate("/")}
        >
          <TiHome className="w-[26px] h-[26px]" />
        </div>
        <div
          className="flex flex-col items-center justify-center cursor-pointer text-gray-300 hover:text-blue-400 transition-colors"
          onClick={() => navigate("/messages")}
        >
          <FaFacebookMessenger className="w-[26px] h-[26px]" />
        </div>

        {/* Friends mobile icon with red dot */}
        <div
          className="flex flex-col items-center justify-center cursor-pointer text-gray-300 hover:text-blue-400 transition-colors relative"
          onClick={() => navigate("/network")}
        >
          <FaUserGroup className="w-[26px] h-[26px]" />
          {pendingRequests > 0 && (
            <span className="absolute top-1 right-0 h-3 w-3 rounded-full bg-red-500 border border-[#1a1a1a]" />
          )}
        </div>

        {/* Notifications mobile icon with red dot */}
        <div
          className="flex flex-col items-center justify-center cursor-pointer text-gray-300 hover:text-blue-400 transition-colors relative"
          onClick={() => navigate("/notification")}
        >
          <IoNotificationsSharp className="w-[26px] h-[26px]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-0 h-3 w-3 rounded-full bg-red-500 border border-[#1a1a1a]" />
          )}
        </div>

        {/* FIXED: Mobile profile with null check */}
        <div
          className="w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer"
          onClick={() => userData && handleGetProfile(userData.userName)}
        >
          <img src={userData?.profileImage || dp} className="w-full h-full object-cover" />
        </div>
      </div>
    </>
  )
}

export default Nav
