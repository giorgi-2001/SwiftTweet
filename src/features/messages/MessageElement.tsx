import { MessageType } from "./messagesApiSlice"
import { useSelector } from "react-redux"
import { selectUser } from "../auth/authSlice"
import { useState } from "react"
import cld from "../../config/cloudinary"
import { AdvancedImage } from "@cloudinary/react"
import { fill } from "@cloudinary/url-gen/actions/resize"
import React from "react"

type MessageElementProps = {
    message: MessageType
}

type Ref = React.ForwardedRef<HTMLElement | null>

const MessageElement = React.forwardRef(({ message }: MessageElementProps, ref: Ref) => {

    const user = useSelector(selectUser)
    
    const { text, position, sender, myDate } = message

    const avatar = sender.avatar

    const isMyMessage = sender._id === user?._id

    const bg = isMyMessage 
        ? 'bg-teal-400 text-teal-950 ml-auto'
        : 'bg-white'

    let marginBaseOnPosition 

    if(position === 'top' || position === 'solo') {
        marginBaseOnPosition = 'mt-6'
    }

    let borderRadius 

    if(position === 'top' && isMyMessage ) {
        borderRadius = 'rounded-br-md'
    } else if (position === 'bottom' && isMyMessage) {
        borderRadius = 'rounded-tr-md'
    } else if (position === 'top' && !isMyMessage) {
        borderRadius = 'rounded-bl-md'
    } else if (position === 'bottom' && !isMyMessage) {
        borderRadius = 'rounded-tl-md'
    } else if (position === 'middle' && isMyMessage) {
        borderRadius = 'rounded-r-md'
    } else if (position === 'middle' && !isMyMessage) {
        borderRadius = 'rounded-l-md'
    }

    const [showDate, setShowDate] = useState(false)

    const img = cld.image(avatar).resize(
        fill().width(40).height(40)
    )

    const content = (
        <>
            {
                !isMyMessage && 
                (<div className="w-10 h-10">
                    {
                        (position === 'bottom' || position === 'solo') && 
                        <AdvancedImage className="rounded-full" cldImg={img} />
                    }
                </div>)
            }

            <p onClick={() => setShowDate(prev => !prev)} className={`py-2 px-4 w-fit max-w-3/5 rounded-2xl border border-zinc-200/70 font-medium ${bg} ${borderRadius}`}>{text}</p>
        </>
    )

    const messageBody = ref ? (
        <section 
            ref={ref}
            className={`w-100 flex items-end gap-2 sm:gap-4 ${marginBaseOnPosition}`}
        >
            {content}
        </section>
    ) : (
        <section 
            className={`w-100 flex items-end gap-2 sm:gap-4 ${marginBaseOnPosition}`}
        >
            {content}
        </section>
    )

  return (
    <>
        {messageBody}

        {
            (myDate.isWorthShowing || showDate) && 
            <p className="mt-6 text-center font-semibold text-zinc-500">
                {myDate.date}
            </p>
        }
    </>
  )
})

export default MessageElement