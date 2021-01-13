import React, {useState, useEffect} from 'react'
import axios from 'axios'
import BackToHomeButton from '../components/BackToHomeButton'
import * as tf from '@tensorflow/tfjs'

function ProducePage() {
    const [file, setFile] = useState("")
    const [display,setDisplay] = useState("")
    const [result, setResult] = useState("")
    const [models, setModels] = useState({})
    useEffect(async () => {
        const modelName = 'abo'
        fetch(`/predict?modelName=${modelName}`).then(res => res.json()).then(data => {
            setDisplay(`model ${data.modelName} loaded`)
        })
        setModels({
            "model": await tf.loadLayersModel('http://localhost:5000/public/models/model/model.json'),
            "aboModel": await tf.loadLayersModel('http://localhost:5000/public/models/aboModel/model.json'),
            "apple": await tf.loadLayersModel('http://localhost:5000/public/models/applesModel/model.json'),
            "banana": await tf.loadLayersModel('http://localhost:5000/public/models/bananasModel/model.json'),
            "orange": await tf.loadLayersModel('http://localhost:5000/public/models/orangesModel/model.json'),
        })
    },[])

    const onFileChange = event => {
      setFile(event.target.files[0])
    }

    const loadImage = async profileImg => {
        var myImage = new Image(100,100);
        myImage.crossOrigin = "anonymous"
        myImage.src = profileImg;
        return new Promise((resolve, reject) => {
            myImage.onload = () => resolve(myImage);
            myImage.onerror = reject;
        });
    }

    const makePrediction = (myImage) => {
        var example = tf.browser.fromPixels(myImage)  // for example
        example = example.expandDims()
        tf.stack([example])
        const scaleFactor = tf.scalar(255);
        example = example.div(scaleFactor)
        
        
        // order of these matters(for indexing purposes)
        const allFruits = ['Apple Braeburn', 'Apple Crimson Snow', 'Apple Golden 1', 'Apple Golden 2', 'Apple Golden 3', 'Apple Granny Smith', 'Apple Pink Lady', 'Apple Red 1', 'Apple Red 2', 'Apple Red 3', 'Apple Red Delicious', 'Apple Red Yellow 1', 'Apple Red Yellow 2', 'Apricot', 'Avocado', 'Avocado ripe', 'Banana', 'Banana Lady Finger', 'Banana Red', 'Beetroot', 'Blueberry', 'Cactus fruit', 'Cantaloupe 1', 'Cantaloupe 2', 'Carambula', 'Cauliflower', 'Cherry 1', 'Cherry 2', 'Cherry Rainier', 'Cherry Wax Black', 'Cherry Wax Red', 'Cherry Wax Yellow', 'Chestnut', 'Clementine', 'Cocos', 'Corn', 'Corn Husk', 'Cucumber Ripe', 'Cucumber Ripe 2', 'Dates', 'Eggplant', 'Fig', 'Ginger Root', 'Granadilla', 'Grape Blue', 'Grape Pink', 'Grape White', 'Grape White 2', 'Grape White 3', 'Grape White 4', 'Grapefruit Pink', 'Grapefruit White', 'Guava', 'Hazelnut', 'Huckleberry', 'Kaki', 'Kiwi', 'Kohlrabi', 'Kumquats', 'Lemon', 'Lemon Meyer', 'Limes', 'Lychee', 'Mandarine', 'Mango', 'Mango Red', 'Mangostan', 'Maracuja', 'Melon Piel de Sapo', 'Mulberry', 'Nectarine', 'Nectarine Flat', 'Nut Forest', 'Nut Pecan', 'Onion Red', 'Onion Red Peeled', 'Onion White', 'Orange', 'Papaya', 'Passion Fruit', 'Peach', 'Peach 2', 'Peach Flat', 'Pear', 'Pear 2', 'Pear Abate', 'Pear Forelle', 'Pear Kaiser', 'Pear Monster', 'Pear Red', 'Pear Stone', 'Pear Williams', 'Pepino', 'Pepper Green', 'Pepper Orange', 'Pepper Red', 'Pepper Yellow', 'Physalis', 'Physalis with Husk', 'Pineapple', 'Pineapple Mini', 'Pitahaya Red', 'Plum', 'Plum 2', 'Plum 3', 'Pomegranate', 'Pomelo Sweetie', 'Potato Red', 'Potato Red Washed', 'Potato Sweet', 'Potato White', 'Quince', 'Rambutan', 'Raspberry', 'Redcurrant', 'Salak', 'Strawberry', 'Strawberry Wedge', 'Tamarillo', 'Tangelo', 'Tomato 1', 'Tomato 2', 'Tomato 3', 'Tomato 4', 'Tomato Cherry Red', 'Tomato Heart', 'Tomato Maroon', 'Tomato Yellow', 'Tomato not Ripened', 'Walnut', 'Watermelon']
        const threeFruits = ["apple","banana","orange"]
        
        // normal predict
        var prediction = models["model"].predict(example);
        var maxProb = prediction.argMax(1);
        maxProb = maxProb.dataSync()[0];
        const predictedFruitFromAll = allFruits[maxProb]

        prediction = models["aboModel"].predict(example)
        //console.log("fruit:")
        //prediction.print()
        maxProb = prediction.argMax(1)
        maxProb = maxProb.dataSync()[0];
        //console.log(maxProb)
        const predictedFruitOfThree = threeFruits[maxProb]

        // print(predictedFruit, actual)
        const model = models[predictedFruitOfThree]
        prediction = model.predict(example)
        //console.log("freshness:")
        prediction.print()
        prediction = prediction.dataSync()[0];
        //console.log(prediction)
        const predictedFreshness = prediction > 0.5 ? 'rotten' : 'fresh'
        
        setResult(`all: ${predictedFruitFromAll}, three: ${predictedFruitOfThree}, fresh: ${predictedFreshness}`)
    }

    const onSubmit = event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('profileImg', file)
        
        axios.post("http://localhost:5000/api/user-profile", formData, {
        }).then(async res => {
            const {profileImg} = res.data.userCreated
            
            fetch(`/mask?imgPath=${profileImg}`).then(res => res.json()).then(data => {
                // const croppedFD = new FormData()
                // formData.append('croppedImg', data.newImages[0])

                // axios.post("http://localhost:5000/api/user-profile",formData, {
                // }).then(async res => {
                //     const {croppedImg} = res.data.
                // })
                setDisplay(<img src={data.newImages[0]} alt='image should show here'/>)
            })
            //setDisplay(<img src={profileImg} alt='image should show here'/>)

            await loadImage(profileImg)
            .then(
                myImage => {makePrediction(myImage)},
                myImage => {console.log(`failed at ${myImage}`)}
            )
        })
    }


    return (
        <>
        <div className="body">
            <div className="actualapp">
                <h1>the app</h1>
                <br/>
                <p>
                    upload an image of your produce. we'll identify the produce 
                    type and tell you how rotten it is. warning: giving us your 
                    image gives permission to post it on twitter!!!
                </p>
                <input type="file" onChange={onFileChange}/>
                <label>click to upload image of your produce</label>
                <br/><br/>
                <button onClick={onSubmit}>click to evaluate your produce</button>
                <br/><br/>
                {display !== "" && display}
                <br/>
                {result !== "" && <p> Our prediction is: {result} </p>}
                </div>
                <BackToHomeButton/>
        </div>
        </>
    )
}

export default ProducePage