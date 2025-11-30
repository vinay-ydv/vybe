import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { RxCross1 } from "react-icons/rx";
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/userContext'
import { useNotification } from '../context/NotificationContext'

function Notification() {
  let { serverUrl } = useContext(authDataContext)
  let [notificationData, setNotificationData] = useState([])
  let { userData } = useContext(userDataContext)
  const { fetchNotificationCount } = useNotification()

  const handleGetNotification = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/notification/get", { withCredentials: true })
      setNotificationData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handledeleteNotification = async (id) => {
    try {
      await axios.delete(serverUrl + `/api/notification/deleteone/${id}`, { withCredentials: true })
      await handleGetNotification()
      fetchNotificationCount()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClearAllNotification = async () => {
    try {
      await axios.delete(serverUrl + "/api/notification", { withCredentials: true })
      await handleGetNotification()
      fetchNotificationCount()
    } catch (error) {
      console.log(error)
    }
  }

  const handleMessage = (type) => {
    if (type === "like") {
      return "liked your post"
    } else if (type === "comment") {
      return "commented on your post"
    } else {
      return "Accept your connection"
    }
  }

  useEffect(() => {
    handleGetNotification()
  }, [])

  return (
    <div className="w-screen min-h-[100vh] bg-[#09111f] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]">
      <Nav />

      {/* TOP BAR */}
      <div className="w-[90%] lg:w-[60%] h-[70px] lg:ml-[190px] lg:h-[100px]
          bg-[#081937] shadow-xl rounded-lg flex items-center p-[15px]
          text-[22px] text-gray-200 justify-between border border-[#2a384f]">

        <div>
          Notifications {notificationData.length}
        </div>

        {notificationData.length > 0 && (
          <button
            onClick={handleClearAllNotification}
            className="min-w-[100px] h-[40px] rounded-full border-2 border-red-500
                  text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200">
            Clear All
          </button>
        )}
      </div>

      {/* NOTIFICATION LIST */}
      {notificationData.length > 0 && (
        <div className="w-[90%] lg:w-[60%] max-w-[900px] bg-transparent
            lg:ml-[190px] flex flex-col gap-[20px] min-h-[100px]">

          {notificationData.map((noti, index) => (
            <div
              key={index}
              className="
                w-full min-h-[90px] p-[18px]
                flex justify-between items-center
                bg-[#1a1d22]/90 backdrop-blur-md
                rounded-xl shadow-lg border border-[#2d323b]
                hover:shadow-blue-500/20 hover:border-blue-400
                hover:bg-[#1f2430] transition-all duration-300
              "
            >
              <div className="flex items-center gap-[15px]">

                {/* USER DP */}
                <div className="w-[55px] h-[55px] rounded-full overflow-hidden cursor-pointer 
                      border-[3px] border-blue-500 shadow-md">
                  <img src={noti.relatedUser.profileImage || dp} className="w-full h-full object-cover" />
                </div>

                {/* MESSAGE */}
                <div>
                  <div className="text-[17px] font-semibold text-gray-200 leading-tight">
                    {`${noti.relatedUser.firstName} ${noti.relatedUser.lastName} ${handleMessage(noti.type)}`}
                  </div>

                  {/* POST IF EXISTS */}
                  {noti.relatedPost && (
                    <div className="flex items-center gap-[10px] mt-[6px]">

                      <div className="w-[65px] h-[50px] overflow-hidden rounded-lg border border-[#2d323b]">
                        <img
                          src={noti.relatedPost.image}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="text-gray-400 text-sm max-w-[250px] truncate">
                        {noti.relatedPost.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DELETE ICON */}
              <RxCross1
                onClick={() => handledeleteNotification(noti._id)}
                className="w-[25px] h-[25px] text-gray-400 cursor-pointer
                      hover:text-red-500 transition"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notification
