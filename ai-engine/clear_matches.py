#!/usr/bin/env python3
"""Script to clear all matches from the database."""

from database import db_manager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def clear_all_matches():
    """Clear all matches from the database."""
    try:
        if db_manager.db is None:
            logger.error("Database not connected")
            return
        
        result = db_manager.db.matches.delete_many({})
        logger.info(f"✓ Deleted {result.deleted_count} matches from database")
        
        # Also clear player and team stats if needed
        player_result = db_manager.db.player_stats.delete_many({})
        logger.info(f"✓ Deleted {player_result.deleted_count} player stats")
        
        team_result = db_manager.db.team_stats.delete_many({})
        logger.info(f"✓ Deleted {team_result.deleted_count} team stats")
        
        logger.info("✅ Database cleared successfully!")
        
    except Exception as e:
        logger.error(f"✗ Error clearing database: {e}")
    finally:
        db_manager.close()

if __name__ == "__main__":
    clear_all_matches()
