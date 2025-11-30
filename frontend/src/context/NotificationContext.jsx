import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { authDataContext } from './AuthContext.jsx' // Assuming you have this for serverUrl

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const { serverUrl } = useContext(authDataContext)
  const [notificationCount, setNotificationCount] = useState(0)

  const fetchNotificationCount = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/notification/get`, { withCredentials: true })
      setNotificationCount(result.data.length)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      setNotificationCount(0)
    }
  }

  useEffect(() => {
    fetchNotificationCount()
    // Optional: refresh periodically
    // const interval = setInterval(fetchNotificationCount, 30000)
    // return () => clearInterval(interval)
  }, [serverUrl])

  return (
    <NotificationContext.Provider value={{ notificationCount, fetchNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
