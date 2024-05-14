import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import { socket } from "../../main"

export type UserType = {
    _id: string,
    username: string,
    avatar: string
}

type AuthStateType = {
    user: UserType | null,
    token: string
}

const initialState: AuthStateType = {
    user: null,
    token: ''
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload
            state.user = user
            state.token = token

            socket.emit('login', user)
        },

        logout: (state) => {
            socket.emit('logout', state.user)

            state.user = null
            state.token = ''
            localStorage.removeItem("refresh")
        },

        setAvatar: (state, action) => {
            if (state.user) {
                state.user.avatar = action.payload
            }
        }
    }
})


export const { setCredentials, logout, setAvatar } = authSlice.actions

export default authSlice.reducer


export const selectUser = (state: RootState) => state.auth.user

export const selectToken = (state: RootState) => state.auth.token