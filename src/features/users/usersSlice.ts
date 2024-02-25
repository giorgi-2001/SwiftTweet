import { createSlice } from "@reduxjs/toolkit"
import { UserType } from "../auth/authSlice"
import { RootState } from "../../app/store"


type ActiveUser = {
    socketId: string,
} & UserType

const initialState: {
    activeUsers: ActiveUser[]
} = {
    activeUsers: []
}

const usersSlice = createSlice({
    name: 'activeUsers',
    initialState,
    reducers: {
        setActiveUsers: (state, action) => {
            state.activeUsers = action.payload
        }
    }
})


export default usersSlice.reducer

export const { setActiveUsers } = usersSlice.actions

export const selectActiveUsers = (state: RootState) => state.activeUsers.activeUsers