from keras.models import load_model
from mrcnn.config import Config
from mrcnn import model as modellib
from mrcnn import visualize
import cv2
import urllib
import urllib.request
import colorsys
import argparse
import imutils
import random
import os
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
#import skimage
from skimage.measure import find_contours


from flask import Flask
from flask import request
from flask_pymongo import PyMongo
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://cabbageDb:peachDb@cluster0.b6n76.mongodb.net/<dbname>?retryWrites=true&w=majority"#mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)


models = {}
for model in {"aboModel.h5", "model.h5", "applesModel.h5", "bananasModel.h5", "orangesModel.h5"}:
    models[model] = load_model(model)


fruits = ["apple","banana","orange"]
# for mrcnn
CLASS_NAMES = ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane',
                'bus', 'train', 'truck', 'boat', 'traffic light',
                'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird',
                'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear',
                'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie',
                'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
                'kite', 'baseball bat', 'baseball glove', 'skateboard',
                'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup',
                'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
                'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
                'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed',
                'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote',
                'keyboard', 'cell phone', 'microwave', 'oven', 'toaster',
                'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors',
                'teddy bear', 'hair drier', 'toothbrush']
bananaI, appleI, orangeI = CLASS_NAMES.index('banana'),CLASS_NAMES.index('apple'),CLASS_NAMES.index('orange')

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/predict')
def prediction():
    modelName = request.args.get("modelName")
    model = load_model("aboModel.h5")

    imgPath = request.args.get("imgPath")
    print("IMAGEPATH:", imgPath)
    
    with urllib.request.urlopen(imgPath) as url:
        s = url.read()
        img = np.asarray(bytearray(s), dtype="uint8")
        img = cv2.imdecode(img, cv2.IMREAD_COLOR)

    # img=cv2.imread(imgPath)
    img=cv2.resize(img, (100,100))
    img=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = np.expand_dims(img, axis=0)

    img = np.vstack([img])/255.0

    # normal predict
    fruitPredictClasses = model.predict(img, batch_size=10)
    max_prob = np.argmax(fruitPredictClasses)
    predictedFruit = fruits[max_prob]

    #record['feature2'] = pymongo.binary.Binary( pickle.dumps( y, protocol=2) ) )

    return {'modelName': predictedFruit}

# MASK-RCNN STUFF

class SimpleConfig(Config):
    # give the configuration a recognizable name
    NAME = "coco_inference"
    # set the number of GPUs to use along with the number of images
    # per GPU
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1
    # number of classes on COCO dataset
    NUM_CLASSES = 81


