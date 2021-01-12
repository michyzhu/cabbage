from keras.models import load_model
from mrcnn.config import Config
from mrcnn import model as modellib
from mrcnn import visualize
import cv2
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
app = Flask(__name__)

models = {}
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


@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/predict')
def prediction():
    modelName = request.args.get("modelName")
    model = load_model("aboModel.h5")

    imgPath = "freshOrange.png"
    img=cv2.imread(imgPath)
    img=cv2.resize(img, (100,100))
    img=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = np.expand_dims(img, axis=0)

    img = np.vstack([img])/255.0

    # normal predict
    fruitPredictClasses = model.predict(img, batch_size=10)
    max_prob = np.argmax(fruitPredictClasses)
    predictedFruit = fruits[max_prob]

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

@app.route('/mrcnn')
def mask():
    config = SimpleConfig()
    #config.display()
    model = modellib.MaskRCNN(mode="inference", config=config, model_dir=os.getcwd())
    model.load_weights("mask_rcnn_coco.h5", by_name=True)


    imagePath = request.args.get("imgPath")
    #image = cv2.imread("cabb.jpg")
    image = cv2.imread(imagePath)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = imutils.resize(image, width=512)
    # perform a forward pass of the network to obtain the results
    print("[INFO] making predictions with Mask R-CNN...")
    result = model.detect([image], verbose=1)

    r1 = result[0]
    bananaI, appleI, orangeI = CLASS_NAMES.index('banana'),CLASS_NAMES.index('apple'),CLASS_NAMES.index('orange')

    imgUrls = []
    for i in range(r1['rois'].shape[0]):
        class_id = r1['class_ids'][i]
        if(class_id == bananaI or class_id == orangeI or class_id == appleI):
            y1, x1, y2, x2 = r1['rois'][i]
            mask = r1['masks'][:, :, i]

            '''padded_mask = np.zeros(
                (mask.shape[0] + 2, mask.shape[1] + 2), dtype=np.uint8)
            padded_mask[1:-1, 1:-1] = mask
            contours = find_contours(padded_mask, 0.5)
            for verts in contours:
                # Subtract the padding and flip (y, x) to (x, y)
                verts = np.fliplr(verts) - 1
                p = skimage.draw.polygon2mask(masked_image.shape, verts)
                maskImg(masked_image,mask,(255,255,0))
            '''
            blackMask = np.dstack([image[:,:,0]*mask,image[:,:,1]*mask,image[:,:,2]*mask]) 
            invMask = np.logical_not(mask)
            whiteBg = 255*np.dstack((invMask,invMask,invMask))
            masked_image = (blackMask+whiteBg)[y1:y2,x1:x2,::-1]
            cv2.imwrite(f'{i}.jpg',masked_image.astype(np.uint8))
            imgUrls.append(f'{i}.jpg',masked_image.astype(np.uint8))

    return {"newImageUrls":imgUrls}

    #visualize.display_instances(image, r1['rois'], r1['masks'],   r1['class_ids'], CLASS_NAMES, r1['scores'])
