import React from 'react'
//import {Button} from 'semantic-ui-react'
//import Button from 'react-bootstrap/Button'
import {Link} from "react-router-dom"

function BackToHomeButton() {
    return (
        <>
        <button className="back-to-home">
            <Link to="/">
                <p>back to home</p>
            </Link>
        </button>
        </>
    )
}

export default BackToHomeButton