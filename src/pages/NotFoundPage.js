import "../css/NotFoundPage.css"
import React from 'react'
import Footer from '../components/Footer'
import Navbar from "../components/Navbar"

function NotFoundPage() {
    return (
        <>
        <div className="body">
            <Navbar/>
            <div className="notfound">
                <h1>why you here go find some cabbages</h1>
                <p>you a poo</p>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default NotFoundPage