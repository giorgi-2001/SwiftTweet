import { Outlet } from "react-router-dom";
import { useEffect, useRef } from 'react'
import { useRefreshMutation } from "./authApiSlice";
import Spiner from "../../animations/spiner/Spiner";

const Persist = () => {

    const [refresh, { isLoading }] = useRefreshMutation()

    const effeactRan = useRef(false)

    useEffect(() => {
        if (effeactRan.current) return

        const refreshToken = localStorage.getItem('refresh')

        if (refreshToken) {
            refresh(refreshToken)
        }

        return () => { effeactRan.current = true }
    }, [])


    if (isLoading) {
        return <Spiner color="bg-zinc-600" size={40} />
    } else {
        return <Outlet />
    }
}

export default Persist