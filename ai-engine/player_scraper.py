import requests
from datetime import datetime
import logging
from bs4 import BeautifulSoup
import time
import unicodedata

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ESPN API for player data
ESPN_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer"

def search_players(query):
    """
    Search for players by name across multiple leagues.
    
    Args:
        query: Player name to search for
    
    Returns:
        list: List of matching players with basic info
    """
    try:
        logger.info(f"🔍 Searching for player: {query}")
        
        # For now, return mock data - in production, this would search ESPN/FBref
        # You can integrate with APIs like:
        # - ESPN Player Search API
        # - FBref player search
        # - Transfermarkt API
        
        mock_results = [
            {
                "id": "haaland_erling",
                "name": "Erling Haaland",
                "team": "Manchester City",
                "league": "Premier League",
                "position": "Forward",
                "nationality": "Norway",
                "age": 23,
                "image": "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png"
            },
            {
                "id": "bellingham_jude",
                "name": "Jude Bellingham",
                "team": "Real Madrid",
                "league": "La Liga",
                "position": "Midfielder",
                "nationality": "England",
                "age": 20,
                "image": "https://b.fssta.com/uploads/application/soccer/headshots/71310.vresize.350.350.medium.14.png"
            },
            {
                "id": "mbappe_kylian",
                "name": "Kylian Mbappé",
                "team": "Real Madrid",
                "league": "La Liga",
                "position": "Forward",
                "nationality": "France",
                "age": 25,
                "image": "https://b.fssta.com/uploads/application/soccer/headshots/52084.vresize.350.350.medium.14.png"
            },
            {
                "id": "debruyne_kevin",
                "name": "Kevin De Bruyne",
                "team": "Manchester City",
                "league": "Premier League",
                "position": "Midfielder",
                "nationality": "Belgium",
                "age": 32,
                "image": "https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png"
            },
            {
                "id": "vinicius_jr",
                "name": "Vinícius Júnior",
                "team": "Real Madrid",
                "league": "La Liga",
                "position": "Forward",
                "nationality": "Brazil",
                "age": 23,
                "image": "https://b.fssta.com/uploads/application/soccer/headshots/40668.vresize.350.350.medium.14.png"
            },
            {
                "id": "kane_harry",
                "name": "Harry Kane",
                "team": "Bayern Munich",
                "league": "Bundesliga",
                "position": "Forward",
                "nationality": "England",
                "age": 30,
                "image": "https://b.fssta.com/uploads/application/soccer/headshots/3960.vresize.350.350.medium.14.png"
            },
            {
                "id": "salah_mohamed",
                "name": "Mohamed Salah",
                "team": "Liverpool",
                "league": "Premier League",
                "position": "Forward",
                "nationality": "Egypt",
                "age": 31,
                "image": "https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png"
            },
            {
                "id": "messi_lionel",
                "name": "Lionel Messi",
                "team": "Inter Miami",
                "league": "MLS",
                "position": "Forward",
                "nationality": "Argentina",
                "age": 36,
                "image": "https://b.fssta.com/uploads/application/soccer/headshots/690.vresize.350.350.medium.14.png"
            },
            {
                "id": "ronaldo_cristiano",
                "name": "Cristiano Ronaldo",
                "team": "Al Nassr",
                "league": "Saudi Pro League",
                "position": "Forward",
                "nationality": "Portugal",
                "age": 39,
                "image": "https://b.fssta.com/uploads/application/soccer/headshots/885.vresize.350.350.medium.14.png"
            },
            {
                "id": "rodri",
                "name": "Rodri",
                "team": "Manchester City",
                "league": "Premier League",
                "position": "Midfielder",
                "nationality": "Spain",
                "age": 27,
                "image": "https://resources.premierleague.com/premierleague/photos/players/250x250/p220566.png"
            },
            {
                "id": "saka_bukayo",
                "name": "Bukayo Saka",
                "team": "Arsenal",
                "league": "Premier League",
                "position": "Forward",
                "nationality": "England",
                "age": 22,
                "image": "https://resources.premierleague.com/premierleague/photos/players/250x250/p223340.png"
            },
            {
                "id": "wirtz_florian",
                "name": "Florian Wirtz",
                "team": "Bayer Leverkusen",
                "league": "Bundesliga",
                "position": "Midfielder",
                "nationality": "Germany",
                "age": 21,
                "image": "https://b.fssta.com/uploads/application/soccer/headshots/52678.vresize.350.350.medium.14.png"
            }
        ]
        
        # Filter based on query
        def normalize(text):
            return unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8').lower()
            
        query_norm = normalize(query)
        results = [p for p in mock_results if query_norm in normalize(p['name'])]
        
        logger.info(f"✓ Found {len(results)} players matching '{query}'")
        return results
        
    except Exception as e:
        logger.error(f"❌ Error searching players: {e}")
        return []


