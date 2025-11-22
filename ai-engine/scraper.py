import requests
from datetime import datetime, timedelta
import logging
import soccerdata as sd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# AllSportsAPI - Primary source for real live data
# ESPN API configuration for top leagues
ESPN_LEAGUES = {
    "eng.1": "Premier League",
    "esp.1": "La Liga", 
    "ita.1": "Serie A",
    "ger.1": "Bundesliga",
    "fra.1": "Ligue 1"
}

def fetch_match_lineups(match_id, league_id):
    """
    Fetch detailed lineup information for a specific match from ESPN API.
    
    Args:
        match_id: ESPN match ID
        league_id: ESPN league ID (e.g., 'eng.1')
    
    Returns:
        dict: Lineups with player details including photos and ratings
    """
    try:
        # ESPN API endpoint for match summary (includes lineups)
        url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{league_id}/summary?event={match_id}"
        
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return {}
        
        data = response.json()
        
        # Try to get lineups from boxscore first
        boxscore = data.get('boxscore', {})
        players = boxscore.get('players', [])
        
        lineups = {
            'home': [],
            'away': []
        }
        
        # If boxscore players found, use them
        if players:
            for team_idx, team_key in enumerate(['home', 'away']):
                if team_idx >= len(players):
                    continue
                    
                team_data = players[team_idx]
                statistics = team_data.get('statistics', [])
                
                # Find starters
                for stat_group in statistics:
                    if stat_group.get('name') == 'Starters' or 'starter' in stat_group.get('name', '').lower():
                        athletes = stat_group.get('athletes', [])
                        
                        for athlete in athletes:
                            player_info = athlete.get('athlete', {})
                            stats = athlete.get('stats', [])
                            rating = None
                            
                            # Try to find rating
                            for stat in stats:
                                if isinstance(stat, str) and ('rating' in stat.lower() or 'grade' in stat.lower()):
                                    try:
                                        rating = float(stat)
                                    except:
                                        pass
                            
                            player = {
                                'number': player_info.get('jersey', ''),
                                'name': player_info.get('displayName', player_info.get('name', 'Unknown')),
                                'position': player_info.get('position', {}).get('abbreviation', 'N/A'),
                                'photo': player_info.get('headshot', {}).get('href', ''),
                                'rating': rating
                            }
                            lineups[team_key].append(player)

        # If no boxscore players, try rosters
        if not lineups['home'] and not lineups['away']:
            rosters = data.get('rosters', [])
            for roster_data in rosters:
                team_key = 'home' if roster_data.get('homeAway') == 'home' else 'away'
                athletes = roster_data.get('roster', [])
                
                for athlete_entry in athletes:
                    # Check if starter (starter status might be in different fields, usually 'starter': true)
                    if not athlete_entry.get('starter', False):
                        continue
                        
                    player_info = athlete_entry.get('athlete', {})
                    stats = athlete_entry.get('stats', [])
                    rating = None
                    
                    player = {
                        'number': player_info.get('jersey', ''),
                        'name': player_info.get('displayName', player_info.get('name', 'Unknown')),
                        'position': player_info.get('position', {}).get('abbreviation', 'N/A'),
                        'photo': player_info.get('headshot', {}).get('href', ''),
                        'rating': rating
                    }
                    lineups[team_key].append(player)
        
        return lineups if (lineups['home'] or lineups['away']) else {}
        
    except Exception as e:
        logger.warning(f"Error fetching lineups for match {match_id}: {e}")
        return {}

