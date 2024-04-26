import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../home.css'
import { doSignOut } from '../firebase/auth'
import { useAuth } from '../context'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()


    const onLogout = async (e) => {
        e.preventDefault()
        await doSignOut();
    }

    return (
        <nav>
            <div class="navright">
                <ul>
                    {userLoggedIn && <Link to={'/'}>  <li>
                        Home
                    </li></Link>}

                    {userLoggedIn && <Link to={'/history'}>  <li>
                        History
                    </li></Link>}
                    {userLoggedIn ? <li onClick={onLogout}>Logout</li> : ''}
                </ul>
            </div>
        </nav>

    )
}

export default Header