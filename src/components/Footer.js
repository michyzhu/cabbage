import React from 'react'
import {Link} from "react-router-dom"

function Footer() {
    return (
        <div className="footer">
        <Link to="/">
            <p>back to home</p>
        </Link>
        </div>
    )
}

export default Footer