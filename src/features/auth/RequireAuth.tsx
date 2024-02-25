import { useSelector } from "react-redux"
import { selectToken } from "./authSlice"
import { Navigate, Outlet } from "react-router-dom"

const RequireAuth = () => {

    const token = useSelector(selectToken)

    if (token) {
        return <Outlet />
    } else {
        return <Navigate to="/" />
    }
}

export default RequireAuth