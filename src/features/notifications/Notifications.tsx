import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import { socket } from "../../main"
import { selectChatByID } from "../chats/chatApiSlice"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { UserType, selectUser } from "../auth/authSlice"
import { RootState } from "../../app/store"
import { useNavigate, useParams } from "react-router-dom"
import { useGetNotifsQuery, useSeenNotifMutation } from "./notificationApiSlicee"


type MinNotifType = {
    notification: string,
    chatId: string,
    _id?: string
}

type NotifType = {
    sender: UserType,
} & MinNotifType

const Notifications = () => {

    const navigate = useNavigate()

    const { chatId } = useParams() as { chatId: string }

    const chat = useSelector((state: RootState) => selectChatByID(state, chatId))
    const user = useSelector(selectUser)
    const friend = chat?.users?.find(us => us._id !== user?._id)

    const { data, isSuccess } = useGetNotifsQuery(undefined, { 
        refetchOnMountOrArgChange: true
    })
    const [seenNotif] = useSeenNotifMutation()

    const [notifs, setNorifs] = useState<MinNotifType[]>([])

    const [seen, setSeen] = useState(false)
    const [containerOpen, setContainerOpen] = useState(false)
    
    const friendRef = useRef(friend)

    useEffect(() => {
        friendRef.current = friend

        socket.on('notificationRecieved', ({ sender, notification, chatId }: NotifType) => {
            if(!friendRef.current || friendRef.current?._id !== sender._id) {

                const myNotif = { notification, chatId }
                const filtered = notifs.filter(notif => 
                    notif.notification !== notification)
                    
                const newNotifs = [myNotif, ...filtered]

                setNorifs(newNotifs)
                setSeen(false)
            }
        })

    }, [friend])

    useEffect(() => {
        if(isSuccess) {
            setNorifs(data)
        }
    }, [isSuccess])

    const handleSeen = async (notif: MinNotifType) => {
        if(!notif._id) return
        try {
            await seenNotif(notif._id).unwrap()
            navigate(`/home/${notif.chatId}`)
            setContainerOpen(false)
        } catch (error) {
            console.log(error)
        } 
    }

    const notifContent = notifs.length 
        ? notifs.map((notif, i) => 
            <button 
                className="py-1 px-2 hover:bg-zinc-200" 
                key={i} 
                onClick={() => handleSeen(notif)}
            >
                {notif.notification}
            </button>) 
        : <p>No notifications</p>

    const container = containerOpen ? (
        <div className="absolute z-10 right-0 top-8 sm:w-max bg-zinc-50 p-4 rounded-lg shadow-lg shadow-black/20 font-semibold flex flex-col">
            { notifContent }
        </div>
    ) : null

    const span = ( notifs.length && !seen) ? (
        <span className="block h-5 w-5 text-center aspect-square bg-red-500 rounded-full absolute -right-2.5 -top-1.5 p-0.5 text-white text-xs font-semibold scale-75 outline outline-2 outline-zinc-200">
            { notifs.length }
        </span>
    ) : null

    const handleClick = () => {
        setContainerOpen(prev => !prev)
        setSeen(true)
    }

    return (
        <div className={`relative sm:block`}>
            <button 
                onClick={handleClick} aria-label="notifications" 
                className="text-teal-800 relative hover:text-teal-400"
            >
                <FontAwesomeIcon size="xl" icon={faBell} />

                { span }
                
            </button>

            { container}

        </div>
    )
}

export default Notifications