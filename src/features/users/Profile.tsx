import { useSelector } from "react-redux"
import { selectUser } from "../auth/authSlice"
import { FormEvent, useState } from "react"
import ImageHandler from "./ImageHandler"
import { useUpdateUserMutation } from "./userApiSlice"
import { toast } from "react-toastify"
import DelUserModal from "./DelUserModal"

const Profile = () => {

    const user = useSelector(selectUser)

    const [username, setUsername] = useState(user?.username || '')
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const [updateUser] = useUpdateUserMutation()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!username && (!password || !newPassword)) {
            return toast.warn("You can not send empty fields")
        }

        if(newPassword && !password) {
            return toast.warn("Send current password in order to update password")
        }

        try {
            const user = {
                username, password, newPassword
            }
            const data = await updateUser(user).unwrap()
            toast.success(data?.message)
        } catch (error: any) {
            if("data" in error) {
                toast.error(error?.data?.message)
            }
        }
    }


  return (
    <section className="bg-zinc-200/70 max-w-2xl mx-auto p-8 rounded-md">
        <h2 className="text-2xl text-center mb-8 font-semibold text-zinc-500">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-x-10 gap-y-4 items-start justify-center sm:justify-start">
            <ImageHandler user={user}/>
            <div className="grow sm:grow-0">
                <label className="font-semibold text-zinc-600" htmlFor="username">Username</label>
                <input 
                    type="text" 
                    id="username"
                    autoComplete="off"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="block py-2 px-4 rounded-md w-full mb-4"
                />

                <label className="font-semibold text-zinc-600" htmlFor="password">Password</label>
                <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block py-2 px-4 rounded-md w-full mb-4"
                />

                <label className="font-semibold text-zinc-600" htmlFor="password">
                    New Password
                </label>
                <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="newPassword"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="block py-2 px-4 rounded-md w-full mb-4"
                />

                <div className="flex gap-4 mb-4 items-center">
                    <input 
                        type="checkbox" 
                        id="showPwd"
                        checked={showPassword}
                        onChange={() => setShowPassword(prev => !prev)} 
                        className="block w-4 h-4"
                    />
                    <label className="font-semibold text-zinc-600" htmlFor="showPwd">Show Password</label>
                </div>

                <button className="block w-full py-2 text-center my-2 rounded-lg bg-teal-400 hover:bg-teal-300 focus:bg-teal-200 text-teal-950 font-semibold" type="submit">Update Profile</button>

                <button onClick={() => setModalOpen(true)}
                className="block w-full py-2 text-center my-2 rounded-lg bg-rose-500 hover:bg-rose-400 focus:bg-rose-300 text-white font-medium" type="button">Delete Account</button>
            </div>
        </form>
        { modalOpen && <DelUserModal setModalOpen={setModalOpen} />}
    </section>
  )
}

export default Profile