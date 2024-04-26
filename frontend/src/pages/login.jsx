import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../firebase/auth'
import { useAuth } from '../context/'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css'
import cream from '../assets/cream.jpg'
import aes from '../assets/aes2.jpg'
const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await doSignInWithEmailAndPassword(email, password);
            alert("sign in success")
        } catch (error) {
            console.error("Sign-in error:", error.message);
            alert("Sign-in unsuccessful. Please check your email and password.");
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

                                    <input type="text" class="upload" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                    <input type="password" class="upload" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                                    <button class="upload" type="submit">
                                        Login
                                    </button>
                                </form>
                                <Link to={"/register"}>
                                    <button class="upload">
                                        Create an account here
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div class="parent">

                <div class="child">

                    <svg class="semi" height="100" width="100">
                        <path d="M 0 99 C 0 22 99 22 99 99 " fill="none" stroke-width="2" stroke="#807f7e" />
                    </svg>
                    <div class="left">
                        <h3>Give me a skin image and i will look at it for you.</h3>
                        <br />
                        <h4>Did you know😲? Each inch of skin contains 19 million skin cells, 650 sweat glands, 20 blood
                            vessels,
                            and 1,000
                            nerve endings. The skin accounts for about 15% of the body weight and is our first line of defense
                            against irritants and allergens.</h4>
                        <br />
                        <br />
                        <Link to={"/register"}>
                            <button class="upload">
                                Create an account here 📝
                            </button>
                        </Link>


                    </div>
                    <div class="right">
                        <form onSubmit={onSubmit}>
                            <input type="text" class="upload" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" class="upload" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                            <button class="upload" type="submit">
                                Login 🔓
                            </button>
                        </form>

                    </div>
                </div>
            </div> */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default Login