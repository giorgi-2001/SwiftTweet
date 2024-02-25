import { apiSlice } from "../../app/api/apiSlice"
import { logout } from "../auth/authSlice"
import { setAvatar } from "../auth/authSlice"

export type UserDataType = {
    username: string,
    password: string
}

type updateUser = {
    newPassword: string
} & UserDataType

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: (username: string) => `/user?username=${username}`
        }),

        signup: builder.mutation({
            query: (userData: UserDataType) => ({
                url: '/user',
                method: 'POST',
                body: userData
            })
        }),

        updateUser: builder.mutation({
            query: (userData: updateUser) => ({
                url: '/user',
                method: 'PATCH',
                body: userData
            }),

            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled
                    dispatch(logout())
                } catch(error) {
                    console.log(error)
                }
            }
        }),

        deleteUser: builder.mutation({
            query: () => ({
                url: '/user',
                method: 'DELETE',
            }),
            
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled
                    dispatch(logout())
                } catch(error) {
                    console.log(error)
                }
            }
        }),

        uploadFile: builder.mutation({
            query: (file: File) => {
                const formData = new FormData()
                formData.append('file', file)

                return {
                    url: '/user/avatar',
                    method: 'PATCH',
                    body: formData
                }
            }, 

            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled
                const { avatar } = result?.data
                if(avatar) {
                    dispatch(setAvatar(avatar))
                }
            }
        })

    })
})


export const {
    useLazyGetUsersQuery,
    useSignupMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUploadFileMutation
} = userApiSlice