def predict(img): # takes in a np image
    img=cv2.resize(img, (100,100))
    img = np.expand_dims(img, axis=0)

    img = np.vstack([img])/255.0

    # List of all fruits
    allFruits = ['Apple Braeburn', 'Apple Crimson Snow', 'Apple Golden 1', 'Apple Golden 2', 'Apple Golden 3', 'Apple Granny Smith', 'Apple Pink Lady', 'Apple Red 1', 'Apple Red 2', 'Apple Red 3', 'Apple Red Delicious', 'Apple Red Yellow 1', 'Apple Red Yellow 2', 'Apricot', 'Avocado', 'Avocado ripe', 'Banana', 'Banana Lady Finger', 'Banana Red', 'Beetroot', 'Blueberry', 'Cactus fruit', 'Cantaloupe 1', 'Cantaloupe 2', 'Carambula', 'Cauliflower', 'Cherry 1', 'Cherry 2', 'Cherry Rainier', 'Cherry Wax Black', 'Cherry Wax Red', 'Cherry Wax Yellow', 'Chestnut', 'Clementine', 'Cocos', 'Corn', 'Corn Husk', 'Cucumber Ripe', 'Cucumber Ripe 2', 'Dates', 'Eggplant', 'Fig', 'Ginger Root', 'Granadilla', 'Grape Blue', 'Grape Pink', 'Grape White', 'Grape White 2', 'Grape White 3', 'Grape White 4', 'Grapefruit Pink', 'Grapefruit White', 'Guava', 'Hazelnut', 'Huckleberry', 'Kaki', 'Kiwi', 'Kohlrabi', 'Kumquats', 'Lemon', 'Lemon Meyer', 'Limes', 'Lychee', 'Mandarine', 'Mango', 'Mango Red', 'Mangostan', 'Maracuja', 'Melon Piel de Sapo', 'Mulberry', 'Nectarine', 'Nectarine Flat', 'Nut Forest', 'Nut Pecan', 'Onion Red', 'Onion Red Peeled', 'Onion White', 'Orange', 'Papaya', 'Passion Fruit', 'Peach', 'Peach 2', 'Peach Flat', 'Pear', 'Pear 2', 'Pear Abate', 'Pear Forelle', 'Pear Kaiser', 'Pear Monster', 'Pear Red', 'Pear Stone', 'Pear Williams', 'Pepino', 'Pepper Green', 'Pepper Orange', 'Pepper Red', 'Pepper Yellow', 'Physalis', 'Physalis with Husk', 'Pineapple', 'Pineapple Mini', 'Pitahaya Red', 'Plum', 'Plum 2', 'Plum 3', 'Pomegranate', 'Pomelo Sweetie', 'Potato Red', 'Potato Red Washed', 'Potato Sweet', 'Potato White', 'Quince', 'Rambutan', 'Raspberry', 'Redcurrant', 'Salak', 'Strawberry', 'Strawberry Wedge', 'Tamarillo', 'Tangelo', 'Tomato 1', 'Tomato 2', 'Tomato 3', 'Tomato 4', 'Tomato Cherry Red', 'Tomato Heart', 'Tomato Maroon', 'Tomato Yellow', 'Tomato not Ripened', 'Walnut', 'Watermelon']
    threeFruits = ["applesModel.h5","bananasModel.h5","orangesModel.h5"]

    # normal predict
    fruitPredictClasses = models["model.h5"].predict(img, batch_size=10)
    max_prob = np.argmax(fruitPredictClasses)
    predictedFruitOfAll = allFruits[max_prob]


    # abo predict
    threeFruitClasses = models["aboModel.h5"].predict(img, batch_size=10)
    max_prob = np.argmax(threeFruitClasses)
    predictedFruitOfThree = threeFruits[max_prob]

    # fresh predict
    freshModel = models[predictedFruitOfThree]
    freshPredictClasses = freshModel.predict(img, batch_size=10)
    predictedFreshness = 'rotten' if freshPredictClasses[0][0] > 0.5 else 'fresh'
  
    finalPrediction = f'all: {predictedFruitOfAll}, three: {predictedFruitOfThree}, fresh: {predictedFreshness}'
    return finalPrediction


@app.route('/mask')
def mask():
    config = SimpleConfig()
    #config.display()
    model = modellib.MaskRCNN(mode="inference", config=config, model_dir=os.getcwd())
    model.load_weights("mask_rcnn_coco.h5", by_name=True)

    imagePath = request.args.get("imgPath")
    
    with urllib.request.urlopen(imagePath) as url:
        s = url.read()
        image = np.asarray(bytearray(s), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = imutils.resize(image, width=512)
    # perform a forward pass of the network to obtain the results
    print("[INFO] making predictions with Mask R-CNN...")
    result = model.detect([image], verbose=1)

    r1 = result[0]
    images = []
    predictions = []
    for i in range(r1['rois'].shape[0]):
        class_id = r1['class_ids'][i]
        #if(class_id == bananaI or class_id == orangeI or class_id == appleI):
        y1, x1, y2, x2 = r1['rois'][i]
        mask = r1['masks'][:, :, i]

        blackMask = np.dstack([image[:,:,0]*mask,image[:,:,1]*mask,image[:,:,2]*mask]) 
        invMask = np.logical_not(mask)
        whiteBg = 255*np.dstack((invMask,invMask,invMask))
        masked_image = (blackMask+whiteBg)[y1:y2,x1:x2,::-1]
        #cv2.imwrite(f'{i}.jpg',masked_image.astype(np.uint8))
        masked_image = masked_image.astype(np.uint8)
        #filename = f'{imagePath}-masked'
        #print(filename)
        #mongo.save_file(filename, masked_image)
        #images.append(masked_image.astype(np.uint8))
        images.append(masked_image)
        prediction = predict(masked_image)
        print("prediction number ", i, ": ", prediction)
        predictions.append(prediction)


    if(len(predictions) == 0):
        prediction = predict(image)
        print("couldn't find anything, the prediction is ", prediction)
        predictions.append(prediction)
    
    print("made it past the for loop", predictions)
    return {"predictions": predictions[0]} #{"newImages":images}

    #visualize.display_instances(image, r1['rois'], r1['masks'],   r1['class_ids'], CLASS_NAMES, r1['scores'])
