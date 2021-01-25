# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To Run

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Clone the repository
Run `pip install -r requirements.txt` and `npm install` for the required node packages
To run on localhost, run `npm start`

## About This App

For the sake of documentation (and a personal reflection), we’ll delve into some things we did and dealt with here.

peachyproduce originated as an attempt by two friends to explore web development, basic ML pertaining to computer vision methods, and effective UI/UX design. The goal was an application that takes in an image of produce, classifies what type of produce it is, and determines whether the produce was fresh or rotten; this touches(albeit shallowly) upon an existing field of research within agriculture and crop evaluation. The React/Flask app interfaces with a mongodb database, which serves to store the images uploaded to our app.

### Frontend/Website Design

On the web development side, we decided early on that we wanted to use ReactJS for the frontend. We went through a myriad of tutorials covering HTML, CSS, Javascript, and ReactJS for fundamental knowledge; then, we built the website with create-react-app. For the actual design of the website, we analyzed others’ online portfolios and web applications, eventually sticking with a classic minimalist look and an earthy color palette.

![website storyboard](https://github.com/michyzhu/cabbage/blob/master/websiteStoryboard.png?raw=true)

### Backend/Model Deployment

Our predictions depended upon two different ML models: the first was a transfer learning CNN model based upon MobileNetv3, which performed a categorical classification of images into 36 categories of fruits. Initially, we attempted to train upon the traditional [Fruit 360](https://www.kaggle.com/moltean/fruits) dataset, which sorted images into 131 categories of fruits. Since the Fruit 360 dataset contains images with white backgrounds, we additionally implemented instance segmentation using the [Mask-RCNN](https://github.com/matterport/Mask_RCNN) library in order to preprocess images and mask their backgrounds to white before putting them through the Fruit 360 dataset. However, these trials failed, as Mask-RCNN is not precise enough to outline fruits for effective predictions with Fruit 360. Therefore, we sought out the kaggle [Fruit and Vegetable Image Recognition dataset](https://www.kaggle.com/kritikseth/fruit-and-vegetable-image-recognition), which contains fruit images with noisy backgrounds and consequently don’t require any masking or hyper-effective background removal. We used Mask-RCNN to simply identify fruits’ ROIs and predict within its region. Our second ML model determined freshness; using [this kaggle dataset](https://www.kaggle.com/sriramr/fruits-fresh-and-rotten-for-classification), we used a basic CNN to perform a binary classification in determining whether fruits were fresh or rotten.

To deploy the model, we initially attempted to use the relatively new tensorflow.js, a lightweight framework that integrates directly with the frontend. However, due to our need to use the Mask-RCNN library, we migrated from a Node.js to a Flask backend. Unfortunately, though our React/Node framework was successfully deployed to Heroku, we have as of now not pushed past [some annoying roadblocks](https://stackoverflow.com/questions/65819259/modulenotfounderror-no-module-named-tensorflow-when-i-test-my-flask-react-app) with regards to deploying our application through Flask and gunicorn.
