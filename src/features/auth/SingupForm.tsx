import { useState, useEffect, useRef, FormEvent } from "react"
import { useSignupMutation } from "../users/userApiSlice"
import { useLoginMutation } from "./authApiSlice"
import { toast } from "react-toastify"

const userRegex = /^\w{4,}$/
const pwdRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/


const SignupForm = () => {

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPaddword, setShowPassword] = useState(false)

    const [validUsername, setValidUsername] = useState(true)
    const [validPassword, setValidPassword] = useState(true)

    useEffect(() => {
        if(!username) {
            return setValidUsername(true)
        }
        setValidUsername(userRegex.test(username))
    }, [username])

    useEffect(() => {
        if(!password) {
            return setValidPassword(true)
        }
        setValidPassword(pwdRegex.test(password))
    }, [password])

    useEffect(() => {
        if(inputRef.current) {
            inputRef.current.focus()
        }   
    }, [inputRef])

    const [signup, { isSuccess }] = useSignupMutation()
    const [login] = useLoginMutation()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!validPassword || !validUsername) {
            return toast.error("Invalid username or password")
        }

        try {
            const data = await signup({ username, password }).unwrap()
            toast.success(data.message)
        } catch (error: any) {
            if('data' in error) {
                toast.error(error.data.message)
            }
        }
    }

    useEffect(() => {
        const loginAfterSignup = async () => {
            try {
                await login({ username, password }).unwrap()
            } catch (error: any) {
                if ('data' in error) {
                    console.log(error.data.message)
                }
            }
        }
        if(isSuccess) {
            loginAfterSignup()
        }
    }, [isSuccess])

    const onUserInputFocused = () => {
        toast.info("username must be at least 4 characters long")
    }

    const onPwdInputFocused = () => {
        toast.info("Password must be at least 8 characters long. It must contain Uppercase, Lowercase, Number and Special characters")
    }

  return (
    <form onSubmit={handleSubmit} className="w-100 sm:min-w-72 p-6 bg-zinc-200 rounded-md">
        <label className="text-zinc-800 font-medium" htmlFor="user">Username:</label>
        <input 
            type="text" 
            id="user"
            required
            autoComplete="off"
            onFocus={onUserInputFocused}
            ref={inputRef}
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={`block w-full mb-4 py-2 px-3 rounded-md ${validUsername ? '' : 'outline outline-2 outline-rose-500'}`}
        />

        <label className="text-zinc-800 font-medium" htmlFor="password">Password:</label>
        <input 
            type={showPaddword ? 'text' : 'password'}
            id="password"
            required
            autoComplete="off"
            title="min 8 chars. must include Uppercase, Lowercase, Number and Special character"
            onFocus={onPwdInputFocused}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`block w-full mb-4 py-2 px-3 rounded-md ${validPassword ? '' : 'outline outline-2 outline-rose-500'}`}
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
        <button className="block w-fit py-1 px-6 bg-teal-500 rounded-md text-white font-semibold hover:bg-teal-400 focus:bg-teal-300">Sing up</button>
    </form>
  )
}

export default SignupForm