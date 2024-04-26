import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/'
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'
import '../home.css'
import cream from '../assets/cream.jpg'

const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await doCreateUserWithEmailAndPassword(email, password)
            alert("sign up successful")
        } catch (r) {
            alert("Please try again")
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}


            <div class="parent">

                <div class="child">
                    <div class="left">
                        <img src={cream} />


                    </div>
                    <div class="right">

                        <div class="bottom">
                            <div class="inputs">
                                <form onSubmit={onSubmit}>
                                    <input type="text" class="upload" placeholder="Username" onChange={(e) => setName(e.target.value)} />
                                    <input type="text" class="upload" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                    <input type="password" class="upload" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                                    <button class="upload" type="submit">
                                        Create account
                                    </button>
                                </form>

                                <Link to={'/login'}>
                                    <button class="upload">
                                        Already have an account?
                                    </button>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default Register