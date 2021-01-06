import React, {useState} from 'react'
import axios from 'axios'
import BackToHomeButton from '../components/BackToHomeButton'

function ProducePage() {
    const [file, setFile] = useState("")
    const [display,setDisplay] = useState("")
    const handleFileSelected = event => {
        setFile(event.target.files[0])
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
        <input type="file" onChange={handleFileSelected}/>
        <label>click to upload image of your produce</label>
        <p>warning: giving us your image gives permission to post it on twitter!!!</p>
        <button onClick={saveFileSelected}>click to evaluate your produce</button><br/>
        <BackToHomeButton/>
        {display !== "" && <p>display</p>}
        </>
    )
}

export default ProducePage