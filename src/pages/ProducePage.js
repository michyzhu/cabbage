import "../css/ProducePage.css"
import React, {useState, useEffect} from 'react'
import Footer from '../components/Footer'
import Navbar from "../components/Navbar"
import { v4 as uuidv4 } from 'uuid';

function ProducePage() {
    const [file, setFile] = useState("")
    const [filename, setFilename] = useState("")
    const [display,setDisplay] = useState("")
    const [predictions, setPredictions] = useState([])
    useEffect(async () => {
        // nothing
    },[])

    const onFileChange = event => {
        setFile(event.target.files[0])
        setFilename(uuidv4() + '-' + event.target.files[0].name)
    }

    const onSubmit = event => {
        event.preventDefault()
        setDisplay("")
        setPredictions([])
        const formData = new FormData()
        formData.append('file', file)
        formData.append('filename', filename)

        fetch('/upload', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json()).then(response => {
            console.log(response.url)
            setDisplay(<img src={response.url} alt='image should show here'/>)
        }).then(() => {
            fetch(`/predict?imgPath=${filename}`).then(res => res.json()).then(data => {
                const newPredictions = []
                console.log(data.predictions)
                // data.predictions = [{p1:ans,p2:ans,p3:ans}, {p1:ans,p2:ans,p3:ans}, etc]
                for(var i=0; i < data.predictions.length; i++) {
                    var fruit = data.predictions[i].predictedFruitOfAll
                    var fresh = data.predictions[i].predictedFreshness
                    newPredictions.push(<p key={i}>prediction: your {fruit} is {fresh}</p>)
                }
                setPredictions(newPredictions)
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
                <br/><br/>
                {predictions.length === 0 && display !== "" && <p> loading prediction... </p>}
                {predictions.length !== 0 && predictions}
                <br/>
                <div className="imagegoeshere">
                    {display !== "" && display}
                </div>
            </div>
            <Footer/>
        </div>
        </>
    )
}

export default ProducePage