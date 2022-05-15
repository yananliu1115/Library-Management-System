from django.shortcuts import render


from django.contrib.auth import get_user_model, logout
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

import sys
from . import serializers
from .utils import get_and_authenticate_user, create_user_account


User = get_user_model()

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'login': serializers.UserLoginSerializer,
        'register': serializers.UserRegisterSerializer
    }

    @action(methods=['GET', ], detail=False)
    def allusers(self, request):
        users = get_user_model().objects.all()
        print(users, file=sys.stdout)
        serializer = serializers.UserRegisterSerializer(users, many=True)
        return Response(serializer.data)

    @action(methods=['POST', ], detail=False)
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_and_authenticate_user(**serializer.validated_data)
        data = serializers.AuthUserSerializer(user).data
        print(data, file=sys.stderr)
        return Response(data={ 
            "user": data,
            "token": Token.objects.get(user=user).key
        }, status=status.HTTP_200_OK)
    
    @action(methods=['POST', ], detail=False)
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = create_user_account(**serializer.validated_data, is_staff= request.data["is_staff"], is_superuser=request.data["is_superuser"])
        data = serializers.AuthUserSerializer(user).data
        return Response(data={ 
            "user": data,
            "token": Token.objects.get(user=user).key
        }, status=status.HTTP_201_CREATED)
    
    @action(methods=['DELETE', ], detail=False)
    def deleteusers(self, request):
        User.objects.all().delete()
        return Response({"Result": "Sucessfully Deleted All"}, status=status.HTTP_204_NO_CONTENT)
    
    
    
    @action(methods=['POST', ], detail=False)
    def logout(self, request):
        logout(request)
        data = {'success': 'Sucessfully logged out'}
        return Response(data=data, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured("serializer_classes should be a dict mapping.")

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        return super().get_serializer_class()