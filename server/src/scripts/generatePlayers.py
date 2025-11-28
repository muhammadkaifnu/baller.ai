import json

# Extended player database with top players from all leagues
players = [
    # Existing players
    {"player_id": "haaland_erling", "name": "Erling Haaland", "team": "Manchester City", "position": "ST", "overall": 91, "league": "Premier League"},
    {"player_id": "ronaldo_cristiano", "name": "Cristiano Ronaldo", "team": "Al Nassr", "position": "ST", "overall": 87, "league": "Saudi Pro League"},
    {"player_id": "messi_lionel", "name": "Lionel Messi", "team": "Inter Miami", "position": "RW", "overall": 90, "league": "MLS"},
    {"player_id": "bellingham_jude", "name": "Jude Bellingham", "team": "Real Madrid", "position": "CM", "overall": 90, "league": "La Liga"},
    {"player_id": "mbappe_kylian", "name": "Kylian Mbappé", "team": "Real Madrid", "position": "LW", "overall": 92, "league": "La Liga"},
    {"player_id": "salah_mohamed", "name": "Mohamed Salah", "team": "Liverpool", "position": "RW", "overall": 89, "league": "Premier League"},
    {"player_id": "debruyne_kevin", "name": "Kevin De Bruyne", "team": "Manchester City", "position": "CAM", "overall": 91, "league": "Premier League"},
    {"player_id": "vinicius_junior", "name": "Vinícius Júnior", "team": "Real Madrid", "position": "LW", "overall": 89, "league": "La Liga"},
    {"player_id": "kane_harry", "name": "Harry Kane", "team": "Bayern Munich", "position": "ST", "overall": 90, "league": "Bundesliga"},
    {"player_id": "lewandowski_robert", "name": "Robert Lewandowski", "team": "Barcelona", "position": "ST", "overall": 89, "league": "La Liga"},
    
    # Premier League
    {"player_id": "saka_bukayo", "name": "Bukayo Saka", "team": "Arsenal", "position": "RW", "overall": 87, "league": "Premier League"},
    {"player_id": "odegaard_martin", "name": "Martin Ødegaard", "team": "Arsenal", "position": "CAM", "overall": 88, "league": "Premier League"},
    {"player_id": "rice_declan", "name": "Declan Rice", "team": "Arsenal", "position": "CDM", "overall": 87, "league": "Premier League"},
    {"player_id": "palmer_cole", "name": "Cole Palmer", "team": "Chelsea", "position": "CAM", "overall": 84, "league": "Premier League"},
    {"player_id": "foden_phil", "name": "Phil Foden", "team": "Manchester City", "position": "CAM", "overall": 88, "league": "Premier League"},
    {"player_id": "rodri", "name": "Rodri", "team": "Manchester City", "position": "CDM", "overall": 91, "league": "Premier League"},
    {"player_id": "vandijk_virgil", "name": "Virgil van Dijk", "team": "Liverpool", "position": "CB", "overall": 90, "league": "Premier League"},
    {"player_id": "alisson", "name": "Alisson", "team": "Liverpool", "position": "GK", "overall": 89, "league": "Premier League"},
    {"player_id": "son_heungmin", "name": "Son Heung-min", "team": "Tottenham", "position": "LW", "overall": 89, "league": "Premier League"},
    {"player_id": "bruno_fernandes", "name": "Bruno Fernandes", "team": "Manchester United", "position": "CAM", "overall": 88, "league": "Premier League"},
    
    # La Liga
    {"player_id": "pedri", "name": "Pedri", "team": "Barcelona", "position": "CM", "overall": 85, "league": "La Liga"},
    {"player_id": "gavi", "name": "Gavi", "team": "Barcelona", "position": "CM", "overall": 83, "league": "La Liga"},
    {"player_id": "raphinha", "name": "Raphinha", "team": "Barcelona", "position": "RW", "overall": 85, "league": "La Liga"},
    {"player_id": "modric_luka", "name": "Luka Modrić", "team": "Real Madrid", "position": "CM", "overall": 88, "league": "La Liga"},
    {"player_id": "valverde_fede", "name": "Federico Valverde", "team": "Real Madrid", "position": "CM", "overall": 87, "league": "La Liga"},
    {"player_id": "courtois_thibaut", "name": "Thibaut Courtois", "team": "Real Madrid", "position": "GK", "overall": 90, "league": "La Liga"},
    {"player_id": "griezmann_antoine", "name": "Antoine Griezmann", "team": "Atletico Madrid", "position": "CAM", "overall": 87, "league": "La Liga"},
    {"player_id": "oblak_jan", "name": "Jan Oblak", "team": "Atletico Madrid", "position": "GK", "overall": 89, "league": "La Liga"},
    
    # Serie A
    {"player_id": "osimhen_victor", "name": "Victor Osimhen", "team": "Napoli", "position": "ST", "overall": 88, "league": "Serie A"},
    {"player_id": "lautaro_martinez", "name": "Lautaro Martínez", "team": "Inter Milan", "position": "ST", "overall": 88, "league": "Serie A"},
    {"player_id": "barella_nicolo", "name": "Nicolò Barella", "team": "Inter Milan", "position": "CM", "overall": 86, "league": "Serie A"},
    {"player_id": "leao_rafael", "name": "Rafael Leão", "team": "AC Milan", "position": "LW", "overall": 86, "league": "Serie A"},
    {"player_id": "theo_hernandez", "name": "Theo Hernández", "team": "AC Milan", "position": "LB", "overall": 87, "league": "Serie A"},
    {"player_id": "vlahovic_dusan", "name": "Dušan Vlahović", "team": "Juventus", "position": "ST", "overall": 85, "league": "Serie A"},
    {"player_id": "chiesa_federico", "name": "Federico Chiesa", "team": "Juventus", "position": "RW", "overall": 85, "league": "Serie A"},
    {"player_id": "dybala_paulo", "name": "Paulo Dybala", "team": "AS Roma", "position": "CAM", "overall": 86, "league": "Serie A"},
    
    # Bundesliga
    {"player_id": "musiala_jamal", "name": "Jamal Musiala", "team": "Bayern Munich", "position": "CAM", "overall": 86, "league": "Bundesliga"},
    {"player_id": "sane_leroy", "name": "Leroy Sané", "team": "Bayern Munich", "position": "LW", "overall": 86, "league": "Bundesliga"},
    {"player_id": "kimmich_joshua", "name": "Joshua Kimmich", "team": "Bayern Munich", "position": "CDM", "overall": 89, "league": "Bundesliga"},
    {"player_id": "neuer_manuel", "name": "Manuel Neuer", "team": "Bayern Munich", "position": "GK", "overall": 90, "league": "Bundesliga"},
    {"player_id": "wirtz_florian", "name": "Florian Wirtz", "team": "Bayer Leverkusen", "position": "CAM", "overall": 85, "league": "Bundesliga"},
    {"player_id": "xhaka_granit", "name": "Granit Xhaka", "team": "Bayer Leverkusen", "position": "CM", "overall": 84, "league": "Bundesliga"},
    {"player_id": "adeyemi_karim", "name": "Karim Adeyemi", "team": "Borussia Dortmund", "position": "LW", "overall": 81, "league": "Bundesliga"},
    
    # Ligue 1
    {"player_id": "dembele_ousmane", "name": "Ousmane Dembélé", "team": "Paris Saint-Germain", "position": "RW", "overall": 86, "league": "Ligue 1"},
    {"player_id": "barcola_bradley", "name": "Bradley Barcola", "team": "Paris Saint-Germain", "position": "LW", "overall": 79, "league": "Ligue 1"},
    {"player_id": "donnarumma_gianluigi", "name": "Gianluigi Donnarumma", "team": "Paris Saint-Germain", "position": "GK", "overall": 89, "league": "Ligue 1"},
    {"player_id": "lacazette_alexandre", "name": "Alexandre Lacazette", "team": "Lyon", "position": "ST", "overall": 83, "league": "Ligue 1"},
]

print(f"Total players: {len(players)}")
print(json.dumps(players, indent=2))
