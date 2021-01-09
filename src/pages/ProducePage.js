import React, {useState} from 'react'
import axios from 'axios'
import BackToHomeButton from '../components/BackToHomeButton'
//import DefaultImg from '../components/bgimage.jpeg'

function ProducePage() {
    const [file, setFile] = useState("")
    const [display,setDisplay] = useState("")
    
    
    const onFileChange = event => {
      setFile(event.target.files[0])
    }

    const onSubmit = event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('profileImg', file)
        
        axios.post("/api/user-profile", formData, {
        }).then(res => {
            console.log(res)
            const {profileImg} = res.data.userCreated
            console.log(profileImg)
            setDisplay(profileImg)
        })
    }


    return (
        <>
        <h1>actual app!!!</h1>
        <input type="file" onChange={onFileChange}/>
        <label>click to upload image of your produce</label>
        <br />
        <p>warning: giving us your image gives permission to post it on twitter!!!</p>
        <button onClick={onSubmit}>click to evaluate your produce</button>
        <br/><br/>
        <BackToHomeButton/>
        {display !== "" && <img src={display} alt='image should show here'/>}
        </>
    )
}

export default ProducePage