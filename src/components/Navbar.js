import "../css/Navbar.css"
import React from "react"
import { Link } from 'react-router-dom';

function Navbar() {
    return(
        <nav>
            <img src="https://rottenfresh.herokuapp.com/public/frontEndImages/logo.png" alt="peach" id="logo"/>
            <ul>
                <li>
                    <Link to="/">home</Link>
                </li>
                <li>
                    <Link to="/about">about</Link>
                </li>
                <li>
                    <Link to="/app">the app</Link>
                </li>
                <li>
                    <Link to="/bot">the bot</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar