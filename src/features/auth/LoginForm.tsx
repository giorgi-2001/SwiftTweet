import { FormEvent, useEffect, useRef, useState } from "react"
import { useLoginMutation } from "./authApiSlice"
import { toast } from "react-toastify"

const LoginForm = () => {

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPaddword, setShowPassword] = useState(false)


    const [login] = useLoginMutation()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        try {
            await login({ username, password }).unwrap()
        } catch (error: any) {
            if ('data' in error) {
                const { message } = error.data
                toast.error(message)
            }
        }
    }

    useEffect(() => {
        if(inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef])


  return (
    <form onSubmit={handleSubmit} className="w-full sm:min-w-72 p-6 bg-zinc-200 rounded-lg">
        <label className="text-zinc-800 font-medium" htmlFor="user">Username:</label>
        <input 
            type="text" 
            id="user"
            required
            autoComplete="off"
            ref={inputRef}
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="block w-full mb-4 py-2 px-3 rounded-md"
        />

        <label className="text-zinc-800 font-medium" htmlFor="password">Password:</label>
        <input 
            type={showPaddword ? 'text' : 'password'}
            id="password"
            required
            autoComplete="off"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="block w-full mb-4 py-2 px-3 rounded-md"
        />
        <div className="flex gap-2 mb-4">
            <input 
                type="checkbox" 
                id="show"
                checked={showPaddword} 
                onChange={() => setShowPassword(prev => !prev)}
            />
            <label className="text-zinc-800 font-medium" htmlFor="show">Show Password</label>
        </div>
        <button className="block w-fit py-1 px-6 bg-teal-500 rounded-md text-white font-semibold hover:bg-teal-400 focus:bg-teal-300">Sing in</button>
    </form>
  )
}

export default LoginForm