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
from skimage.measure import find_contours
from tensorflow.keras.models import load_model
from mrcnn.config import Config
from mrcnn import model as modellib
from mrcnn import visualize

from flask import Flask, request, url_for, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config["MONGO_URI"] = "mongodb+srv://cabbageDb:peachDb@cluster0.b6n76.mongodb.net/images?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE"
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)
mongo = PyMongo(app)

# if __name__ == "__main__":
#     #app.run(debug=True,port=5000)
#     app.run(debug=True,port=process.env.PORT)

@app.route('/upload', methods=['POST'])
@cross_origin()
def fileUpload():
    if 'file' in request.files:
        imgFile = request.files['file'] 
        filename = request.form['filename']
        mongo.save_file(filename,imgFile)
        mongo.db.users.insert({"fileURL":filename})
    url = url_for('file',filename=filename)
    # url = url_for('file', filename="7b0bccab-e341-4e40-ad99-f7b18e1d0f8f-37_100.jpg")
    response = {"url":url}
    return response
    
@app.route('/file/<filename>')
def file(filename):
    return mongo.send_file(filename)

# MASK-RCNN STUFF
models = {}
os.chdir("cabbage/api/")
# for mod in {"mobile36.h5","aboModel.h5", "model.h5"}: #, "applesModel.h5", "bananasModel.h5", "orangesModel.h5"}:
#     models[mod] = load_model(mod)

fruits = ["apple","banana","orange"]

# List of all fruits
fruits36 = ['apple', 'banana', 'beetroot', 'bell pepper', 'cabbage', 'capsicum', 'carrot', 'cauliflower', 'chilli pepper', 'corn', 'cucumber', 'eggplant', 'garlic', 'ginger', 'grapes', 'jalepeno', 'kiwi', 'lemon', 'lettuce', 'mango', 'onion', 'orange', 'paprika', 'pear', 'peas', 'pineapple', 'pomegranate', 'potato', 'raddish', 'soy beans', 'spinach', 'sweetcorn', 'sweetpotato', 'tomato', 'turnip', 'watermelon']

allFruits = ['Apple Braeburn', 'Apple Crimson Snow', 'Apple Golden 1', 'Apple Golden 2', 'Apple Golden 3', 'Apple Granny Smith', 'Apple Pink Lady', 'Apple Red 1', 'Apple Red 2', 'Apple Red 3', 'Apple Red Delicious', 'Apple Red Yellow 1', 'Apple Red Yellow 2', 'Apricot', 'Avocado', 'Avocado ripe', 'Banana', 'Banana Lady Finger', 'Banana Red', 'Beetroot', 'Blueberry', 'Cactus fruit', 'Cantaloupe 1', 'Cantaloupe 2', 'Carambula', 'Cauliflower', 'Cherry 1', 'Cherry 2', 'Cherry Rainier', 'Cherry Wax Black', 'Cherry Wax Red', 'Cherry Wax Yellow', 'Chestnut', 'Clementine', 'Cocos', 'Corn', 'Corn Husk', 'Cucumber Ripe', 'Cucumber Ripe 2', 'Dates', 'Eggplant', 'Fig', 'Ginger Root', 'Granadilla', 'Grape Blue', 'Grape Pink', 'Grape White', 'Grape White 2', 'Grape White 3', 'Grape White 4', 'Grapefruit Pink', 'Grapefruit White', 'Guava', 'Hazelnut', 'Huckleberry', 'Kaki', 'Kiwi', 'Kohlrabi', 'Kumquats', 'Lemon', 'Lemon Meyer', 'Limes', 'Lychee', 'Mandarine', 'Mango', 'Mango Red', 'Mangostan', 'Maracuja', 'Melon Piel de Sapo', 'Mulberry', 'Nectarine', 'Nectarine Flat', 'Nut Forest', 'Nut Pecan', 'Onion Red', 'Onion Red Peeled', 'Onion White', 'Orange', 'Papaya', 'Passion Fruit', 'Peach', 'Peach 2', 'Peach Flat', 'Pear', 'Pear 2', 'Pear Abate', 'Pear Forelle', 'Pear Kaiser', 'Pear Monster', 'Pear Red', 'Pear Stone', 'Pear Williams', 'Pepino', 'Pepper Green', 'Pepper Orange', 'Pepper Red', 'Pepper Yellow', 'Physalis', 'Physalis with Husk', 'Pineapple', 'Pineapple Mini', 'Pitahaya Red', 'Plum', 'Plum 2', 'Plum 3', 'Pomegranate', 'Pomelo Sweetie', 'Potato Red', 'Potato Red Washed', 'Potato Sweet', 'Potato White', 'Quince', 'Rambutan', 'Raspberry', 'Redcurrant', 'Salak', 'Strawberry', 'Strawberry Wedge', 'Tamarillo', 'Tangelo', 'Tomato 1', 'Tomato 2', 'Tomato 3', 'Tomato 4', 'Tomato Cherry Red', 'Tomato Heart', 'Tomato Maroon', 'Tomato Yellow', 'Tomato not Ripened', 'Walnut', 'Watermelon']
threeFruits = ["applesModel.h5","bananasModel.h5","orangesModel.h5"]

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

