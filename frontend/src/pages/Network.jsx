import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import dp from "../assets/dp.webp"
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { RiUserUnfollowLine } from "react-icons/ri";
import io from "socket.io-client"
import { userDataContext } from '../context/UserContext'

const socket = io("https://vybe-vnrp.onrender.com")

function Network() {
  const { serverUrl } = useContext(authDataContext)
  const [connections, setConnections] = useState([]) // pending requests
  const [friends, setFriends] = useState([])         // confirmed connections (users array)
  const { handleGetProfile } = useContext(userDataContext)

  const handleGetRequests = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection/requests`,
        { withCredentials: true }
      )
      setConnections(result.data)
    } catch (error) {
      console.log("Requests error:", error)
    }
  }

  const handleGetFriends = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection`,
        { withCredentials: true }
      )
      setFriends(result.data)
    } catch (error) {
      console.log("Friends fetch error:", error)
      setFriends([])
    }
  }

  const handleAcceptConnection = async (requestId) => {
    try {
      await axios.put(
        `${serverUrl}/api/connection/accept/${requestId}`,
        {},
        { withCredentials: true }
      )
      setConnections(prev => prev.filter(con => con._id !== requestId))
      handleGetFriends()
    } catch (error) {
      console.log(error)
    }
  }

  const handleRejectConnection = async (requestId) => {
    try {
      await axios.put(
        `${serverUrl}/api/connection/reject/${requestId}`,
        {},
        { withCredentials: true }
      )
      setConnections(prev => prev.filter(con => con._id !== requestId))
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnfriend = async (friendId) => {
    try {
      await axios.delete(
        `${serverUrl}/api/connection/remove/${friendId}`,
        { withCredentials: true }
      )
      setFriends(prev => prev.filter(friend => friend._id !== friendId))
    } catch (error) {
      console.log("Unfriend error:", error)
    }
  }

  // NEW: Handle profile click
  const handleProfileClick = (friend) => {
    handleGetProfile(friend.userName)
  }

  useEffect(() => {
    handleGetRequests()
    handleGetFriends()
  }, [])

  return ( 
    <div className='w-screen min-h-[100vh] bg-[#0b1020] pt-[100px] px-[20px] flex flex-col items-center gap-[40px] text-gray-100'>
      {/* Pass connections.length as pendingRequests prop */}
      <Nav pendingRequests={connections.length} />

      {/* REQUESTS BAR */}
      <div className='w-[90%] lg:w-[60%] h-[70px] lg:ml-[190px] lg:h-[100px] bg-[#111827] shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-100 border border-[#1f2937]'>
        Requests ({connections.length})
      </div>

      {/* REQUESTS LIST */}
      {connections.length > 0 && (
        <div className='w-[90%] lg:w-[60%] lg:ml-[190px] bg-[#111827] shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px] border border-[#1f2937] p-[20px]'>
          {connections.map((connection, index) => (
            <div
              key={connection._id || index}
              className='w-full min-h-[100px] p-[20px] flex justify-between items-center border-b border-[#1f2937] last:border-b-0'
            >
              <div className='flex items-center gap-[10px]'>
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer bg-gray-700 border-2 border-[#1f2937]'>
                  <img
                    src={connection.sender?.profileImage || dp}
                    alt=""
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='text-[19px] font-semibold text-gray-100'>
                  {`${connection.sender?.firstName || ''} ${connection.sender?.lastName || ''}`}
                </div>
              </div>
              <div className='flex items-center gap-[10px]'>
                <button
                  className='text-[#22c55e] font-semibold hover:scale-110 transition'
                  onClick={() => handleAcceptConnection(connection._id)}
                >
                  <IoIosCheckmarkCircleOutline className='w-[40px] h-[40px]' />
                </button>
                <button
                  className='text-[#f97316] font-semibold hover:scale-110 transition'
                  onClick={() => handleRejectConnection(connection._id)}
                >
                  <RxCrossCircled className='w-[36px] h-[36px]' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FRIENDS SECTION - HORIZONTAL SCROLL */}
      <div className='w-[90%] lg:w-[60%] lg:ml-[190px] bg-[#111827] shadow-lg rounded-lg p-[20px] border border-[#1f2937]'>
        <div className='text-[22px] text-gray-100 font-semibold mb-[20px] flex items-center justify-between'>
          Friends ({friends.length})
          <button
            className='text-[#22c1ff] text-sm hover:underline px-2 py-1 rounded hover:bg-[#22c1ff]/10 transition'
            onClick={handleGetFriends}
          >
            Refresh
          </button>
        </div>

        {friends.length > 0 ? (
          <div className='flex gap-[20px] overflow-x-auto pb-[10px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'>
            {friends.map((friend, index) => (
              <div
                key={friend._id || index}
                className='flex items-center w-[95%] gap-[15px] min-w-[200px] p-[15px] bg-[#1f2937]/50 rounded-lg hover:bg-[#1f2937] transition-all duration-200 group'
              >
                {/* Profile Photo - CLICKABLE */}
                <div 
                  className='w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-700 border-2 border-[#1f2937] flex-shrink-0 cursor-pointer hover:border-[#22c1ff] transition-all duration-200'
                  onClick={() => handleProfileClick(friend)}
                >
                  <img
                    src={friend.profileImage || dp}
                    alt=""
                    className='w-full h-full object-cover'
                  />
                </div>
                
                {/* Friend Name - ALSO CLICKABLE */}
                <div 
                  className='flex-1 min-w-0 cursor-pointer hover:text-[#22c1ff] transition-colors'
                  onClick={() => handleProfileClick(friend)}
                >
                  <div className='text-gray-200 text-[16px] font-semibold truncate'>
                    {friend.firstName} {friend.lastName}
                  </div>
                </div>
                
                {/* Unfriend Button - Right Most */}
                <button
                  className='text-[#ef4444] hover:text-red-400 hover:scale-110 transition-all duration-200 p-2 rounded-full hover:bg-red-500/20 flex-shrink-0'
                  onClick={() => handleUnfriend(friend._id)}
                  title='Unfriend'
                >
                  <RiUserUnfollowLine className='w-[24px] h-[24px]' />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-400 text-[18px] py-[40px]'>
            No friends yet. Accept some connection requests to see them here!
          </div>
        )}
      </div>
    </div>
  )
}

export default Network

