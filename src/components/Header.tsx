import { Link, NavLink } from "react-router-dom"
import SearchUsers from "../features/users/SearchUsers"
import logo from "../assets/logo.png"
import { useSelector } from "react-redux"
import { selectUser } from "../features/auth/authSlice"
import { useState } from "react"
import LogoutModal from "../features/auth/LogoutModal"
import cld from "../config/cloudinary"
import { AdvancedImage } from "@cloudinary/react"
import { fill } from "@cloudinary/url-gen/actions/resize"
import Notifications from "../features/notifications/Notifications"

const Header = () => {

    const user = useSelector(selectUser)
    
    const [menuOpen, setMenuOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const menu = menuOpen ? (
        <div className="absolute z-20 top-10 right-0 w-max flex flex-col gap-1 items-start bg-zinc-50 px-6 py-3 rounded-md shadow-lg shadow-black/20 text-lg font-semibold">
            <button onClick={() => setModalOpen(true)} className="text-rose-500">Logout</button>
            <Link className="font-semibold text-zinc-700" to="/profile">
                Edit Profile
            </Link>
        </div>
    ) : null

    const handleBlur = () => {
        setTimeout(() => {
        setMenuOpen(false)
    }, 100)}

    const img = cld.image(user?.avatar).resize(
        fill().width(32).height(32)
    )

  return (
    <header className="bg-zinc-200/70 py-3">
        <nav className="w-full max-w-5xl mx-auto px-6 flex gap-4 sm:gap-8 items-center justify-end h-9">
            <div className="hidden sm:block">
                <SearchUsers />
            </div>
            <NavLink className="mr-auto sm:mx-auto" to="/">
                <h1 aria-label="SwiftTweet">
                    <img className="w-40" src={logo} alt="logo" />
                </h1>
            </NavLink>

            <Notifications />
            
            <div className={`relative`}>
                <button 
                    aria-label="profile"
                    onClick={() => setMenuOpen(prev => !prev)}
                    onBlur={handleBlur}
                    className="flex items-center gap-4"
                >
                    <AdvancedImage cldImg={img} className="rounded-full min-w-8 min-h-8" />
                    <span className="hidden sm:block">{user?.username}</span>
                </button>

                { menu }

            </div>
        </nav>

        <section className={`w-full max-w-5xl mx-auto px-6 mt-2 sm:hidden`}>
            <SearchUsers />
        </section>

        { modalOpen && <LogoutModal setModalOpen={setModalOpen}/>}
    </header>
  )
}

export default Header