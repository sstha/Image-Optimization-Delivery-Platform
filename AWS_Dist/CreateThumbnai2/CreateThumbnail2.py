import json
import logging
import base64
import boto3
import os
import numpy
from PIL import Image
from base64 import decodestring
import io

s3_client = boto3.client('s3')

logger = logging.getLogger()
logger.setLevel(logging.INFO)
import json

def lambda_handler(event, context):
    
    file_name = event['file-name']

    if 'aspect_r' in event:

        aspect_r = event['aspect_r']

    image_key = file_name
    key = file_name

    if 'grey_scale' in event:

        grey_scale = event['grey_scale']

    
    from PIL import Image
    from io import BytesIO
    import numpy as np
    
    import os

    import boto3

    s3 = boto3.resource('s3')

    def image_from_s3(bucket, key):
    
        bucket = s3.Bucket(bucket)
        image = bucket.Object(key)
        img_data = image.get().get('Body').read()
    
        return Image.open(io.BytesIO(img_data))
    

    def grey_image_from_s3(bucket, key):
    
        bucket = s3.Bucket(bucket)
        image = bucket.Object(key)
        img_data = image.get().get('Body').read()
    
        return Image.open(io.BytesIO(img_data)).convert('L')
        

    if 'aspect_r' in event:
        img_in_f2 = image_from_s3('og-image', image_key)
 
        img_in_f2.thumbnail((int(aspect_r), int(aspect_r)))

    if 'grey_scale' in event:
        img_in_f2 = grey_image_from_s3('og-image', image_key)

    output = io.BytesIO()
    img_in_f2.save(output, format='JPEG')
    hex_data = output.getvalue()

    file_name = '____' + file_name

    s3_response = s3_client.put_object(Bucket='opt-image', Key=file_name, Body=hex_data) 





    
    
    res_2 = {
        'statusCode': 200,
        'headers': {
        'Access-Control-Allow-Credentials': 'true',
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*",
        "Allow" : "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers" : "*"
    },
        'body': str(file_name)
    }
    
    
    
    # TODO implement
    return res_2
