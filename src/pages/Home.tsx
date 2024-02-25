import ChatList from "../features/chats/ChatList"
import { Outlet, useParams } from "react-router-dom"

const Home = () => {

  const { chatId } = useParams()
  const isChatOpen = Boolean(chatId)

  return (
    <>  
      <ChatList />
      <section className={`bg-zinc-200/70 rounded-lg grow flex flex-col ${isChatOpen ? 'flex' : 'hidden'} sm:flex`}>
        <Outlet />
      </section>
    </>
  )
}

export default Home