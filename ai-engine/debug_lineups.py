import requests
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_match_lineups(match_id, league_id):
    print(f"Fetching lineups for match {match_id} in league {league_id}...")
    try:
        url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{league_id}/summary?event={match_id}"
        print(f"URL: {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            return {}
        
        data = response.json()
        
        # Check Boxscore
        boxscore = data.get('boxscore', {})
        players = boxscore.get('players', [])
        print(f"Boxscore players found: {len(players)}")
        
        lineups = {'home': [], 'away': []}
        
        if players:
            for team_idx, team_key in enumerate(['home', 'away']):
                if team_idx >= len(players): continue
                team_data = players[team_idx]
                statistics = team_data.get('statistics', [])
                for stat_group in statistics:
                    if 'starter' in stat_group.get('name', '').lower():
                        athletes = stat_group.get('athletes', [])
                        print(f"Found {len(athletes)} starters for {team_key} in boxscore")
                        for athlete in athletes:
                            player_info = athlete.get('athlete', {})
                            player = {
                                'name': player_info.get('displayName', 'Unknown'),
                                'number': player_info.get('jersey', ''),
                                'position': player_info.get('position', {}).get('abbreviation', 'N/A'),
                                'photo': player_info.get('headshot', {}).get('href', '')
                            }
                            lineups[team_key].append(player)

        # Check Rosters if empty
        if not lineups['home'] and not lineups['away']:
            print("Checking rosters...")
            rosters = data.get('rosters', [])
            print(f"Rosters found: {len(rosters)}")
            
            for roster_data in rosters:
                team_key = 'home' if roster_data.get('homeAway') == 'home' else 'away'
                athletes = roster_data.get('roster', [])
                print(f"Found {len(athletes)} players in {team_key} roster")
                
                count = 0
                for athlete_entry in athletes:
                    if athlete_entry.get('starter', False):
                        count += 1
                        player_info = athlete_entry.get('athlete', {})
                        player = {
                            'name': player_info.get('displayName', 'Unknown'),
                            'number': player_info.get('jersey', ''),
                            'position': player_info.get('position', {}).get('abbreviation', 'N/A'),
                            'photo': player_info.get('headshot', {}).get('href', '')
                        }
                        lineups[team_key].append(player)
                print(f"Found {count} starters for {team_key} in roster")

        return lineups

    except Exception as e:
        print(f"Error: {e}")
        return {}

# Test with Burnley vs Chelsea (Premier League)
# League ID for PL is eng.1
# Match ID from previous context: 740707
lineups = fetch_match_lineups('740707', 'eng.1')
print("\nFinal Lineups Result:")
print(json.dumps(lineups, indent=2))