def scrape_fixtures_espn():
    """
    Scrape real-time fixtures using ESPN API for top 5 leagues.
    Fetches matches across multiple dates (past 7 days and next 14 days).
    
    Returns:
        list: List of dictionaries containing match information.
    """
    try:
        logger.info("🔄 Starting real-time fixtures scrape using ESPN API...")
        
        all_fixtures = []
        
        # Generate date range: past 7 days to next 14 days
        from datetime import datetime, timedelta
        today = datetime.utcnow()
        date_range = []
        
        # Past 7 days
        for i in range(7, 0, -1):
            date = today - timedelta(days=i)
            date_range.append(date.strftime('%Y%m%d'))
        
        # Today
        date_range.append(today.strftime('%Y%m%d'))
        
        # Next 14 days
        for i in range(1, 15):
            date = today + timedelta(days=i)
            date_range.append(date.strftime('%Y%m%d'))
        
        logger.info(f"📅 Fetching matches for {len(date_range)} dates (past 7 days to next 14 days)")
        
        for league_id, league_name in ESPN_LEAGUES.items():
            try:
                logger.info(f"📡 Fetching {league_name} matches from ESPN...")
                
                league_fixtures = []
                
                # Fetch matches for each date
                for date_str in date_range:
                    try:
                        # ESPN API endpoint with date parameter
                        url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{league_id}/scoreboard?dates={date_str}"
                        
                        response = requests.get(url, timeout=10)
                        
                        if response.status_code != 200:
                            continue
                        
                        data = response.json()
                        
                        if 'events' not in data or not data['events']:
                            continue
                        
                        for event in data['events']:
                            try:
                                # Extract match information
                                match_id = event.get('id')
                                match_date = event.get('date')  # ISO format
                                
                                # Get status with better detection
                                status_obj = event.get('status', {})
                                status_type = status_obj.get('type', {}).get('name', 'scheduled').lower()
                                status_state = status_obj.get('type', {}).get('state', '').lower()
                                status_completed = status_obj.get('type', {}).get('completed', False)
                                
                                # Determine match status
                                if status_completed or 'post' in status_type or 'final' in status_type or 'full' in status_type:
                                    status = 'finished'
                                elif 'in' in status_type or status_type == 'live' or status_state == 'in':
                                    status = 'live'
                                else:
                                    status = 'scheduled'
                                
                                # Get teams
                                competitions = event.get('competitions', [])
                                if not competitions:
                                    continue
                                
                                competition = competitions[0]
                                competitors = competition.get('competitors', [])
                                
                                if len(competitors) < 2:
                                    continue
                                
                                # ESPN typically has home team at index 0, away at 1
                                home_team_data = competitors[0] if competitors[0].get('homeAway') == 'home' else competitors[1]
                                away_team_data = competitors[1] if competitors[1].get('homeAway') == 'away' else competitors[0]
                                
                                home_team = home_team_data.get('team', {}).get('displayName', 'Unknown')
                                away_team = away_team_data.get('team', {}).get('displayName', 'Unknown')
                                
                                # Get scores
                                home_score = home_team_data.get('score')
                                away_score = away_team_data.get('score')
                                
                                # Convert scores to int or None
                                try:
                                    home_score = int(home_score) if home_score is not None else None
                                except:
                                    home_score = None
                                
                                try:
                                    away_score = int(away_score) if away_score is not None else None
                                except:
                                    away_score = None
                                
                                # Additional live match detection: if match has scores and is within time window
                                if status == 'scheduled' and home_score is not None and away_score is not None:
                                    from datetime import datetime, timedelta
                                    try:
                                        match_time = datetime.fromisoformat(match_date.replace('Z', '+00:00'))
                                        now = datetime.now(match_time.tzinfo)
                                        # If match started within last 2 hours and not marked as finished, it's likely live
                                        if match_time <= now <= match_time + timedelta(hours=2):
                                            status = 'live'
                                            logger.info(f"🔴 Detected live match by time: {home_team} vs {away_team}")
                                    except:
                                        pass
                                
                                # Get venue
                                venue = competition.get('venue', {}).get('fullName', '')
                                
                                # Try to get lineups from boxscore first
                                boxscore = data.get('boxscore', {})
                                players = boxscore.get('players', [])
                                
                                lineups = {
                                    'home': [],
                                    'away': []
                                }
                                
                                # If boxscore players found, use them
                                if players:
                                    for team_idx, team_key in enumerate(['home', 'away']):
                                        if team_idx >= len(players):
                                            continue
                                            
                                        team_data = players[team_idx]
                                        statistics = team_data.get('statistics', [])
                                        
                                        # Find starters
                                        for stat_group in statistics:
                                            if stat_group.get('name') == 'Starters' or 'starter' in stat_group.get('name', '').lower():
                                                athletes = stat_group.get('athletes', [])
                                                
                                                for athlete in athletes:
                                                    player_info = athlete.get('athlete', {})
                                                    stats = athlete.get('stats', [])
                                                    rating = None
                                                    
                                                    # Try to find rating
                                                    for stat in stats:
                                                        if isinstance(stat, str) and ('rating' in stat.lower() or 'grade' in stat.lower()):
                                                            try:
                                                                rating = float(stat)
                                                            except:
                                                                pass
                                                    
                                                    player = {
                                                        'number': player_info.get('jersey', ''),
                                                        'name': player_info.get('displayName', player_info.get('name', 'Unknown')),
                                                        'position': player_info.get('position', {}).get('abbreviation', 'N/A'),
                                                        'photo': player_info.get('headshot', {}).get('href', ''),
                                                        'rating': rating
                                                    }
                                                    lineups[team_key].append(player)

                                # If no boxscore players, try rosters
                                if not lineups['home'] and not lineups['away']:
                                    rosters = data.get('rosters', [])
                                    for roster_data in rosters:
                                        team_key = 'home' if roster_data.get('homeAway') == 'home' else 'away'
                                        athletes = roster_data.get('roster', [])
                                        
                                        for athlete_entry in athletes:
                                            # Check if starter (starter status might be in different fields, usually 'starter': true)
                                            if not athlete_entry.get('starter', False):
                                                continue
                                                
                                            player_info = athlete_entry.get('athlete', {})
                                            stats = athlete_entry.get('stats', [])
                                            rating = None
                                            
                                            # Try to find rating
                                            # Note: In rosters, stats might be a list of objects with name/value
                                            # But based on output, it seems stats is a list of objects
                                            
                                            player = {
                                                'number': player_info.get('jersey', ''),
                                                'name': player_info.get('displayName', player_info.get('name', 'Unknown')),
                                                'position': player_info.get('position', {}).get('abbreviation', 'N/A'),
                                                'photo': player_info.get('headshot', {}).get('href', ''),
                                                'rating': rating # Ratings might not be available in rosters view easily
                                            }
                                            lineups[team_key].append(player)
                                
                                lineups = lineups if (lineups['home'] or lineups['away']) else {}
                                
                                # Get season
                                season = event.get('season', {}).get('year', '2024')
                                season_str = f"{season}/{int(season)+1}" if season else "2024/25"
                                
                                # Team logos
                                home_logo = home_team_data.get('team', {}).get('logo', '')
                                away_logo = away_team_data.get('team', {}).get('logo', '')
                                
                                fixture = {
                                    "date": match_date,
                                    "home_team": home_team,
                                    "away_team": away_team,
                                    "home_score": home_score,
                                    "away_score": away_score,
                                    "status": status,
                                    "season": season_str,
                                    "league": league_name,
                                    "stadium": venue,
                                    "referee": "",
                                    "home_logo": home_logo,
                                    "away_logo": away_logo,
                                    "lineups": lineups,
                                    "statistics": [],
                                    "match_events": [],
                                    "source_id": str(match_id)
                                }
                                league_fixtures.append(fixture)
                                
                            except Exception as e:
                                logger.warning(f"Error processing ESPN match: {e}")
                                continue
                    
                    except Exception as e:
                        logger.warning(f"Error fetching date {date_str}: {e}")
                        continue
                
                all_fixtures.extend(league_fixtures)
                logger.info(f"✓ Scraped {len(league_fixtures)} matches from {league_name}")
                
            except Exception as e:
                logger.warning(f"Error scraping {league_name}: {e}")
                continue
        
        if all_fixtures:
            logger.info(f"✅ Successfully scraped {len(all_fixtures)} total fixtures from ESPN!")
            return all_fixtures
        else:
            logger.warning("No fixtures found from ESPN, using mock data")
            return get_mock_fixtures()

    except Exception as e:
        logger.error(f"✗ Error scraping fixtures with ESPN: {e}")
        return get_mock_fixtures()



