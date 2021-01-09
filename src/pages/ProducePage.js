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
            console.log(`the message name? ${res.data.message}`)
            const {fileName, newFileURL} = res.data.userCreated
            setDisplay(newFileURL)
        })
    }
    
    const saveFileSelected = async () => {
        if(file === '') return
        const getRes = await axios.get('/api/produce')

        var fd = new FormData()
        fd.append('image',file,file.name)
        console.log(fd)
        const sentImage = await axios.post('/api/produce/upload-file',fd, {
            onUploadProgress: progressEvent => {
                console.log('Upload Progress: ' + Math.round(100 * progressEvent.loaded / progressEvent.total))
            }
        })
            .then(res => {
                console.log(res)
            })
        const received = await sentImage.json()
        setDisplay(received)
    }


    return (
        <>
        <h1>actual app!!!</h1>
        <input type="file" onChange={onFileChange}/>
        <label>click to upload image of your produce</label>
        <br />
        <img src={file} alt='image should show here'/>
        <p>warning: giving us your image gives permission to post it on twitter!!!</p>
        <button onClick={onSubmit}>click to evaluate your produce</button>
        <br/><br/>
        <BackToHomeButton/>
        <img src={file} alt='image should show here'/>
        {display !== "" && <p>display</p>}
        </>
    )
}

export default ProducePage