import React from 'react'
import {Link} from "react-router-dom"
import BackToHomeButton from '../components/BackToHomeButton'

function AboutPage() {
    return (
        <>
        <div className="body">
            <div className="about">
                <h1>about the project</h1>
                <br/>
                <p>
                    peach 'n cabbage started as a fun passion project for
                    CMU students Katie Shaw and Michelle Zhu. it's composed of 
                    two parts: the app, an application that identifies your produce 
                    and tells you if it's rotten, and the bot, a Twitter bot that 
                    periodically posts photos of fruit. this is filler text lalala
                </p>
                <br/>
                <p>
                    languages/programs used: CSS, React, Node.js, Express, 
                    Tensorflow, Python
                </p>
                <br/>
                <p>
                    to see our github repository, <a href="http://google.com" target="_blank">click here</a>
                </p>
            </div>
                <p>contact form</p>
                <BackToHomeButton/>
        </div>
        </>
    )
}

export default AboutPage