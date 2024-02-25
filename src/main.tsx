import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'react-toastify/ReactToastify.css'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { setActiveUsers } from './features/users/usersSlice.ts'
import { io } from 'socket.io-client'

export const socket = io('http://localhost:3500')

socket.on('activeUsers', (activeUsers) => {
  store.dispatch(setActiveUsers(activeUsers))
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </React.StrictMode>,
)
