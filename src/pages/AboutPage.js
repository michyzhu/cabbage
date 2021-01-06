import React from 'react'
import {Link} from "react-router-dom"
import BackToHomeButton from '../components/BackToHomeButton'

function AboutPage() {
    return (
        <>
        <h1>produce about page</h1>
        <Link to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            <label>link to our github</label>
        </Link>
        <p>blah blah text about us</p>
        <p>contact form</p>
        <BackToHomeButton/>
        </>
    )
}

export default AboutPage