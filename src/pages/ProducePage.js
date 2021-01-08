import React, {useState} from 'react'
import axios from 'axios'
import BackToHomeButton from '../components/BackToHomeButton'
//import DefaultImg from '../components/bgimage.jpeg'
import UploadImage from "../components/UploadImage"

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

    // const setDefaultImage = (uploadType) => {
    //     if (uploadType === "multer") {
    //       this.setState({
    //         multerImage: DefaultImg
    //       })
    //     } else if (uploadType === "firebase") {
    //       this.setState({
    //         firebaseImage: DefaultImg
    //       })
    //     } else {
    //       this.setState({
    //         baseImage: DefaultImg
    //       })
    //     }
    // }

    // function to upload image once it has been captured
    // includes multer and firebase methods
    // const API_URL = "http://localhost:3000";

    // const uploadImage = (e, method) => {
    // let imageObj = {}

    // if (method === "multer") {

    //   let imageFormObj = new FormData()

    //   imageFormObj.append("imageName", "multer-image-" + Date.now())
    //   imageFormObj.append("imageData", e.target.files[0])

    //   // stores a readable instance of 
    //   // the image being uploaded using multer
    //   this.setState({
    //     multerImage: URL.createObjectURL(e.target.files[0])
    //   })

    //   axios.post(`${API_URL}/image/uploadmulter`, imageFormObj)
    //     .then((data) => {
    //       if (data.data.success) {
    //         alert("Image has been successfully uploaded using multer");
    //         this.setDefaultImage("multer");
    //       }
    //     })
    //     .catch((err) => {
    //       alert("Error while uploading image using multer");
    //       this.setDefaultImage("multer");
    //     })
    // }
    // }

    return (
        <>
        <h1>actual app!!!</h1>
        {/* <input type="file" className="process__upload-btn" onChange={(e) => this.uploadImage(e, "multer")} /> */}
        {/* <img src={this.state.multerImage} alt="upload-image" className="process__image" /> */}

        <UploadImage />

        {/* <input type="file" onChange={handleFileSelected}/>
        <label>click to upload image of your produce</label> */}
        <p>warning: giving us your image gives permission to post it on twitter!!!</p>
        {/* <button onClick={saveFileSelected}>click to evaluate your produce</button><br/> */}
        <BackToHomeButton/>
        {display !== "" && <p>display</p>}
        </>
    )
}

export default ProducePage