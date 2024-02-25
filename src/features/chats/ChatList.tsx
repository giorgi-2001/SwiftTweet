import { useGetChatsQuery } from "./chatApiSlice"
import { useSelector } from "react-redux"
import { selectChatsIds } from "./chatApiSlice"
import ChatListItem from "./ChatListItem"
import { useParams } from "react-router-dom"

const ChatList = () => {

  const { chatId } = useParams()
  const isChatOpen = Boolean(chatId)

  const {
    isLoading, 
    isSuccess,
    isError,
    error
  } = useGetChatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000
  })

  const chatsIds = useSelector(selectChatsIds)

  let content

  if(isLoading) {
    content = <p>Loading...</p>
  } else if (isError) {
    content = <p>Error!</p>
    console.log(error)
  } else if (isSuccess && chatsIds.length) {
    content = chatsIds.map(id => <ChatListItem key={id} id={id} />)
  }


  return (
    <section className={`bg-zinc-200/70 rounded-lg py-6 md:min-w-80 ${isChatOpen ? 'hidden' : 'flex'} sm:flex flex-col grow sm:grow-0`}>
        <h2 className="text-2xl text-zinc-700 font-medium border-b-2 border-zinc-500 py-2 mx-6 mb-6">Chats:</h2>
        <div className="grow h-24 overflow-y-scroll px-6">
          {content}
        </div>
    </section>
  ) 
}

export default ChatList