import React from 'react'
import {Button} from 'semantic-ui-react'
import {Link} from "react-router-dom"

function HomePage() {
    return (
        <>
        <h1>produce homepage</h1>
        <Link to="/produce">
            <Button className="main-button">
                <p>click to go to app</p>
            </Button>
        </Link>
        <br/>
        <Link to="/about">
            <Button className="about-button">
                <p>about us</p>
            </Button>
        </Link>
        </>
    )
}

export default HomePage