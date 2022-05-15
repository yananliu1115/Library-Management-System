import pika, json, os, django

url = os.environ.get('MQ_URL')  

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "admin.settings")
django.setup()

from book_manage.models import Book

params = pika.URLParameters(f'{url}')

connection = pika.BlockingConnection(params)

channel = connection.channel()

channel.queue_declare(queue='admin')


def callback(ch, method, properties, body):
    print('Received in admin')
    book_id = int(json.loads(body))
    print(book_id)
    print(properties)
    
    if properties.content_type == 'book_borrowed':
        
        book = Book.objects.get(id=book_id)
        book.amount = book.amount - 1
        book.save()
        print("Book is borrowed")
        
    elif properties.content_type == 'book_returned':
        book = Book.objects.get(id=book_id)
        book.amount = book.amount + 1
        book.save()
        print("Book is returned")



channel.basic_consume(queue='admin', on_message_callback=callback, auto_ack=True)

print('Started Consuming')

channel.start_consuming()

channel.close()
