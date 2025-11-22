from pymongo import MongoClient, UpdateOne
from pymongo.errors import PyMongoError
import os
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://muhammadkaifnu_db_user:dd7499a8@cluster0.eybpzsa.mongodb.net/football?retryWrites=true&w=majority")


class DatabaseManager:
    """Manages MongoDB connections and operations for the Football Hub."""
    
    def __init__(self):
        """Initialize MongoDB connection."""
        try:
            # Disable SSL verification for development (macOS certificate issue)
            self.client = MongoClient(MONGODB_URI, tlsAllowInvalidCertificates=True)
            self.db = self.client.football
            # Verify connection
            self.client.admin.command('ping')
            logger.info("✓ MongoDB connection established")
        except PyMongoError as e:
            logger.error(f"✗ MongoDB connection error: {e}")
            self.client = None
            self.db = None
    
    def save_matches_to_db(self, matches):
        """
        Save or update matches in MongoDB using upsert.
        
        Args:
            matches (list): List of match dictionaries with keys:
                          date, home_team, away_team, home_score, away_score, status
        
        Returns:
            dict: Operation result with upserted_count and matched_count
        """
        if self.db is None:
            logger.error("Database connection not available")
            return {"error": "Database connection failed"}
        
        try:
            collection = self.db.matches
            logger.info(f"Saving {len(matches)} matches to database...")
            
            operations = []
            for match in matches:
                # Create unique identifier for upsert
                filter_query = {
                    "date": match.get("date"),
                    "home_team": match.get("home_team"),
                    "away_team": match.get("away_team"),
                    "league": match.get("league", "Premier League")
                }
                
                # Update document with new data, add timestamp
                update_data = {
                    "$set": {
                        **match,
                        "updated_at": datetime.utcnow()
                    },
                    "$setOnInsert": {
                        "created_at": datetime.utcnow()
                    }
                }
                
                operations.append(UpdateOne(filter_query, update_data, upsert=True))
            
            if operations:
                result = collection.bulk_write(operations)
                logger.info(
                    f"✓ Matches saved: {result.upserted_count} upserted, "
                    f"{result.modified_count} updated"
                )
                return {
                    "upserted_count": result.upserted_count,
                    "modified_count": result.modified_count,
                    "total_processed": len(matches)
                }
            else:
                logger.warning("No matches to save")
                return {"error": "No matches provided"}
        
        except PyMongoError as e:
            logger.error(f"✗ Error saving matches to database: {e}")
            return {"error": str(e)}
    
    def save_player_stats_to_db(self, stats):
        """
        Save or update player statistics in MongoDB.
        
        Args:
            stats (list): List of player stat dictionaries
        
        Returns:
            dict: Operation result
        """
        if self.db is None:
            logger.error("Database connection not available")
            return {"error": "Database connection failed"}
        
        try:
            collection = self.db.player_stats
            
            operations = []
            for stat in stats:
                # Use player name and season as unique identifier
                filter_query = {
                    "player": stat.get("player"),
                    "season": "2024/25"
                }
                
                update_data = {
                    "$set": {
                        **stat,
                        "updated_at": datetime.utcnow()
                    },
                    "$setOnInsert": {
                        "created_at": datetime.utcnow()
                    }
                }
                
                operations.append(UpdateOne(filter_query, update_data, upsert=True))
            
            if operations:
                result = collection.bulk_write(operations)
                logger.info(
                    f"✓ Player stats saved: {result.upserted_count} upserted, "
                    f"{result.modified_count} updated"
                )
                return {
                    "upserted_count": result.upserted_count,
                    "modified_count": result.modified_count,
                    "total_processed": len(stats)
                }
            else:
                return {"error": "No stats provided"}
        
        except PyMongoError as e:
            logger.error(f"✗ Error saving player stats: {e}")
            return {"error": str(e)}
    
    def save_team_stats_to_db(self, stats):
        """
        Save or update team statistics in MongoDB.
        
        Args:
            stats (list): List of team stat dictionaries
        
        Returns:
            dict: Operation result
        """
        if self.db is None:
            logger.error("Database connection not available")
            return {"error": "Database connection failed"}
        
        try:
            collection = self.db.team_stats
            
            operations = []
            for stat in stats:
                filter_query = {
                    "team": stat.get("team"),
                    "season": "2024/25"
                }
                
                update_data = {
                    "$set": {
                        **stat,
                        "updated_at": datetime.utcnow()
                    },
                    "$setOnInsert": {
                        "created_at": datetime.utcnow()
                    }
                }
                
                operations.append(UpdateOne(filter_query, update_data, upsert=True))
            
            if operations:
                result = collection.bulk_write(operations)
                logger.info(
                    f"✓ Team stats saved: {result.upserted_count} upserted, "
                    f"{result.modified_count} updated"
                )
                return {
                    "upserted_count": result.upserted_count,
                    "modified_count": result.modified_count,
                    "total_processed": len(stats)
                }
            else:
                return {"error": "No stats provided"}
        
        except PyMongoError as e:
            logger.error(f"✗ Error saving team stats: {e}")
            return {"error": str(e)}
    
    def get_matches(self, limit=50):
        """Retrieve matches from database."""
        if self.db is None:
            return []
        
        try:
            collection = self.db.matches
            matches = list(collection.find({}).limit(limit))
            # Convert ObjectId to string for JSON serialization
            for match in matches:
                match['_id'] = str(match['_id'])
            return matches
        except PyMongoError as e:
            logger.error(f"Error retrieving matches: {e}")
            return []
    
    def close(self):
        """Close MongoDB connection."""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")


# Global database manager instance
db_manager = DatabaseManager()