class SimpleConfig(Config):
    # give the configuration a recognizable name
    NAME = "coco_inference"
    # set the number of GPUs to use along with the number of images
    # per GPU
    GPU_COUNT = 1
    IMAGES_PER_GPU = 1
    # number of classes on COCO dataset
    NUM_CLASSES = 81
config = SimpleConfig()
#config.display()
model = modellib.MaskRCNN(mode="inference", config=config, model_dir=os.getcwd())
model.load_weights("mask_rcnn_coco.h5", by_name=True)

@app.route('/predict')
@cross_origin()
def mask():
    filename = request.args.get("imgPath")
    print(filename)
    #imagePath = " + filename
    imagePath = "https://peachyproduce.herokuapp.com/" + url_for('file',filename=filename)
    
    with urllib.request.urlopen(imagePath) as url:
        s = url.read()
        image = np.asarray(bytearray(s), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = imutils.resize(image, width=512)
    # perform a forward pass of the network to obtain the results
    #print("[INFO] making predictions with Mask R-CNN...")
    result = model.detect([image], verbose=1)
    r1 = result[0]
    predictions = []
    for i in range(r1['rois'].shape[0]):
        class_id = r1['class_ids'][i]
        #if(CLASS_NAMES[class_id] == "banana" or CLASS_NAMES[class_id] == "orange" or CLASS_NAMES[class_id] == "apple"):
        y1, x1, y2, x2 = r1['rois'][i]
        
        cropped_image = image[y1:y2,x1:x2,::-1]
        cropped_image = cropped_image.astype(np.uint8)
        #masked_full_image = getMask(r1,image)[y1:y2,x1:x2,::-1]
        #cv2.imwrite(f'{i}.jpg',masked_image.astype(np.uint8))
        
        newFilename = f'{imagePath}-masked'
        # mongo.save_file(newFilename, cropped_image)
        # mongo.save_file(filename,imgFile)
        # mongo.db.users.insert({"fileURL":filename})
        # url = url_for('file',filename=filename)
        
        prediction = predict(cropped_image)
        print("prediction number ", i, ": ", prediction)
        predictions.append(prediction)

    if(len(predictions) == 0):
        prediction = predict(image)
        print("couldn't find anything, the prediction is ", prediction)
        predictions.append(prediction)

    return {"predictions": predictions}

    #visualize.display_instances(image, r1['rois'], r1['masks'],   r1['class_ids'], CLASS_NAMES, r1['scores'])

def predict(img): # takes in a np image
    img = cv2.resize(img, (100,100))
    img = np.expand_dims(img, axis=0)
    img = np.vstack([img])/255.0

    # normal predict
    fruitPredictClasses = models["mobile36.h5"].predict(img, batch_size=10)
    #print(len(fruitPredictClasses[0]),"MOBILE", fruitPredictClasses, "-00------------------------------------------")
    max_prob = np.argmax(fruitPredictClasses)
    predictedFruitOfAll = fruits36[max_prob]

    # abo predict
    threeFruitClasses = models["aboModel.h5"].predict(img, batch_size=10)
    max_prob = np.argmax(threeFruitClasses)
    predictedFruitOfThree = threeFruits[max_prob]

    # fresh predict
    freshModel = models[predictedFruitOfThree]
    freshPredictClasses = freshModel.predict(img, batch_size=10)
    predictedFreshness = 'rotten' if freshPredictClasses[0][0] > 0.5 else 'fresh'
  
    finalPredictions = {
        "predictedFruitOfAll": predictedFruitOfAll,
        "predictedFruitOfThree": predictedFruitOfThree,
        "predictedFreshness": predictedFreshness
    }
    return finalPredictions


def getMask(r1,image):
    mask = r1['masks'][:, :, i]
    blackMask = np.dstack([image[:,:,0]*mask,image[:,:,1]*mask,image[:,:,2]*mask]) 
    invMask = np.logical_not(mask)
    whiteBg = 255*np.dstack((invMask,invMask,invMask))
    masked_image = (blackMask+whiteBg)
    return masked_image.astype(np.uint8)


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def index(path):
#   '''Return index.html for all non-api routes'''
#   return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')