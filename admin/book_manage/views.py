from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
import sys
from .models import Book
from .producer import publish
from .serializers import BookSerializer


class BookView(viewsets.ViewSet):
    def list(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = BookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        publish('book_created', serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 
    
    def delete_all(self, request):
        Book.objects.all().delete()
        return Response({"Result": "Sucessfully Deleted All"}, status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, pk=None):
        book = Book.objects.get(id=pk)
        serializer = BookSerializer(book)
        return Response(serializer.data)

    def update(self, request, pk=None):
        pk = int(pk)
        book = Book.objects.get(id=pk)
        serializer = BookSerializer(instance=book, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        publish('book_updated', serializer.data)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def destroy(self, request, pk=None):
        # print(pk, file=sys.stderr)
        pk = int(pk)
        book = Book.objects.get(id=pk)
        book.delete()
        publish('book_deleted', pk)
        return Response({"Result": "Sucessfully Deleted"}, status=status.HTTP_204_NO_CONTENT)