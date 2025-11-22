import logging
import soccerdata as sd
from datetime import datetime
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Elo ratings cache (in production, this would be updated regularly)
ELO_RATINGS = {
    # Premier League
    "Manchester City": 2650,
    "Arsenal": 2620,
    "Liverpool": 2600,
    "Chelsea": 2550,
    "Manchester United": 2520,
    "Tottenham": 2510,
    "Brighton": 2480,
    "Aston Villa": 2470,
    "Newcastle": 2450,
    "West Ham": 2420,
    
    # La Liga
    "Real Madrid": 2680,
    "Barcelona": 2640,
    "Atletico Madrid": 2580,
    "Sevilla": 2500,
    "Valencia": 2480,
    "Real Sociedad": 2460,
    "Villarreal": 2450,
    "Betis": 2420,
    
    # Serie A
    "Inter Milan": 2600,
    "AC Milan": 2570,
    "Juventus": 2550,
    "Napoli": 2540,
    "Lazio": 2480,
    "Roma": 2460,
    "Fiorentina": 2440,
    "Atalanta": 2430,
    
    # Bundesliga
    "Bayern Munich": 2700,
    "Borussia Dortmund": 2550,
    "RB Leipzig": 2520,
    "Bayer Leverkusen": 2500,
    "Schalke 04": 2420,
    "Eintracht Frankfurt": 2410,
    "Werder Bremen": 2390,
    
    # Ligue 1
    "Paris Saint-Germain": 2620,
    "Marseille": 2520,
    "Monaco": 2480,
    "Lyon": 2460,
    "Lille": 2450,
    "Nice": 2420,
    "Lens": 2410,
    "Rennes": 2400,
}


def get_elo_rating(team_name):
    """
    Get Elo rating for a team.
    
    Args:
        team_name (str): Team name
    
    Returns:
        int: Elo rating (default 2400 for unknown teams)
    """
    return ELO_RATINGS.get(team_name, 2400)


def calculate_win_probability(home_elo, away_elo):
    """
    Calculate win probability using Elo rating formula.
    
    Args:
        home_elo (int): Home team Elo rating
        away_elo (int): Away team Elo rating
    
    Returns:
        tuple: (home_win_prob, draw_prob, away_win_prob)
    """
    try:
        # Standard Elo formula
        expected_home = 1 / (1 + 10 ** ((away_elo - home_elo) / 400))
        expected_away = 1 - expected_home
        
        # Home advantage adjustment (typically 3% in football)
        home_advantage = 0.03
        expected_home += home_advantage
        expected_away -= home_advantage
        
        # Account for draw probability (roughly 25% in football)
        draw_probability = 0.25
        home_win_prob = expected_home * (1 - draw_probability)
        away_win_prob = expected_away * (1 - draw_probability)
        
        # Normalize to ensure sum = 1
        total = home_win_prob + away_win_prob + draw_probability
        home_win_prob = (home_win_prob / total) * 100
        away_win_prob = (away_win_prob / total) * 100
        draw_probability = (draw_probability / total) * 100
        
        return round(home_win_prob, 1), round(draw_probability, 1), round(away_win_prob, 1)
    
    except Exception as e:
        logger.error(f"Error calculating win probability: {e}")
        return 50.0, 25.0, 25.0


def get_confidence_level(probability):
    """
    Determine confidence level based on probability.
    
    Args:
        probability (float): Win probability (0-100)
    
    Returns:
        str: Confidence level
    """
    if probability >= 70:
        return "Very High"
    elif probability >= 60:
        return "High"
    elif probability >= 55:
        return "Moderate"
    elif probability >= 50:
        return "Low"
    else:
        return "Very Low"


def predict_match_winner(home_team, away_team):
    """
    Predict match winner using Elo ratings.
    
    Args:
        home_team (str): Home team name
        away_team (str): Away team name
    
    Returns:
        dict: Prediction with winner, probabilities, and confidence
    """
    try:
        logger.info(f"Predicting match: {home_team} vs {away_team}")
        
        # Get Elo ratings
        home_elo = get_elo_rating(home_team)
        away_elo = get_elo_rating(away_team)
        
        logger.info(f"Elo ratings - {home_team}: {home_elo}, {away_team}: {away_elo}")
        
        # Calculate probabilities
        home_win_prob, draw_prob, away_win_prob = calculate_win_probability(home_elo, away_elo)
        
        # Determine predicted winner
        if home_win_prob > away_win_prob and home_win_prob > draw_prob:
            predicted_winner = home_team
            win_probability = home_win_prob / 100
        elif away_win_prob > home_win_prob and away_win_prob > draw_prob:
            predicted_winner = away_team
            win_probability = away_win_prob / 100
        else:
            predicted_winner = "Draw"
            win_probability = draw_prob / 100
        
        confidence = get_confidence_level(max(home_win_prob, away_win_prob, draw_prob))
        
        prediction = {
            "home_team": home_team,
            "away_team": away_team,
            "predicted_winner": predicted_winner,
            "win_probability": round(win_probability, 2),
            "home_win_probability": home_win_prob,
            "draw_probability": draw_prob,
            "away_win_probability": away_win_prob,
            "confidence": confidence,
            "home_elo": home_elo,
            "away_elo": away_elo,
            "generated_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Prediction: {predicted_winner} to win with {confidence} confidence")
        return prediction
    
    except Exception as e:
        logger.error(f"Error predicting match winner: {e}")
        return {
            "error": str(e),
            "home_team": home_team,
            "away_team": away_team
        }


