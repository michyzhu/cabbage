import React from 'react'
// import {Button} from 'semantic-ui-react'
import {Link} from "react-router-dom"
import Navbar from "../components/Navbar"
import InvisibleFooter from "../components/InvisibleFooter"

function HomePage() {
    return (
        <>
        <div className="body">
            <Navbar/>
            <div className="home">
                <h1>how's your</h1>
                <h1>produce?</h1>
                <br/>
                <p>let us judge how ugly your produce is.</p>
                {/* <br/> */}
                <Link to="/app">
                    <button className="main-button">
                        <p>try it</p>
                    </button>
                </Link>
                <br/>
            </div>
            <InvisibleFooter/>
        </div>
        </>
    )
}

export default HomePage