def scrape_with_alternative_method():
    """
    Alternative scraping method using football-data.org API.
    """
    try:
        logger.info("🔄 Trying football-data.org API...")
        
        # Premier League competition ID is 2021
        url = f"{FOOTBALL_API_BASE}/competitions/PL/matches"
        headers = {"X-Auth-Token": FOOTBALL_API_KEY}
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            fixtures = []
            
            if 'matches' in data:
                for match in data['matches'][:20]:
                    try:
                        home_team = match.get('homeTeam', {}).get('name', 'Unknown')
                        away_team = match.get('awayTeam', {}).get('name', 'Unknown')
                        date_str = match.get('utcDate', '')
                        status = match.get('status', 'SCHEDULED').lower()
                        
                        # Get scores
                        score = match.get('score', {})
                        home_score = score.get('fullTime', {}).get('home')
                        away_score = score.get('fullTime', {}).get('away')
                        
                        fixture = {
                            "date": date_str,
                            "home_team": home_team,
                            "away_team": away_team,
                            "home_score": home_score,
                            "away_score": away_score,
                            "status": "finished" if status == "finished" else "live" if status == "in_play" else "scheduled",
                            "season": "2024/25",
                            "league": "Premier League"
                        }
                        fixtures.append(fixture)
                    except Exception as e:
                        logger.warning(f"Error processing football-data match: {e}")
                        continue
            
            if fixtures and len(fixtures) > 0:
                logger.info(f"✓ Successfully scraped {len(fixtures)} fixtures from football-data.org")
                return fixtures
        
        logger.warning("football-data.org API failed, using mock data")
        return get_mock_fixtures()
    
    except Exception as e:
        logger.warning(f"Alternative method failed: {e}")
        return get_mock_fixtures()


