import { MessageType } from "../features/messages/messagesApiSlice"
import { format } from 'date-fns'

const getFormatedString = (dateString: string) => {

    const prev = new Date(dateString).getTime()
    const now = new Date().getTime()
    const diff = (now - prev) / (1000 * 60)

    let myString = ''

    if (diff < 60 * 24) {
        myString = "HH:mm"
    } else if (diff >= 60 * 24 && diff <= 60 * 24 * 7) {
        myString = "EEEEEE 'at' HH:mm"
    } else if (diff > 24 * 7 * 60) {
        myString = "d MMM 'at' HH:mm"
    }

    return format(new Date(dateString), myString)
}

const formatDates = (array: MessageType[]) => {

    return array.map((item, i)=> {

        let isWorthShowing

        if(i !== array.length - 1) {
            const prev = new Date(array[i].createdAt).getTime()
            const next = new Date(array[i + 1].createdAt).getTime()
            const diff = (prev - next) / (1000 * 60)

            if (diff <= 30) {
                isWorthShowing = false
            } else {
                isWorthShowing = true
            }

            if(i === array.length - 1) {
                isWorthShowing = true
            }

            const date = getFormatedString(item.createdAt)

            return {
                ...item, myDate: {
                    date, isWorthShowing
                }
            }
        } else {
            const date = getFormatedString(item.createdAt)
            return {
                ...item, myDate: {
                    date, isWorthShowing: true
                }
            }
        }
    })
}

export default formatDates