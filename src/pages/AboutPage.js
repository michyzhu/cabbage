import "../css/AboutPage.css"
import React from 'react'
// import {Link} from "react-router-dom"
// import BackToHomeButton from '../components/BackToHomeButton'
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"


function AboutPage() {
    return (
        <>
        <div className="body">
            <Navbar/>
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
                    for more details, 
                    feel free to visit our <a href="http://google.com" target="_blank">github repository</a>
                </p>
            </div>
            <Footer/>
        </div>
        </>
    )
}

export default AboutPage