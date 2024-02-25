import { MessageType } from "../features/messages/messagesApiSlice"

export const clusterize = (array: MessageType[]) => {
    const ArrayOfClusters: MessageType[][] = []
    let cluster: MessageType[] = []

    array.forEach((item, i) => {

        if(i === 0) {
            return cluster.push(item)
        }

        if (array[i].sender._id === array[i - 1].sender._id) {

            const prev = new Date(array[i - 1].createdAt).getTime()
            const next = new Date(array[i].createdAt).getTime()
            const diff = (prev - next) / 1000

            if(diff < 120) {
                cluster.push(item)
            } else {
                ArrayOfClusters.push(cluster)
                cluster = []
                cluster.push(item)
            }

        }  else {
            ArrayOfClusters.push(cluster)
            cluster = []
            cluster.push(item)
        }
    })

    ArrayOfClusters.push(cluster)
    return ArrayOfClusters
}

export const modify = (clusteredArray: MessageType[][]) => {

    const finalArray: MessageType[] = []

    clusteredArray.forEach(miniArray => {
        miniArray.map((item, i) => {
            if(miniArray.length === 1) {
                return {
                    ...item, position: 'solo'
                }
            } else {
                if(i === 0) {
                    return {
                        ...item, position: 'bottom'
                    }
                } else if (i === miniArray.length - 1) {
                    return {
                        ...item, position: 'top'
                    }
                } else {
                    return {
                        ...item, position: 'middle'
                    }
                }
            }
        }).forEach(item => finalArray.push(item))
    })

    return finalArray
}

const formatMessages = (array: MessageType[]) => {
    const clusterizedArray = clusterize(array)
    return modify(clusterizedArray)
}

export default(formatMessages)