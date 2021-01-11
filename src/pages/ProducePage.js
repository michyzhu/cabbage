import React, {useState} from 'react'
import axios from 'axios'
import BackToHomeButton from '../components/BackToHomeButton'
import * as tf from '@tensorflow/tfjs'

function ProducePage() {
    const [file, setFile] = useState("")
    const [display,setDisplay] = useState("")
    const [result, setResult] = useState("")
    
    const onFileChange = event => {
      setFile(event.target.files[0])
    }

    const onSubmit = event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('profileImg', file)
        
        axios.post("/api/user-profile", formData, {
        }).then(async res => {
            console.log(res)
            const {profileImg} = res.data.userCreated
            console.log(profileImg)
            setDisplay(<img src={display} alt='image should show here'/>)

            const model = await tf.loadLayersModel('http://localhost:8000/public/models/applesModel.json');
            const example = tf.browser.fromPixels(display);  // for example
            const prediction = model.predict(example);
            setResult(prediction)
        })
    }


    return (
        <>
        <div class="body">
            <h1>actual app!!!</h1>
            <input type="file" onChange={onFileChange}/>
            <label>click to upload image of your produce</label>
            <br />
            <p>warning: giving us your image gives permission to post it on twitter!!!</p>
            <button onClick={onSubmit}>click to evaluate your produce</button>
            <br/><br/>
            {display !== "" && display}
            <br/>
            {result !== "" && <p> Our prediction is: {result} </p>}
            <br/><br/>
            <BackToHomeButton/>
        </div>
        </>
    )
}

export default ProducePage