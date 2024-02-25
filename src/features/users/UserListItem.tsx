import { UserType } from "../auth/authSlice"
import { selectUser } from "../auth/authSlice"
import { useSelector } from "react-redux"
import { useConnectToChatMutation } from "../chats/chatApiSlice"
import { useNavigate } from "react-router-dom"
import cld from '../../config/cloudinary'
import { fill } from "@cloudinary/url-gen/actions/resize"
import { AdvancedImage } from "@cloudinary/react"

type UserListItemProps = {
    user: UserType
}

const UserListItem = ({ user }: UserListItemProps) => {

    const navigate = useNavigate()
    const { username, avatar, _id } = user
    const me = useSelector(selectUser)
    const [connectToChat] = useConnectToChatMutation()

    const handleClick = async () => {
      if(!me?._id) return
      const users = [me?._id, _id]
      try {
        const chat = await connectToChat({ users, isGroupChat: false }).unwrap()
        navigate(`/home/${chat._id}`)
      } catch (error) {
        console.log(error)
      }
    }

    const img = cld.image(avatar).resize(
      fill().width(40).height(40)
    )

  return (
    <div  onClick={handleClick} className="flex items-center gap-4 mb-2 last:mb-0 p-2 rounded-lg bg-zinc-200 cursor-pointer">
        <AdvancedImage cldImg={img} className="rounded-full" />
        <p>{username}</p>
    </div>
  )
}

export default UserListItem