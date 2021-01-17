import "../css/ProducePage.css"
import React, {useState, useEffect} from 'react'
import axios from 'axios'
// import BackToHomeButton from '../components/BackToHomeButton'
import Footer from '../components/Footer'
import Navbar from "../components/Navbar"
import { v4 as uuidv4 } from 'uuid';

function ProducePage() {
    const [file, setFile] = useState("")
    const [filename, setFilename] = useState("")
    const [display,setDisplay] = useState("")
    const [result, setResult] = useState("")
    useEffect(async () => {
        // nothing
    },[])

    const onFileChange = event => {
        setFile(event.target.files[0])
        setFilename(uuidv4() + '-' + event.target.files[0].name)
        //setDisplay(<img src={file} alt='image should show here'/>)
    }

// setDisplay(<p>{body.result}</p>)
                
                // fetch(`http://localhost:500/file/${file}`, {
                //     method: 'GET'
                // }).then((response) => {
                //     response.json().then((body) => {
                //         setDisplay(<img src={`http://localhost:5000/${body.file}`} alt='image should show here'/>)
                //     })
                // })

    const onSubmit = event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('file', file)
        formData.append('filename', filename)

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
            }).then((response) => response.json()).then(response => {
                console.log(response.url)
                setDisplay(<img src={response.url} alt='image should show here'/>)
            }).then(() => {
                fetch(`/predict?imgPath=${filename}`).then(res => res.json()).then(data => {
                    console.log(data.predictions)
                    setResult(data.predictions)
                })
            }

        // axios.post("https://rottenfresh.herokuapp.com/api/user-profile", formData, {
        // }).then(async res => {
        //     const {profileImg} = res.data.userCreated
        //     setDisplay(<img src={profileImg} alt='image should show here'/>)
        //     fetch(`/mask?imgPath=${profileImg}`).then(res => res.json()).then(data => {
        //         console.log(data.predictions)
        //         setResult(data.predictions)
        //     })
        // })
    }

    const toggleText = () => {
        var text = document.getElementById("demo");
        if (text.style.display === "none") {
          text.style.display = "block";
        } else {
          text.style.display = "none";
        }
      }

    const onButtonClick = () => {
        document.getElementById('loading').className="show"
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
                {result === "" && display !== "" && <p> loading prediction... </p>}
                {result !== "" && <p> 
                    prediction: your {result["predictedFruitOfAll"]} is {result["predictedFreshness"]}  
                </p>}
                {/* {result !== "" && <p> prediction: {result} </p>} */}
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