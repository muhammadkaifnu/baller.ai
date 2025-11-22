import requests
import json

# Burnley vs Chelsea match ID
match_id = "740707" 
league_id = "eng.1"

url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{league_id}/summary?event={match_id}"

print(f"Fetching data from: {url}")
response = requests.get(url)
data = response.json()

boxscore = data.get('boxscore', {})
teams = boxscore.get('teams', [])

if not teams:
    print("No teams found in boxscore")
else:
    for i, team in enumerate(teams):
        team_name = team.get('team', {}).get('displayName', f'Team {i}')
        print(f"\n--- Stats for {team_name} ---")
        stats = team.get('statistics', [])
        for stat in stats:
            print(f"Name: {stat.get('name')}, Label: {stat.get('label')}, Value: {stat.get('displayValue')}")
