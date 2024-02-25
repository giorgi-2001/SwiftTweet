import { apiSlice } from "../../app/api/apiSlice"
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { UserType } from "../auth/authSlice"

type ChatType= {
    _id: string,
    users: UserType[],
    isGroupChat: boolean,
    admin?: null | string,
    createdAt: string,
    updatedAt: string
}

type ChatDataType = {
    users: string[],
    isGroupChat: boolean
}

const chatAdapter = createEntityAdapter({
    selectId: (chat: ChatType) => chat._id
})

const initialState = chatAdapter.getInitialState()

const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getChats: builder.query({
            query: () => '/chat',

            transformResponse: (res: ChatType[]) => {
                return chatAdapter.setAll(initialState, res)
            },

            providesTags: (res) => res ? [
                { type: 'chat', id: 'LIST' },
                ...res.ids.map(id => ({
                    type: 'chat' as const , id
                }))
            ] : [{ type: 'chat', id: 'LIST' }]
        }),

        connectToChat: builder.mutation({
            query: (chatData: ChatDataType) => ({
                url: '/chat',
                method: 'POST',
                body: chatData
            }),
            
            invalidatesTags: [{ type: 'chat', id: 'LIST' }]
        })
    })
})


export const {
    useGetChatsQuery,
    useConnectToChatMutation
} = chatApiSlice


const selectChatsResults = chatApiSlice.endpoints.getChats.select(undefined)

const selectChatsData = createSelector(
    selectChatsResults,
    chatsResult => chatsResult.data
)

export const {
    selectAll: selectChats,
    selectIds: selectChatsIds,
    selectById: selectChatByID
} = chatAdapter.getSelectors((state: RootState) => 
    selectChatsData(state) ?? initialState)