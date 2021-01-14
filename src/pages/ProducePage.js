import "../css/ProducePage.css"
import React, {useState, useEffect} from 'react'
import axios from 'axios'
// import BackToHomeButton from '../components/BackToHomeButton'
import Footer from '../components/Footer'
import Navbar from "../components/Navbar"
import * as tf from '@tensorflow/tfjs'

function ProducePage() {
    const [file, setFile] = useState("")
    const [display,setDisplay] = useState("")
    const [result, setResult] = useState("")
    const [models, setModels] = useState({})
    useEffect(async () => {
        // nothing
    },[])

    const onFileChange = event => {
        setFile(event.target.files[0])
    }

    const onSubmit = event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('profileImg', file)
        
        axios.post("http://localhost:5000/api/user-profile", formData, {
        }).then(async res => {
            const {profileImg} = res.data.userCreated
            setDisplay(<img src={profileImg} alt='image should show here'/>)
            fetch(`/mask?imgPath=${profileImg}`).then(res => res.json()).then(data => {
                console.log(data.predictions)
                setResult(data.predictions)
            })
        })
    }

    return (
        <>
        <div className="body">
        <Navbar />
            <div className="actualapp">
                <h1>the app</h1>
                <br/>
                <p>
                    upload an image (.jpg, .jpeg, .png) of your produce. we'll identify the produce 
                    type and tell you how rotten it is. warning: giving us your 
                    image gives permission to post it on twitter!!!
                </p>
                {/* <hr></hr> */}
                {/* <label className="uploadfile">
                    <p>uploadthefile</p>
                </label> */}
                <label className="hi">
                <input type="file" onChange={onFileChange}/>
                </label>
                <br/><br/>
                <button onClick={onSubmit}>evaluate</button>
                <br/>
                {result !== "" && <p> Our prediction is: {result} </p>}
                <br/><br/>
                {display !== "" && display}
            </div>
            <Footer/>
        </div>
        </>
    )
}

export default ProducePage