import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import LoginLayout from './Layouts/LoginLayout'
import MainLayout from './Layouts/MainLayout'
import LoginForm from './features/auth/LoginForm'
import SingupForm from './features/auth/SingupForm'
import Home from './pages/Home'
import RequireAuth from './features/auth/RequireAuth'
import NoUser from './features/auth/NoUser'
import Profile from './features/users/Profile'
import Persist from './features/auth/Persist'
import MessageList from './features/messages/MessageList'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Persist />}>

      <Route element={<NoUser />}>
        <Route element={<LoginLayout />}>
          <Route index element={<LoginForm />} />
          <Route path="signup" element={<SingupForm />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          <Route path="home" element={<Home />}>
            <Route path=":chatId" element={ <MessageList />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

    </Route>
  )
)


const App = () => <RouterProvider router={router} />

export default App