from django.urls import path

from .views import BookView

urlpatterns = [
    path('', BookView.as_view({
        'get': 'list',
        'post': 'create',
        'delete': 'delete_all',
    })),
    path('edit/<str:pk>', BookView.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    })),
]
