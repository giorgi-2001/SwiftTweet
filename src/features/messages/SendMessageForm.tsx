import { FormEvent, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import { useSendMessageMutation } from "./messagesApiSlice"
import { socket } from "../../main"
import { useSelector } from "react-redux"
import { selectChatByID } from "../chats/chatApiSlice"
import { RootState } from "../../app/store"
import { selectUser } from "../auth/authSlice"
import { useSendNotifMutation } from "../notifications/notificationApiSlicee"

type SendMessageFormProps = {
    setTyping: React.Dispatch<React.SetStateAction<boolean>>
}


const SendMessageForm = (
    { setTyping }: SendMessageFormProps
) => {

    const { chatId } = useParams() as { chatId: string }
    const chat = useSelector((state: RootState) => selectChatByID(state, chatId))
    const user = useSelector(selectUser)

    const friend = chat?.users?.find(us => us._id !== user?._id)

    const [text, setText] = useState('')

    const [sendMessage, { isLoading, isSuccess }] = useSendMessageMutation()
    const [sendNotif] = useSendNotifMutation()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const message = {
            text, chat: chatId
        }
        try {
            await sendMessage(message)
            setText('')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(isSuccess && friend ) {

            try {
                const notification = `${user?.username} sent you a new message`
                const notif = {
                    notification,
                    chatId,
                    user: friend?._id
                }
                sendNotif(notif)
            } catch (error) {
                console.log(error)
            }
            socket.emit('notificationSent', {
                sender: user, 
                reciever: friend,
                chatId
            })
        }
    }, [isSuccess])


    const myTimeout = useRef<NodeJS.Timeout | undefined>()

    useEffect(() => {
        if(!text) return

        socket.emit('typingStarted', chatId)

        clearTimeout(myTimeout.current)

        myTimeout.current = setTimeout(() => {
            socket.emit('typingStopped', chatId)
        }, 1000)
    }, [text])


    useEffect(() => {
        socket.on('typing', () => {
            setTyping(true)
        })

        socket.on('notTyping', () => {
            setTyping(false)
        })
    }, [])

 
  return (
    <form onSubmit={handleSubmit} className="bg-zinc-300 py-4 px-6">
        <div className="relative">
            <input 
                type="text"
                aria-label="type the message" 
                autoComplete="off"
                value={text}
                onChange={e => setText(e.target.value)}
                className="block w-full rounded-full py-2 px-4 bg-zinc-50 text-zinc-800 text-base pr-14"
            />
            <button disabled={isLoading} aria-label="send" className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500">
                <FontAwesomeIcon size="xl" icon={faArrowRightLong} />
            </button>
        </div>
    </form>
  )
}

export default SendMessageForm