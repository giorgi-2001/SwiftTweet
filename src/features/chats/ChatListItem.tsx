import { useSelector } from "react-redux"
import { selectChatByID } from "./chatApiSlice"
import { selectUser } from "../auth/authSlice"
import { RootState } from "../../app/store"
import cld from '../../config/cloudinary'
import { AdvancedImage } from "@cloudinary/react"
import { fill } from "@cloudinary/url-gen/actions/resize"
import { selectActiveUsers } from "../users/usersSlice"
import { Link, useParams } from "react-router-dom"

type ChatListItemProps = {
    id: string
}

const ChatListItem = ({ id }: ChatListItemProps) => {

    const chat = useSelector((state: RootState) => selectChatByID(state, id))
    const user = useSelector(selectUser)

    if(!chat || !user) return null

    const friend = chat.users.find(us => us._id !== user._id)

    if(!friend) return null

    const isActiveChat = id === useParams()?.chatId

    const src = cld.image(friend?.avatar).resize(
        fill().width(40).height(40)
    )

    const activeUsers = useSelector(selectActiveUsers)

    const isActive = Boolean(activeUsers.find(us => us._id === friend?._id))

  return (
    <Link to={`/home/${chat._id}`} className={`flex items-center gap-4 px-4 py-2 rounded-lg  my-2 cursor-pointer ${isActiveChat ? 'bg-teal-400' : 'bg-zinc-300'}`}>
        <div className="relative">
            <AdvancedImage className="rounded-full" cldImg={src} />
            {
                isActive && 
                <div className={`w-3.5 h-3.5 bg-green-500 rounded-full absolute -right-1 bottom-0 outline outline-2 ${isActiveChat ? 'outline-teal-400' : 'outline-zinc-300'}`}></div>
            }
        </div>
        <p>{friend?.username}</p>
    </Link>
  )
}

export default ChatListItem