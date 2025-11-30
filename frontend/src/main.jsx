import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'
import { ConnectionProvider } from './context/ConnectionContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <AuthContext>
<UserContext>
    <ConnectionProvider>
         <NotificationProvider>
            <App />
         </NotificationProvider>
      
    </ConnectionProvider>

</UserContext>
</AuthContext>
</BrowserRouter>
 
)
