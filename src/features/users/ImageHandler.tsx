import { ChangeEvent, useEffect, useState } from "react"
import { UserType } from "../auth/authSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useUploadFileMutation } from "./userApiSlice"
import cld from "../../config/cloudinary"
import { fill } from "@cloudinary/url-gen/actions/resize"

const ImageHandler = ({ user }: { user: UserType | null }) => {

    const img = cld.image(user?.avatar).resize(
        fill().width(300).height(300)
    ).toURL()

    const [file, setFile] = useState<null | File>(null)
    const [src, setSrc] = useState(img)

    const [uploadImage] = useUploadFileMutation()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target
        if(files) {
            setFile(files[0])
        }
    }

    useEffect(() => {
        if(file) {
            const url = URL.createObjectURL(file)
            setSrc(url)
        }
    }, [file])


    const handleUpload = () => {
        if (file) uploadImage(file)
    }

  return (
    <div className="">
        <label className='flex align-center justify-center min-w-60 rounded-2xl overflow-clip cursor-pointer group relative outline-4 outline-dashed outline-teal-500' htmlFor="file">
            <input 
                type="file"
                id="file" 
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />
            <img className="w-60 h-60 object-cover group-hover:opacity-50 transition-all" src={src} alt="" />
            <div className="absolute inset-0 flex items-center justify-center text-teal-500 text-5xl opacity-0 group-hover:opacity-80 transition-opacity">
                <FontAwesomeIcon size="2xl" icon={faImage} />
            </div>
        </label>
        <button onClick={handleUpload} className="mt-4 block w-fit py-2 px-8 mx-auto bg-gray-500 rounded-lg text-white font-semibold hover:bg-gray-400 focus:bg-gray-300" type="button">Upload Image</button>
    </div>
  )
}

export default ImageHandler