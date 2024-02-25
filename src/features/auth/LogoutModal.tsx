import { useSendLogoutMutation } from "./authApiSlice"

type LogoutModalProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>> 
}

const LogoutModal = ({ setModalOpen }: LogoutModalProps) => {

    const [sendLogout, { isSuccess }] = useSendLogoutMutation()

    const handleClose = () => setModalOpen(false)
    const handleLogout = () => {
        sendLogout(undefined)
        if(isSuccess) {
            setModalOpen(false)
        }
    }

  return (
    <div className="fixed inset-0 z-10 bg-black/70 py-4">
        <div className="bg-white absolute inset-0 w-fit max-w-screen-minus-padding h-fit m-auto p-8 rounded-md">
            <h1 className="text-2xl font-bold text-zinc-700 text-center mb-8">Do you want to Log out?</h1>
            <div className="flex flex-wrap justify-evenly gap-x-6 gap-y-3">
                <button onClick={handleClose} className="block py-2 px-8 rounded-lg font-semibold text-lg text-white bg-gray-500 hover:bg-gray-400 focus:bg-gray-300">Cancel</button>
                <button onClick={handleLogout} className="block py-2 px-8 rounded-lg font-semibold text-lg text-white bg-rose-500 hover:bg-rose-400 focus:bg-rose-300">Log out</button>
            </div>
        </div>
    </div>
  )
}

export default LogoutModal