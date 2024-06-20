from django.db import models

from database.models import Game, Player

# Create your models here.

class Tournament(models.Model):
    name = models.CharField(max_length=100, default = "Tournament")
    games = models.ManyToManyField(Game)
    players = models.ManyToManyField(Player)

    def __str__(self):
        return self.name
    
    def add_player(self, player):
        self.players.add(player)

    def start(self):
        #after start, make pairs, cannot add more players
        game = Game.object.create()
        self.games.append()
