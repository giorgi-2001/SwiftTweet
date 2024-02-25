import { Outlet } from "react-router-dom"
import Header from "../components/Header"

const MainLayout = () => {

  return (
      
      <main className="flex flex-col h-screen">
        <Header />
        <section className="p-3 flex flex-col sm:flex-row gap-3 grow">
          <Outlet />
        </section>
      </main>
  )
}

export default MainLayout