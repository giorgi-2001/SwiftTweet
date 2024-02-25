import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useLazyGetUsersQuery } from "./userApiSlice"
import { UserType } from "../auth/authSlice"
import UserListItem from "./UserListItem"
import Spiner from "../../animations/spiner/Spiner"

const SearchUsers = () => {

  const [keyWord, setKeyWord] = useState('')
  const [container, setContainer] = useState(false)

  const [triger, {
    isSuccess,
    data: users, 
    isLoading,
    isUninitialized
  }] = useLazyGetUsersQuery()

    
  const myTimeOut = useRef<NodeJS.Timeout | undefined>()

  useEffect(() => {
    clearInterval(myTimeOut.current)

    if(!keyWord) {
      return setContainer(false)
    }

    setContainer(true)
    myTimeOut.current = setTimeout(() => {
      triger(keyWord)
    }, 1000) 

  }, [keyWord])

  const handleBlur = () => {
    setTimeout(() => {
      setContainer(false)
    }, 200)
  }

  let userList

  if (isLoading) {
    userList = <Spiner color="rgb(161, 161, 170)" size={10} />
  } else if (isSuccess && !users?.length) {
    userList = <p>No such user found</p>
  } else if (isSuccess && users.length) {
    userList = users.map((user: UserType) => <UserListItem key={user._id} user={user} />)
  }


  const userContainer = (container && !isUninitialized) ?  (
      <div className="absolute z-10 w-full min-w-60 max-h-half-screen bg-zinc-50 p-6 rounded-lg top-10 overflow-y-scroll overflow-x-clip shadow-xl shadow-black/30">
        {userList}
      </div>
    ) : null

  return (
    <div className="relative">
        <input 
            type="text"
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            onFocus={() => keyWord && setContainer(true)}
            onBlur={handleBlur}
            placeholder="users"
            className="py-1 px-4 rounded-full bg-zinc-50 focus:border-none focus:outline-2 focus:outline-teal-400 w-full"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-400">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        {userContainer}
    </div>
  )
}

export default SearchUsers