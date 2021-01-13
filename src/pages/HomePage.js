import React from 'react'
import {Button} from 'semantic-ui-react'
import {Link} from "react-router-dom"

function HomePage() {
    return (
        <>
        <div className="body">
            <div className="home">
                <h1>how's your</h1>
                <h1>produce?</h1>
                <br/>
                <p>let us judge how ugly your produce is.</p>
                <br/>
                <Link to="/app">
                    <button class="main-button">
                        <p>try it</p>
                    </button>
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