def get_player_details(player_id):
    """
    Get comprehensive player details including stats, attributes, history, etc.
    
    Args:
        player_id: Unique player identifier
    
    Returns:
        dict: Complete player profile data
    """
    try:
        logger.info(f"📊 Fetching details for player: {player_id}")
        
        # Mock comprehensive player data
        # In production, aggregate from multiple sources:
        # - ESPN for stats
        # - FBref for advanced metrics
        # - Transfermarkt for market value and transfers
        # - FIFA database for ratings
        
        player_data = {
            "id": player_id,
            "basic_info": {
                "name": "Erling Haaland",
                "full_name": "Erling Braut Haaland",
                "date_of_birth": "2000-07-21",
                "age": 23,
                "nationality": "Norway",
                "height": "194 cm",
                "weight": "88 kg",
                "preferred_foot": "Left",
                "image": "https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png"
            },
            "current_club": {
                "name": "Manchester City",
                "league": "Premier League",
                "position": "Center Forward",
                "jersey_number": 9,
                "joined_date": "2022-07-01",
                "contract_until": "2027-06-30",
                "market_value": "€180M",
                "salary": "€20M/year"
            },
            "fifa_ratings": {
                "overall": 91,
                "potential": 94,
                "pace": 89,
                "shooting": 94,
                "passing": 65,
                "dribbling": 80,
                "defending": 45,
                "physical": 88
            },
            "season_stats": {
                "season": "2023/24",
                "appearances": 15,
                "goals": 18,
                "assists": 3,
                "minutes_played": 1245,
                "yellow_cards": 2,
                "red_cards": 0,
                "goals_per_90": 1.30,
                "assists_per_90": 0.22
            },
            "advanced_stats": {
                "shot_accuracy": "68%",
                "pass_completion": "78%",
                "dribbles_completed": "2.1 per game",
                "aerial_duels_won": "65%",
                "tackles_per_game": 0.3,
                "interceptions_per_game": 0.2,
                "xG": 16.5,
                "xA": 2.8
            },
            "career_stats": {
                "total_appearances": 287,
                "total_goals": 234,
                "total_assists": 45,
                "clubs_played": 5
            },
            "club_history": [
                {
                    "club": "Manchester City",
                    "league": "Premier League",
                    "period": "2022 - Present",
                    "appearances": 68,
                    "goals": 72,
                    "assists": 12
                },
                {
                    "club": "Borussia Dortmund",
                    "league": "Bundesliga",
                    "period": "2020 - 2022",
                    "appearances": 89,
                    "goals": 86,
                    "assists": 23
                },
                {
                    "club": "RB Salzburg",
                    "league": "Austrian Bundesliga",
                    "period": "2019 - 2020",
                    "appearances": 27,
                    "goals": 29,
                    "assists": 7
                },
                {
                    "club": "Molde FK",
                    "league": "Eliteserien",
                    "period": "2017 - 2019",
                    "appearances": 50,
                    "goals": 20,
                    "assists": 3
                }
            ],
            "transfer_history": [
                {
                    "date": "2022-07-01",
                    "from": "Borussia Dortmund",
                    "to": "Manchester City",
                    "fee": "€60M",
                    "type": "Transfer"
                },
                {
                    "date": "2020-01-01",
                    "from": "RB Salzburg",
                    "to": "Borussia Dortmund",
                    "fee": "€20M",
                    "type": "Transfer"
                },
                {
                    "date": "2019-01-01",
                    "from": "Molde FK",
                    "to": "RB Salzburg",
                    "fee": "€7M",
                    "type": "Transfer"
                }
            ],
            "trophies": [
                {
                    "title": "Premier League",
                    "season": "2022/23",
                    "club": "Manchester City"
                },
                {
                    "title": "FA Cup",
                    "season": "2022/23",
                    "club": "Manchester City"
                },
                {
                    "title": "UEFA Champions League",
                    "season": "2022/23",
                    "club": "Manchester City"
                },
                {
                    "title": "Austrian Bundesliga",
                    "season": "2019/20",
                    "club": "RB Salzburg"
                },
                {
                    "title": "Austrian Cup",
                    "season": "2019/20",
                    "club": "RB Salzburg"
                }
            ],
            "individual_awards": [
                {
                    "award": "Premier League Golden Boot",
                    "season": "2022/23",
                    "description": "36 goals"
                },
                {
                    "award": "PFA Players' Player of the Year",
                    "season": "2022/23"
                },
                {
                    "award": "UEFA Champions League Top Scorer",
                    "season": "2022/23",
                    "description": "12 goals"
                }
            ],
            "recent_matches": [
                {
                    "date": "2023-11-25",
                    "opponent": "Liverpool",
                    "result": "W 2-1",
                    "goals": 1,
                    "assists": 0,
                    "rating": 8.5,
                    "minutes": 90
                },
                {
                    "date": "2023-11-21",
                    "opponent": "Tottenham",
                    "result": "W 3-0",
                    "goals": 2,
                    "assists": 1,
                    "rating": 9.2,
                    "minutes": 85
                },
                {
                    "date": "2023-11-18",
                    "opponent": "Chelsea",
                    "result": "D 1-1",
                    "goals": 0,
                    "assists": 0,
                    "rating": 6.8,
                    "minutes": 90
                }
            ],
            "strengths": [
                "Exceptional finishing ability",
                "Outstanding pace and acceleration",
                "Excellent positioning in the box",
                "Strong aerial presence",
                "Clinical with both feet"
            ],
            "weaknesses": [
                "Limited playmaking ability",
                "Defensive contribution",
                "Can be isolated in possession-based systems"
            ],
            "playing_style": "Clinical goal scorer with exceptional pace and positioning. Thrives on through balls and crosses into the box.",
            "comparable_players": [
                "Kylian Mbappé",
                "Harry Kane",
                "Robert Lewandowski"
            ]
        }
        
        logger.info(f"✓ Successfully fetched player details for {player_id}")
        return player_data
        
    except Exception as e:
        logger.error(f"❌ Error fetching player details: {e}")
        return None


