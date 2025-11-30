import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext' // Assuming you have this for serverUrl

const ConnectionContext = createContext()

export function ConnectionProvider({ children }) {
  const { serverUrl } = useContext(authDataContext)
  const [pendingRequests, setPendingRequests] = useState(0)

  const fetchPendingRequestsCount = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection/requests`,
        { withCredentials: true }
      )
      setPendingRequests(result.data.length)
    } catch (error) {
      console.error('Failed to fetch pending requests count:', error)
      setPendingRequests(0)
    }
  }

  useEffect(() => {
    fetchPendingRequestsCount()

    // Optionally set interval to refresh automatically every X seconds if desired:
    // const interval = setInterval(fetchPendingRequestsCount, 30000)
    // return () => clearInterval(interval)
  }, [serverUrl])

  return (
    <ConnectionContext.Provider value={{ pendingRequests, fetchPendingRequestsCount }}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnection() {
  return useContext(ConnectionContext)
}
