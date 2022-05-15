import pika, json, os

url = os.environ.get('MQ_URL')  

params = pika.URLParameters(f'{url}')

connection = pika.BlockingConnection(params)

channel = connection.channel()


def publish(method, body):
    properties = pika.BasicProperties(method)
    channel.basic_publish(exchange='', routing_key='admin', body=json.dumps(body), properties=properties)
