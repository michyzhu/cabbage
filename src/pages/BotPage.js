import React from 'react'
import {Link} from "react-router-dom"
import BackToHomeButton from '../components/BackToHomeButton'

function AboutPage() {
    return (
        <>
        <div className="body">
            <div className="bot">
                <h1>say hi to our bot</h1>
                <br/>
                <p>
                    want an ugly produce twitter bot? you have come to the right place.
                </p>
                <br />
                <p>
                    sarcastic filler text about our WONDERFUL TWITTER BOT 
                    with a link to it <a href="http://google.com" target="_blank">right here</a>
                </p>
            </div>
            <BackToHomeButton/>
        </div>
        </>
    )
}

export default AboutPage