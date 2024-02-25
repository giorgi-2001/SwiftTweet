import { apiSlice } from "../../app/api/apiSlice"
import { UserDataType } from "../users/userApiSlice"
import { setCredentials } from "./authSlice"
import { logout } from "./authSlice"


const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (userData: UserDataType) => ({
                url: '/auth/login',
                method: 'POST',
                body: userData
            }),

            onQueryStarted: async (_arg, { dispatch, queryFulfilled}) => {
                try {
                    const result = await queryFulfilled
                    const { user, token } = result.data
                    dispatch(setCredentials({ user, token }))
                } catch (error) {
                    console.log(error)
                }
            }
        }),

        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),

            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const result = await queryFulfilled
                    const { user, token } = result.data
                    dispatch(setCredentials({ user, token }))
                } catch (error) {
                    console.log(error)
                }
            }
        }),

        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),

            onQueryStarted: async (_arg, { dispatch , queryFulfilled }) => {
                try {
                    await queryFulfilled
                    dispatch(logout())
                    dispatch(apiSlice.util.resetApiState())
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useRefreshMutation,
    useSendLogoutMutation
} = authApiSlice