def get_player_statistics(player_id, season="2023/24"):
    """
    Get detailed statistics for a specific season.
    
    Args:
        player_id: Player identifier
        season: Season string (e.g., "2023/24")
    
    Returns:
        dict: Detailed season statistics
    """
    try:
        logger.info(f"📈 Fetching statistics for {player_id} - Season {season}")
        
        # Mock detailed stats
        stats = {
            "season": season,
            "competition_stats": [
                {
                    "competition": "Premier League",
                    "appearances": 12,
                    "goals": 15,
                    "assists": 2,
                    "minutes": 1020,
                    "yellow_cards": 1,
                    "red_cards": 0
                },
                {
                    "competition": "UEFA Champions League",
                    "appearances": 3,
                    "goals": 3,
                    "assists": 1,
                    "minutes": 225,
                    "yellow_cards": 1,
                    "red_cards": 0
                }
            ],
            "per_90_stats": {
                "goals": 1.30,
                "assists": 0.22,
                "shots": 4.2,
                "shots_on_target": 2.8,
                "key_passes": 0.9,
                "dribbles": 1.5,
                "touches": 35.2
            },
            "shooting": {
                "total_shots": 68,
                "shots_on_target": 46,
                "shot_accuracy": "68%",
                "conversion_rate": "26%",
                "goals_per_shot": 0.26,
                "xG": 16.5,
                "goals_minus_xG": 1.5
            },
            "passing": {
                "passes_attempted": 420,
                "passes_completed": 328,
                "pass_accuracy": "78%",
                "key_passes": 15,
                "through_balls": 3,
                "crosses": 8,
                "long_balls": 12
            },
            "defending": {
                "tackles": 5,
                "interceptions": 3,
                "clearances": 2,
                "blocks": 1,
                "duels_won": "45%"
            }
        }
        
        return stats
        
    except Exception as e:
        logger.error(f"❌ Error fetching player statistics: {e}")
        return None


if __name__ == "__main__":
    # Test the scraper
    print("Testing player search...")
    results = search_players("Haaland")
    print(f"Found {len(results)} players")
    
    if results:
        print("\nTesting player details...")
        details = get_player_details(results[0]['id'])
        if details:
            print(f"Player: {details['basic_info']['name']}")
            print(f"Club: {details['current_club']['name']}")
            print(f"FIFA Rating: {details['fifa_ratings']['overall']}")