def get_mock_fixtures():
    """Return comprehensive mock fixture data for testing."""
    now = datetime.utcnow()
    fixtures = [
        # Premier League - Upcoming
        {
            "date": (now + timedelta(hours=2)).isoformat(),
            "home_team": "Manchester City",
            "away_team": "Arsenal",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Premier League"
        },
        {
            "date": (now + timedelta(hours=5)).isoformat(),
            "home_team": "Liverpool",
            "away_team": "Chelsea",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Premier League"
        },
        {
            "date": (now + timedelta(hours=24)).isoformat(),
            "home_team": "Manchester United",
            "away_team": "Tottenham",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Premier League"
        },
        {
            "date": (now + timedelta(hours=30)).isoformat(),
            "home_team": "Brighton",
            "away_team": "Aston Villa",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Premier League"
        },
        {
            "date": (now + timedelta(hours=48)).isoformat(),
            "home_team": "Newcastle",
            "away_team": "West Ham",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Premier League"
        },
        # La Liga
        {
            "date": (now + timedelta(hours=3)).isoformat(),
            "home_team": "Barcelona",
            "away_team": "Real Madrid",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "La Liga"
        },
        {
            "date": (now + timedelta(hours=26)).isoformat(),
            "home_team": "Atletico Madrid",
            "away_team": "Sevilla",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "La Liga"
        },
        # Serie A
        {
            "date": (now + timedelta(hours=4)).isoformat(),
            "home_team": "Inter Milan",
            "away_team": "AC Milan",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Serie A"
        },
        {
            "date": (now + timedelta(hours=28)).isoformat(),
            "home_team": "Juventus",
            "away_team": "Napoli",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Serie A"
        },
        # Bundesliga
        {
            "date": (now + timedelta(hours=6)).isoformat(),
            "home_team": "Bayern Munich",
            "away_team": "Borussia Dortmund",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Bundesliga"
        },
        {
            "date": (now + timedelta(hours=32)).isoformat(),
            "home_team": "RB Leipzig",
            "away_team": "Bayer Leverkusen",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Bundesliga"
        },
        # Ligue 1
        {
            "date": (now + timedelta(hours=7)).isoformat(),
            "home_team": "Paris Saint-Germain",
            "away_team": "Marseille",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Ligue 1"
        },
        {
            "date": (now + timedelta(hours=36)).isoformat(),
            "home_team": "Monaco",
            "away_team": "Lyon",
            "home_score": None,
            "away_score": None,
            "status": "scheduled",
            "season": "2024/25",
            "league": "Ligue 1"
        }
    ]
    logger.info(f"📊 Using mock data: {len(fixtures)} fixtures from 5 major leagues")
    return fixtures


