from django import forms

class addPlayer(forms.Form):
    player_name = forms.CharField(label='Player 1 Name', max_length=100)