import { NavLink, Outlet } from "react-router-dom"
import wave from "../assets/wave.svg"
import entry from "../assets/entry.png"
import logo from "../assets/logo.png"

const LoginLayout = () => {

    const now = new Date().getFullYear()

    const navLinkClass = "login-link py-1 px-3 rounded-lg rounded-b-none"

  return (
    <>
        <main className="h-screen flex flex-col">
            <section className="grow flex justify-center items-center p-4">
                <div className="bg-zinc-100 flex gap-8 flex-col sm:flex-row p-4 sm:p-8 rounded-lg">
                    <aside>
                        <img className="w-full sm:w-96 mx-auto" src={entry} alt="entry-img" />
                        <article>
                            <h1 aria-label="SwiftTweet" className="mt-4">
                                <img className="w-3/4 sm:w-60 mx-auto" src={logo} alt="logo" />
                            </h1>
                            <p className="font-bold text-center text-zinc-600 tracking-widest">Soar into the Swift conversations!</p>
                        </article>
                    </aside>
                    <section className="flex flex-col justify-center">
                        <nav className="flex font-semibold pl-6">
                            <NavLink className={navLinkClass} to="/">Login</NavLink>
                            <NavLink className={navLinkClass} to="/signup">Signup</NavLink>
                        </nav>
                        <Outlet />
                    </section>
                </div>
            </section>
            <footer className="relative flex">
                <p className="absolute inset-0 h-fit mt-auto pb-1 z-10 text-center sm:text-lg font-semibold text-teal-900 tracking-wide">{now}, All rights reserved &copy;</p>
                <img className="min-h-16 object-cover w-full" src={wave} alt="" />
            </footer>
        </main>
        
    </>
  )
}

export default LoginLayout