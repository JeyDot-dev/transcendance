from django.urls import path
from . import views

urlpatterns = [
    path('play/<int:game_id>/', views.play, name='play'),
    path('winner/<int:game_id>/', views.winner, name='winner'),
    path('newGame/', views.newGame, name='newGame'),
]
