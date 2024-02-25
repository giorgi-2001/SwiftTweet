import { apiSlice } from "../../app/api/apiSlice"

export type NotifType = {
    notification: string,
    chatId: string,
    user: string
}

const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getNotifs: builder.query({
            query: () => '/notif'
        }),

        seenNotif: builder.mutation({
            query: (id: string) => ({
                url: `/notif/${id}`,
                method: "PATCH"
            })
        }),

        sendNotif: builder.mutation({
            query: (notif: NotifType) => ({
                url: '/notif',
                method: 'POST',
                body: notif
            })
        })
    })
})

export const {
    useSeenNotifMutation,
    useSendNotifMutation,
    useGetNotifsQuery
} = notificationApiSlice