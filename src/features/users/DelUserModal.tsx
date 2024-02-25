import { useDeleteUserMutation } from "./userApiSlice"
import { toast } from "react-toastify"

type DelUserModalProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>> 
}

const DelUserModal = ({ setModalOpen }: DelUserModalProps) => {

    const [deleteUser] = useDeleteUserMutation()

    const handleClose = () => setModalOpen(false)
    const handleDelete = async () => {
        const data = await deleteUser(undefined).unwrap()
        toast.success(data?.message)
    }

  return (
    <div className="fixed inset-0 z-10 bg-black/70 py-4">
        <div className="bg-white absolute inset-0 w-fit max-w-screen-minus-padding h-fit m-auto p-8 rounded-md">
            <h1 className="text-2xl font-bold text-zinc-700 text-center">Do you want to Delete user?</h1>
            <p className="py-6 text-center text-zinc-700 font-medium text-lg">This action will forever remove the account<br />
            and can not be undone!</p>
            <div className="flex flex-wrap justify-evenly gap-x-6 gap-y-3">
                <button onClick={handleClose} className="block py-2 px-8 rounded-lg font-semibold text-lg text-white bg-gray-500 hover:bg-gray-400 focus:bg-gray-300">Cancel</button>
                <button onClick={handleDelete} className="block py-2 px-8 rounded-lg font-semibold text-lg text-white bg-rose-500 hover:bg-rose-400 focus:bg-rose-300">Delete</button>
            </div>
        </div>
    </div>
  )
}

export default DelUserModal