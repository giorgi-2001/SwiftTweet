import { useGetMessagesQuery, useRequestNextPageMutation } from "./messagesApiSlice"
import { useParams } from "react-router-dom"
import { useCallback, useEffect, useRef, useState } from "react"
import SendMessageForm from "./SendMessageForm"
import MessageElement from "./MessageElement"
import { socket } from "../../main"
import Spiner from "../../animations/spiner/Spiner"
import Texting from "../../animations/texting/Texting"


const MessageList = () => {

  const { chatId } = useParams() as { chatId: string }

  const [page, setPage] = useState(1)
  const [typing, setTyping] = useState(false)

  const [requestNextPage] = useRequestNextPageMutation()

  const {
    isLoading,
    isSuccess,
    data
  } = useGetMessagesQuery(chatId, {
    refetchOnMountOrArgChange: true
  })

  const savedChatId = useRef(chatId)

  useEffect(() => {
    socket.emit('chatLeft', savedChatId.current)
    socket.emit('chatJoined', chatId)
    savedChatId.current = chatId
    setPage(1)
  }, [chatId])

  useEffect(() => {
    if(!chatId || page === 1) return
    requestNextPage({ chat: chatId, page })
  }, [page])

  let content 

  const observer = useRef<undefined | IntersectionObserver>()

  const lastMessageRef = useCallback((msg: HTMLElement) => {
    if(isLoading) return 

    if(observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(msgs => {
      if (msgs[0].isIntersecting) {
        console.log('near the last message')
        setPage(prev => prev + 1)
      }
    })

    if(msg) observer.current.observe(msg)
  }, [isLoading])

  if(isLoading) {
    content = <Spiner color="rgb(161, 161, 170)" size={50} />
  } else if(isSuccess) {
    const { ids, entities } = data
    content = ids.map((id, i) => {
      if (i === ids.length - 1) {
        return (
          <MessageElement 
            key={id} 
            message={entities[id]}
            ref={lastMessageRef}
          />
        )
      }
      return (
        <MessageElement 
          key={id} 
          message={entities[id]}
        />
      )
      })
  }

  return (
    <>
      <section className="grow flex flex-col-reverse p-3 sm:p-8 pb-4 h-24 overflow-y-scroll">
        <div className="pt-4">
          { typing ? <Texting /> : null }
        </div>
        {content}
      </section>
      
      {isSuccess && <SendMessageForm setTyping={setTyping} />}
    </>
  )
}

export default MessageList