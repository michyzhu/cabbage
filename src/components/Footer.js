import React from 'react'
import {Link} from "react-router-dom"

function Footer() {
    return (
        <Link to="/">
            <p className="footer">back to home</p>
        </Link>
    )
}

export default Footer