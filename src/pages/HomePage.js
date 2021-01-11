import React from 'react'
import {Button} from 'semantic-ui-react'
import {Link} from "react-router-dom"

function HomePage() {
    return (
        <>
        <div class="body">
            <div class="home">
                <h1>how's your</h1>
                <h1>produce?</h1>
                <br/>
                <p>we can tell you when your produce will go bad.</p>
                <br/>
                <Link to="/app">
                    <Button className="main-button">
                        <p>try it</p>
                    </Button>
                </Link>
                <br/>
                {/* <Link to="/about">
                    <Button className="about-button">
                        <p>about us</p>
                    </Button>
                </Link> */}
            </div>
        </div>
        </>
    )
}

export default HomePage