from django.shortcuts import render
from django.db.models import F
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.template import loader



from .models import Game, Player, Tournament
from .forms import newGameForm
# Create your views here.

def play(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    #template = loader.get_template("database\play.html")
    if request.method == 'POST':
        player_id = request.POST.get('player')
        player = game.players.get(pk=player_id)  # Use the custom players property
        player.points = F("points") + 1
        player.save()
        player.refresh_from_db()
        if player.points >= 5:
            return redirect('winner', game_id=game.id)
        return redirect('play', game_id=game.id)
    return render(request, 'database\play.html', {'game': game})

def winner(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    response = render(request, 'database\winner.html', {'game': game})
    game.winner.matchesWon = F("matchesWon") + 1
    game.player1.points = 0
    game.player2.points = 0
    game.player1.save()
    game.player2.save()

    return response


def newGame(request):
    form = newGameForm(request.POST)
    if form.is_valid():
        player1_name = form.cleaned_data['player1_name']
        player2_name = form.cleaned_data['player2_name']
        player1, new1= Player.objects.get_or_create(name=player1_name)
        player2, new1 = Player.objects.get_or_create(name=player2_name)
        game = Game.objects.create(player1=player1, player2=player2)
        return redirect("play", game_id = game.id)
    return render(request, 'database/newGame.html', {'form': form})

def newTournament(request, t_id=-1):
    form = newTournament(request.POST)
    if form.isvalid():
        if t_id == -1:
            tournament = Tournament()
        else:
            tournament = get_object_or_404(Tournament, pk=t_id)
        player_name = form.cleaned_data['player_name']
        player, new= Player.objects.get_or_create(name=player_name)
        tournament.add_player(player)
    return render(request, 'database/newTournament.html', {'form': form})