def predict_multiple_matches(matches):
    """
    Predict winners for multiple matches.
    
    Args:
        matches (list): List of match dictionaries with home_team and away_team
    
    Returns:
        list: List of predictions
    """
    try:
        predictions = []
        for match in matches:
            prediction = predict_match_winner(match.get("home_team"), match.get("away_team"))
            predictions.append(prediction)
        
        logger.info(f"Generated predictions for {len(predictions)} matches")
        return predictions
    
    except Exception as e:
        logger.error(f"Error predicting multiple matches: {e}")
        return []


def update_elo_rating(team_name, result, opponent_elo, k_factor=32):
    """
    Update Elo rating after a match result.
    
    Args:
        team_name (str): Team name
        result (str): Match result ('win', 'draw', 'loss')
        opponent_elo (int): Opponent's Elo rating
        k_factor (int): K-factor for rating change
    
    Returns:
        int: New Elo rating
    """
    try:
        current_elo = get_elo_rating(team_name)
        
        # Determine points earned
        if result == "win":
            points = 1.0
        elif result == "draw":
            points = 0.5
        else:
            points = 0.0
        
        # Calculate expected result
        expected = 1 / (1 + 10 ** ((opponent_elo - current_elo) / 400))
        
        # Calculate new Elo
        new_elo = current_elo + k_factor * (points - expected)
        
        logger.info(f"{team_name} Elo updated: {current_elo} -> {round(new_elo)}")
        return round(new_elo)
    
    except Exception as e:
        logger.error(f"Error updating Elo rating: {e}")
        return current_elo


def get_team_strength_analysis(team_name):
    """
    Get detailed strength analysis for a team.
    
    Args:
        team_name (str): Team name
    
    Returns:
        dict: Strength analysis
    """
    try:
        elo = get_elo_rating(team_name)
        
        # Categorize strength
        if elo >= 2650:
            category = "Elite"
            tier = 1
        elif elo >= 2600:
            category = "Top Tier"
            tier = 2
        elif elo >= 2550:
            category = "Strong"
            tier = 3
        elif elo >= 2500:
            category = "Above Average"
            tier = 4
        elif elo >= 2450:
            category = "Average"
            tier = 5
        else:
            category = "Below Average"
            tier = 6
        
        analysis = {
            "team": team_name,
            "elo_rating": elo,
            "category": category,
            "tier": tier,
            "strength_percentage": round((elo / 2800) * 100, 1),  # Normalized to max ~2800
            "generated_at": datetime.utcnow().isoformat()
        }
        
        return analysis
    
    except Exception as e:
        logger.error(f"Error analyzing team strength: {e}")
        return {"error": str(e), "team": team_name}


def get_head_to_head_prediction(team1, team2, historical_wins_team1=0, historical_wins_team2=0):
    """
    Get head-to-head prediction considering historical record.
    
    Args:
        team1 (str): First team name
        team2 (str): Second team name
        historical_wins_team1 (int): Historical wins for team1
        historical_wins_team2 (int): Historical wins for team2
    
    Returns:
        dict: Head-to-head prediction
    """
    try:
        # Get Elo-based prediction
        elo_prediction = predict_match_winner(team1, team2)
        
        # Calculate head-to-head advantage
        total_matches = historical_wins_team1 + historical_wins_team2
        if total_matches > 0:
            h2h_win_rate_team1 = (historical_wins_team1 / total_matches) * 100
            h2h_win_rate_team2 = (historical_wins_team2 / total_matches) * 100
        else:
            h2h_win_rate_team1 = 50.0
            h2h_win_rate_team2 = 50.0
        
        # Blend Elo prediction with head-to-head (70% Elo, 30% H2H)
        blended_team1_prob = (elo_prediction["home_win_probability"] * 0.7 + h2h_win_rate_team1 * 0.3)
        blended_team2_prob = (elo_prediction["away_win_probability"] * 0.7 + h2h_win_rate_team2 * 0.3)
        
        h2h_prediction = {
            "team1": team1,
            "team2": team2,
            "elo_based_prediction": elo_prediction,
            "head_to_head_record": {
                "team1_wins": historical_wins_team1,
                "team2_wins": historical_wins_team2,
                "team1_win_rate": round(h2h_win_rate_team1, 1),
                "team2_win_rate": round(h2h_win_rate_team2, 1)
            },
            "blended_prediction": {
                "team1_probability": round(blended_team1_prob, 1),
                "team2_probability": round(blended_team2_prob, 1),
                "predicted_winner": team1 if blended_team1_prob > blended_team2_prob else team2
            },
            "generated_at": datetime.utcnow().isoformat()
        }
        
        return h2h_prediction
    
    except Exception as e:
        logger.error(f"Error in head-to-head prediction: {e}")
        return {"error": str(e), "team1": team1, "team2": team2}
