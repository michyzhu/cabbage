import React from 'react'
//import {Button} from 'semantic-ui-react'
//import Button from 'react-bootstrap/Button'
import {Link} from "react-router-dom"

function BackToHomeButton() {
    return (
        <>
        <Link to="/">
            <button className="back-to-home">
                <p>back to home</p>
            </button>
        </Link>
        </>
    )
}

export default BackToHomeButton