import json
import logging
import base64
import boto3
import os
import numpy
from PIL import Image
from base64 import decodestring



logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3_client = boto3.client('s3')

lambda_client = boto3.client('lambda')

response  = {
    'statusCode': 200,
    'headers': {
        'Access-Control-Allow-Credentials': 'true',
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*",
        "Allow" : "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers" : "*"
    },
    'body': ''
}

def handler(event, context):

    file_name = event['headers']['file-name']


    from PIL import Image
    from base64 import decodestring
    import io, base64



    file_content = base64.b64decode(event['body'])


    gg_img = Image.open(io.BytesIO(base64.decodebytes(bytes(event['body'], "utf-8"))))


    #header_param = event['headers']['compress']

    if 'aspect_r' in event['queryStringParameters']:

        aspect_r = event['queryStringParameters']['aspect_r']
        print('aspec ratio...:')
        print(aspect_r)

    
    if 'compress' in event['queryStringParameters']:

        compress = event['queryStringParameters']['compress']
        print('compress paraaa:')
        print(compress)


    if 'grey_scale' in event['queryStringParameters']:

        grey_scale = event['queryStringParameters']['grey_scale']
        print('grey_scale paraaa:')
        print(grey_scale)



    
    BUCKET_NAME = os.environ['BUCKET_NAME']


    output = io.BytesIO()
    gg_img.save(output, format='JPEG')
    hex_data = output.getvalue()

    #res_pic = base64.b64decode(hex_data)
    

    s3_response = s3_client.put_object(Bucket=BUCKET_NAME, Key=file_name, Body=hex_data)   
    logger.info('S3 Response: {}'.format(s3_response)) 

    file_name_input = {}
    file_name_input['file-name'] = file_name

    if 'aspect_r' in event['queryStringParameters']:

        file_name_input['aspect_r'] = aspect_r

    
    if 'grey_scale' in event['queryStringParameters']:

        file_name_input['grey_scale'] = grey_scale


    response_f2 = lambda_client.invoke(
        FunctionName = 'arn:aws:lambda:us-west-2:979276126363:function:aspect_ratio',
        InvocationType = 'RequestResponse',
        Payload = json.dumps(file_name_input)
    )

    responseJson_f2 = json.load(response_f2['Payload'])
    print('Function number 1:')
    print('\n')
    print(responseJson_f2)
    print('\n')


    response['body'] = 'Your file has been uploaded: ' 

    return response

    #except Exception as e:
    #    raise IOError(e)