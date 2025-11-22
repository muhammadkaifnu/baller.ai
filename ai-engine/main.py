from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import logging
import asyncio
from scraper import scrape_fixtures_espn, scrape_player_stats, scrape_team_stats
from database import db_manager
from predictor import predict_match_outcome, predict_season_standings, predict_player_performance, get_hot_predictions
from model import predict_match_winner, predict_multiple_matches, get_team_strength_analysis, get_head_to_head_prediction

load_dotenv()

app = FastAPI(title="Football Hub AI Engine")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def run_scraping_pipeline():
    """Background task to run the complete scraping pipeline."""
    try:
        logger.info("🔄 Starting scraping pipeline...")
        
        # Scrape Premier League fixtures
        logger.info("📅 Scraping fixtures from ESPN...")
        fixtures = scrape_fixtures_espn()
        if fixtures:
            result = db_manager.save_matches_to_db(fixtures)
            logger.info(f"✓ Fixtures saved: {result}")
        
        # Scrape player stats
        logger.info("👥 Scraping player statistics...")
        player_stats = scrape_player_stats()
        if player_stats:
            result = db_manager.save_player_stats_to_db(player_stats)
            logger.info(f"✓ Player stats saved: {result}")
        
        # Scrape team stats
        logger.info("⚽ Scraping team statistics...")
        team_stats = scrape_team_stats()
        if team_stats:
            result = db_manager.save_team_stats_to_db(team_stats)
            logger.info(f"✓ Team stats saved: {result}")
        
        logger.info("✅ Scraping pipeline completed successfully")
    
    except Exception as e:
        logger.error(f"❌ Error in scraping pipeline: {e}")


@app.get("/health")
async def health_check():
    return {"status": "AI Engine is running"}


@app.get("/api")
async def api_root():
    return {"message": "Football Hub AI Engine API"}


@app.get("/trigger-scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """
    Trigger the scraping pipeline in the background.
    
    Returns:
        dict: Success message with task status
    """
    background_tasks.add_task(run_scraping_pipeline)
    return {
        "status": "success",
        "message": "Scraping pipeline triggered in background",
        "task": "data_ingestion"
    }


@app.get("/api/scrape")
async def scrape_data():
    return {"message": "Web scraping endpoint ready"}


@app.get("/api/predict")
async def predict():
    return {"message": "ML prediction endpoint ready"}


@app.get("/api/predict/match")
async def predict_match(home_team: str, away_team: str):
    """Predict match outcome."""
    prediction = predict_match_outcome(home_team, away_team)
    return {"success": True, "data": prediction}


@app.get("/api/predict/season")
async def predict_season(league: str = "Premier League"):
    """Predict season standings."""
    standings = predict_season_standings(league)
    return {"success": True, "league": league, "data": standings}


@app.get("/api/predict/player")
async def predict_player(player_name: str, team: str):
    """Predict player performance."""
    prediction = predict_player_performance(player_name, team)
    return {"success": True, "data": prediction}


@app.get("/api/predict/hot")
async def get_hot():
    """Get hot predictions for upcoming matches."""
    predictions = get_hot_predictions()
    return {"success": True, "data": predictions}


@app.get("/predict")
async def predict(home_team: str, away_team: str):
    """
    Predict match winner using Elo ratings.
    
    Args:
        home_team: Home team name
        away_team: Away team name
    
    Returns:
        Prediction with winner, probabilities, and confidence
    """
    prediction = predict_match_winner(home_team, away_team)
    return {"success": True, "data": prediction}


@app.post("/api/predict/batch")
async def predict_batch(matches: list):
    """
    Predict winners for multiple matches.
    
    Args:
        matches: List of match dictionaries with home_team and away_team
    
    Returns:
        List of predictions
    """
    predictions = predict_multiple_matches(matches)
    return {"success": True, "count": len(predictions), "data": predictions}


@app.get("/api/predict/team-strength")
async def team_strength(team_name: str):
    """
    Get strength analysis for a team.
    
    Args:
        team_name: Team name
    
    Returns:
        Team strength analysis with Elo rating and category
    """
    analysis = get_team_strength_analysis(team_name)
    return {"success": True, "data": analysis}


@app.get("/api/predict/head-to-head")
async def head_to_head(team1: str, team2: str, h2h_wins_team1: int = 0, h2h_wins_team2: int = 0):
    """
    Get head-to-head prediction considering historical record.
    
    Args:
        team1: First team name
        team2: Second team name
        h2h_wins_team1: Historical wins for team1
        h2h_wins_team2: Historical wins for team2
    
    Returns:
        Head-to-head prediction blending Elo and historical data
    """
    prediction = get_head_to_head_prediction(team1, team2, h2h_wins_team1, h2h_wins_team2)
    return {"success": True, "data": prediction}


@app.get("/api/matches")
async def get_matches(limit: int = 50):
    """Retrieve real-time matches from database with AI predictions."""
    try:
        matches = db_manager.get_matches(limit=limit)
        
        # Add AI predictions to each match
        matches_with_predictions = []
        for match in matches:
            try:
                # Get prediction for this match
                prediction = predict_match_winner(match.get('home_team'), match.get('away_team'))
                match['prediction'] = prediction
                matches_with_predictions.append(match)
            except Exception as e:
                logger.warning(f"Could not generate prediction for {match.get('home_team')} vs {match.get('away_team')}: {e}")
                matches_with_predictions.append(match)
        
        logger.info(f"✓ Retrieved {len(matches_with_predictions)} real-time matches from database with predictions")
        return {
            "success": True,
            "count": len(matches_with_predictions), 
            "matches": matches_with_predictions,
            "source": "mongodb_with_predictions"
        }
    except Exception as e:
        logger.error(f"✗ Error retrieving matches: {e}")
        return {
            "success": False,
            "error": str(e),
            "count": 0,
            "matches": []
        }


@app.get("/api/debug/db-status")
async def debug_db_status():
    """Debug endpoint to check database status."""
    try:
        if db_manager.db is not None:
            collections = db_manager.db.list_collection_names()
            match_count = db_manager.db.matches.count_documents({})
            return {
                "status": "connected",
                "collections": collections,
                "matches_count": match_count,
                "database": "football"
            }
        else:
            return {"status": "disconnected"}
    except Exception as e:
        return {"status": "error", "error": str(e)}



# Global flag to control auto-scraping
auto_scrape_enabled = True

async def auto_scrape_task():
    """Background task that runs scraping every 30 seconds."""
    global auto_scrape_enabled
    logger.info("🔄 Auto-scraping task started (every 30 seconds)")
    
    while auto_scrape_enabled:
        try:
            await asyncio.sleep(30)  # Wait 30 seconds
            if auto_scrape_enabled:
                logger.info("⏰ Auto-scraping triggered...")
                run_scraping_pipeline()
        except Exception as e:
            logger.error(f"Error in auto-scrape task: {e}")


@app.on_event("startup")
async def startup_event():
    """Start auto-scraping task on startup."""
    asyncio.create_task(auto_scrape_task())
    logger.info("✅ Auto-scraping enabled (30 second intervals)")


@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection and stop auto-scraping on shutdown."""
    global auto_scrape_enabled
    auto_scrape_enabled = False
    db_manager.close()
    logger.info("🛑 Auto-scraping stopped")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
