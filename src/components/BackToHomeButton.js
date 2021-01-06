import React from 'react'
//import {Button} from 'semantic-ui-react'
import Button from 'react-bootstrap/Button'
import {Link} from "react-router-dom"

function BackToHomeButton() {
    return (
        <>
        <Link to="/">
            <Button className="back-to-home">
                <p>click to go to go back to the homepage</p>
            </Button>
        </Link>
        </>
    )
}

export default BackToHomeButton