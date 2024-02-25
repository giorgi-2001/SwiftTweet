import { apiSlice } from "../../app/api/apiSlice"
import { createEntityAdapter } from "@reduxjs/toolkit"
import formatMessages from "../../utils/clusterize"
import formatDates from "../../utils/formatDates"
import { socket } from "../../main"
import { UserType } from "../auth/authSlice"

export type MessageType = {
    _id: string,
    chat: string,
    text: string,
    sender: UserType,
    createdAt: string,
    updatedAt: string, 
    position: string,
    myDate: {
        date: string,
        isWorthShowing: boolean
    }
}


const messagesAdapter = createEntityAdapter({
    selectId: (message: MessageType) => message._id
})

const initialState = messagesAdapter.getInitialState()

const messageApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMessages: builder.query({
            query: (chat: string) => `message?chat=${chat}`,

            transformResponse: (res: MessageType[]) => {
                const formatedMessages = formatMessages(res)
                const datesFormated = formatDates(formatedMessages)
                return messagesAdapter.addMany(initialState, datesFormated)
            },

            onCacheEntryAdded: async (_arg, {
                updateCachedData,
                cacheDataLoaded,
                cacheEntryRemoved
            }) => {

                try {
                    await cacheDataLoaded

                    socket.on('messageRecieved', (message) => {
                        updateCachedData((draft) => {
                            draft.ids.unshift(message._id)
                            const messages = Object.values(draft.entities)
                            messages.unshift(message)

                            const formatedMessages = formatMessages(messages)
                            const datesFormated = formatDates(formatedMessages)

                            const newEntities: Record<string, MessageType> = {}

                            datesFormated.forEach(message => {
                                newEntities[message._id] = message
                            })

                            draft.entities = newEntities
                        })
                    })

                } catch (error) {
                    console.log(error)
                }

                await cacheEntryRemoved

                socket.off('messageRecieved')
                
            },

            providesTags: (res) => res ? [
                { type: 'messages', id: 'LIST' },
                ...res.ids.map(id => ({
                    type: 'messages' as const , id
                }))
            ] : [{ type: 'messages', id: 'LIST' }]
        }),

        requestNextPage: builder.mutation({
            query: ({ chat, page }: {
                chat: string, page: number
            }) => ({
                url: `/message?chat=${chat}&page=${page}`,
                method: 'GET'
            }),

            onQueryStarted: async ({ chat }, { queryFulfilled, dispatch }) => {
                try {
                    const res = await queryFulfilled
                    const messages = res.data
                    const ids = messages.map((m: MessageType) => m._id)
                    const formatedMessages = formatMessages(messages)
                    const datesFormated = formatDates(formatedMessages)

                    dispatch(messageApiSlice.util.updateQueryData('getMessages', chat, (draft) => {

                        const oldMessages = Object.values(draft.entities)

                        const mergedMessages = [...oldMessages, ...datesFormated]

                        const newEntities: Record<string, MessageType> = {}

                        mergedMessages.forEach(message => {
                            newEntities[message._id] = message
                        })

                        draft.ids = [...draft.ids, ...ids]
                        draft.entities = newEntities
                    }))

                } catch (error) {
                    console.log(error)
                }
            }
        }),

        sendMessage: builder.mutation({
            query: (message: { text: string, chat: string}) => ({
                url: '/message',
                method: 'POST',
                body: message
            }),

            onQueryStarted: async (_arg, { queryFulfilled }) => {
                const res = await queryFulfilled
                const message = res.data
                socket.emit('messageSent', message)
            },
            
            invalidatesTags: [{ type: 'messages', id: 'LIST' }]
        })
    })
})


export const {
    useGetMessagesQuery,
    useSendMessageMutation,
    useRequestNextPageMutation
} = messageApiSlice