def scrape_player_stats():
    """
    Scrape player statistics from FBref for the current season.
    
    Returns:
        dict: Dictionary containing player statistics data
    """
    try:
        logger.info("Starting player stats scrape...")
        
        try:
            # Initialize FBref with specific league and season
            fbref = sd.FBref(leagues="ENG-Premier League", seasons="2024")
            player_stats = fbref.read_player_season_stats(stat_type="standard")
            
            if player_stats is not None and not player_stats.empty:
                # Flatten MultiIndex columns
                player_stats.columns = ['_'.join(col).strip() if isinstance(col, tuple) else col for col in player_stats.columns.values]
                
                # Reset index to get player names as columns if they are in index
                player_stats = player_stats.reset_index()
                stats_list = player_stats.to_dict(orient="records")
                logger.info(f"Successfully scraped {len(stats_list)} player statistics")
                return stats_list
            else:
                logger.warning("No player stats found, using mock data")
                return get_mock_player_stats()
        
        except Exception as e:
            logger.warning(f"FBref scraping failed: {e}, using mock data")
            return get_mock_player_stats()
    
    except Exception as e:
        logger.error(f"Error scraping player stats: {e}")
        return get_mock_player_stats()


def get_mock_player_stats():
    """Return mock player statistics for testing."""
    return [
        {"player": "Erling Haaland", "team": "Manchester City", "goals": 36, "assists": 8, "season": "2024/25"},
        {"player": "Harry Kane", "team": "Bayern Munich", "goals": 28, "assists": 6, "season": "2024/25"},
        {"player": "Kylian Mbappé", "team": "Real Madrid", "goals": 32, "assists": 10, "season": "2024/25"},
    ]


def scrape_team_stats():
    """
    Scrape team statistics from FBref.
    
    Returns:
        dict: Dictionary containing team statistics data
    """
    try:
        logger.info("Starting team stats scrape...")
        
        try:
            fbref = sd.FBref(leagues="ENG-Premier League", seasons="2024")
            team_stats = fbref.read_team_season_stats(stat_type="standard")
            
            if team_stats is not None and not team_stats.empty:
                # Flatten MultiIndex columns
                team_stats.columns = ['_'.join(col).strip() if isinstance(col, tuple) else col for col in team_stats.columns.values]
                
                team_stats = team_stats.reset_index()
                stats_list = team_stats.to_dict(orient="records")
                logger.info(f"Successfully scraped {len(stats_list)} team statistics")
                return stats_list
            else:
                logger.warning("No team stats found, using mock data")
                return get_mock_team_stats()
        
        except Exception as e:
            logger.warning(f"FBref team stats scraping failed: {e}, using mock data")
            return get_mock_team_stats()
    
    except Exception as e:
        logger.error(f"Error scraping team stats: {e}")
        return get_mock_team_stats()


def get_mock_team_stats():
    """Return mock team statistics for testing."""
    return [
        {"team": "Manchester City", "wins": 18, "draws": 2, "losses": 1, "goals_for": 62, "goals_against": 15, "season": "2024/25"},
        {"team": "Arsenal", "wins": 17, "draws": 3, "losses": 1, "goals_for": 58, "goals_against": 18, "season": "2024/25"},
        {"team": "Liverpool", "wins": 16, "draws": 2, "losses": 3, "goals_for": 55, "goals_against": 22, "season": "2024/25"},
    ]
