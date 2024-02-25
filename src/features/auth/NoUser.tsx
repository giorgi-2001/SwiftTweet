import { useSelector } from "react-redux"
import { selectToken } from "./authSlice"
import { Navigate, Outlet } from "react-router-dom"

const NoUser = () => {

    const token = useSelector(selectToken)

    if (!token) {
        return <Outlet />
    } else {
        return <Navigate to="/home" />
    }
}

export default NoUser