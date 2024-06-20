from django.db import models

# Create your models here.

class Player(models.Model):
    name = models.CharField(max_length=20)
#if psw set, username is reserved. Change to int and hashed pwd check for security later
    psw = models.CharField(max_length=100)
    matchesWon = models.IntegerField(default=0)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Game(models.Model):
    player1 = models.ForeignKey(Player, related_name='games_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, related_name='games_as_player2', on_delete=models.CASCADE)

    def __str__(self):
        return self.player1.name + " VS " + self.player2.name 
    
    def winner(self):
        #ex-aequo are impossible
        return self.player1 if self.player1.points > self.player2.points else self.player2
    
    @property
    def players(self):
        return Player.objects.filter(models.Q(pk=self.player1.pk) | models.Q(pk=self.player2.pk))

class Tournament(models.Model):
    name = models.CharField(max_length=100, default = "Tournament")
    games = models.ManyToManyField(Game, blank=True)
    players = models.ManyToManyField(Player, blank=True)

    def __str__(self):
        return self.name
    
    def add_player(self, player):
        self.players.add(player)

    def start(self):
        #after start, make pairs, cannot add more players
        game = Game.object.create()
        self.games.append()