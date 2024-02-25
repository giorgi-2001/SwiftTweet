import { Outlet } from "react-router-dom";
import  { useEffect, useRef } from 'react'
import { useRefreshMutation } from "./authApiSlice";

const Persist = () => {

    const [refresh, { isLoading }] = useRefreshMutation()

    const effeactRan = useRef(false)

    useEffect(() => {
        if(effeactRan.current) return

        refresh(undefined)

        return () => { effeactRan.current = true }
    }, [])


    if (isLoading) {
        return null
    } else {
        return <Outlet />
    }
}

export default Persist