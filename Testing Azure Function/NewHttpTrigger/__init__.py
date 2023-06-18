import logging

import azure.functions as func

import numpy as np

import pandas

import pybase64

import base64

import io

from azure.storage.blob import BlobServiceClient, BlobClient



def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    from PIL import Image
    from io import BytesIO
    import numpy as np

    name = req.params.get('name')

    logging.info('HTTP Request')

    logging.info(type(req))
    logging.info(req)

    body = req.get_body()

    logging.info('HTTP Body')

    logging.info(type(body))
    logging.info(body)

    logging.info('HTTP Header')

    headers=req.headers['file']

    logging.info(type(headers))
    logging.info(headers)

    file_content = pybase64.b64decode(body)

    logging.info('HTTP File content')

    logging.info(type(file_content))

    logging.info(file_content)


    gg_img = Image.open(io.BytesIO(body))

    gg_img.thumbnail((256, 256))


    output = io.BytesIO()
    gg_img.save(output, format='JPEG')
    hex_data = output.getvalue()

 

    logging.info('HTTP with Image')

    logging.info(type(gg_img))

    logging.info(gg_img)

    #file_name = req.file.get('file')

    #logging.info(file_name.file)


    connect_str = 'DefaultEndpointsProtocol=https;AccountName=latest39pythonstor9ccac5;AccountKey=Z+mmw/7HfdGmOJztRfPhndRDeTXv1CDOrK9ZaQTvsRmjcDRxoZkgP/1y98nR5X1H/rpq2JNLjzdi+AStKzH4gA==;EndpointSuffix=core.windows.net'
    container = 'my-image-container'

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    blob_client = blob_service_client.get_blob_client(container=container,blob=headers)
    blob_client.upload_blob(body)


    connect_str = 'DefaultEndpointsProtocol=https;AccountName=latest39pythonstor9ccac5;AccountKey=Z+mmw/7HfdGmOJztRfPhndRDeTXv1CDOrK9ZaQTvsRmjcDRxoZkgP/1y98nR5X1H/rpq2JNLjzdi+AStKzH4gA==;EndpointSuffix=core.windows.net'
    container = 'opt-image-container'

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    blob_client = blob_service_client.get_blob_client(container=container,blob= '___' + headers)
    blob_client.upload_blob(hex_data)



    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
             
        )
