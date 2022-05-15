# import pika, json
# import os

# url = os.environ.get('MQ_URL')  
# params = pika.URLParameters(f'{url}')

# connection = pika.BlockingConnection(params)

# channel = connection.channel()


# def publish(method, body):
#     properties = pika.BasicProperties(method)
#     channel.basic_publish(exchange='', routing_key='main', body=json.dumps(body), properties=properties)
from confluent_kafka import Producer


p = Producer({'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092':'https://pkc-6ojv2.us-west4.gcp.confluent.cloud:443' })

def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result.
        Triggered by poll() or flush(). """
    if err is not None:
        print('Message delivery failed: {}'.format(err))
    else:
        print('Message delivered to {} [{}]'.format(msg.topic(), msg.partition()))

for data in some_data_source:
    # Trigger any available delivery report callbacks from previous produce() calls
    p.poll(0)

    # Asynchronously produce a message, the delivery report callback
    # will be triggered from poll() above, or flush() below, when the message has
    # been successfully delivered or failed permanently.
    p.produce('mytopic', data.encode('utf-8'), callback=delivery_report)

# Wait for any outstanding messages to be delivered and delivery report
# callbacks to be triggered.
p.flush()