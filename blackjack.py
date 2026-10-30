import random

card_value = ["K", "Q", "J", 10, 9, 8, 7, 6, 5, 4, 3, 2, "A"]
card_suit = ["H", "D", "C", "S"]
card_deck = []
for suit in card_suit:
    for value in card_value:
        card_deck.append(f"{value}{suit}")

def deal():
    player_card = [random.choice(card_deck), random.choice(card_deck)]
    print(player_card)
    actions = input("Pick action (Stand/Hit)")
    if actions == "Hit":
        player_card.append(random.choice(card_deck))
         print(player_card)
        return 
    elif actions == "Stand":
        return player_card
       
deal()
  print(player_card)   