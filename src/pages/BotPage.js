import React from 'react'
import {Link} from "react-router-dom"
import BackToHomeButton from '../components/BackToHomeButton'

function AboutPage() {
    return (
        <>
        <div class="body">
            <h1>say hi to our bot</h1>
            <p>want an ugly twitter bot? you have come to the right place.</p>
            <BackToHomeButton/>
        </div>
        </>
    )
}

export default AboutPage