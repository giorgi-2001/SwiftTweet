import { apiSlice } from "../../app/api/apiSlice"
import { UserDataType } from "../users/userApiSlice"
import { setCredentials } from "./authSlice"


const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (userData: UserDataType) => ({
                url: '/auth/login',
                method: 'POST',
                body: userData
            }),

            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const result = await queryFulfilled
                    const { user, accessToken, refreshToken } = result.data
                    dispatch(setCredentials({ user, token: accessToken }))
                    localStorage.setItem('refresh', refreshToken)
                } catch (error) {
                    console.log(error)
                }
            }
        }),

        refresh: builder.mutation({
            query: (refreshToken: string) => ({
                url: '/auth/refresh',
                method: 'POST',
                body: { token: refreshToken }
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
    })
})

export const {
    useLoginMutation,
    useRefreshMutation,
} = authApiSlice