"""
Quiz Manager - Handles all quiz logic and state
"""

import json
import uuid
from typing import Dict, List, Optional, Set
from datetime import datetime
import asyncio

class QuizManager:
    def __init__(self):
        # Quiz state
        self.quizzes: Dict[str, dict] = {}  # quiz_code -> quiz_data
        self.players: Dict[str, dict] = {}  # player_id -> player_data
        self.quiz_players: Dict[str, Set[str]] = {}  # quiz_code -> set of player_ids
        
        # Sample questions
        self.sample_questions = [
            {
                "id": 1,
                "question": "What is the capital of France?",
                "options": ["London", "Paris", "Berlin", "Madrid"],
                "correct": 1  # index of correct answer
            },
            {
                "id": 2,
                "question": "Which planet is known as the Red Planet?",
                "options": ["Venus", "Mars", "Jupiter", "Saturn"],
                "correct": 1
            },
            {
                "id": 3,
                "question": "What is the largest ocean on Earth?",
                "options": ["Atlantic", "Indian", "Arctic", "Pacific"],
                "correct": 3
            },
            {
                "id": 4,
                "question": "Who wrote 'Romeo and Juliet'?",
                "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                "correct": 1
            },
            {
                "id": 5,
                "question": "What is the chemical symbol for water?",
                "options": ["H2O", "CO2", "NaCl", "HCl"],
                "correct": 0
            }
        ]
    
    def create_quiz(self, host_name: str) -> str:
        """Create a new quiz and return the quiz code"""
        # Generate unique 6-character quiz code
        quiz_code = ''.join(str(uuid.uuid4().int)[:6])
        
        quiz_data = {
            "code": quiz_code,
            "host": host_name,
            "questions": self.sample_questions.copy(),
            "current_question": -1,
            "is_active": False,
            "created_at": datetime.now().isoformat(),
            "players": {},
            "scores": {}
        }
        
        self.quizzes[quiz_code] = quiz_data
        self.quiz_players[quiz_code] = set()
        
        return quiz_code
    
    def join_quiz(self, quiz_code: str, player_name: str) -> Optional[str]:
        """Add a player to a quiz and return player_id"""
        if quiz_code not in self.quizzes:
            return None
        
        player_id = str(uuid.uuid4())[:8]
        
        self.quizzes[quiz_code]["players"][player_id] = {
            "name": player_name,
            "score": 0,
            "joined_at": datetime.now().isoformat()
        }
        self.quiz_players[quiz_code].add(player_id)
        
        return player_id
    
    def start_quiz(self, quiz_code: str) -> bool:
        """Start the quiz"""
        if quiz_code not in self.quizzes:
            return False
        
        self.quizzes[quiz_code]["is_active"] = True
        self.quizzes[quiz_code]["current_question"] = 0
        return True
    
    def get_current_question(self, quiz_code: str) -> Optional[dict]:
        """Get the current question for a quiz"""
        if quiz_code not in self.quizzes:
            return None
        
        quiz = self.quizzes[quiz_code]
        current_idx = quiz["current_question"]
        
        if current_idx < 0 or current_idx >= len(quiz["questions"]):
            return None
        
        question = quiz["questions"][current_idx].copy()
        question.pop("correct", None)  # Remove correct answer for players
        question["total_questions"] = len(quiz["questions"])
        question["question_number"] = current_idx + 1
        
        return question
    
    def submit_answer(self, quiz_code: str, player_id: str, answer_index: int) -> Optional[bool]:
        """Submit an answer and return if it was correct"""
        if quiz_code not in self.quizzes:
            return None
        
        quiz = self.quizzes[quiz_code]
        current_idx = quiz["current_question"]
        
        if current_idx < 0 or current_idx >= len(quiz["questions"]):
            return None
        
        question = quiz["questions"][current_idx]
        correct_answer = question["correct"]
        is_correct = answer_index == correct_answer
        
        # Update score
        if is_correct and player_id in quiz["players"]:
            quiz["players"][player_id]["score"] += 10
        
        return is_correct
    
    def next_question(self, quiz_code: str) -> bool:
        """Move to the next question"""
        if quiz_code not in self.quizzes:
            return False
        
        quiz = self.quizzes[quiz_code]
        quiz["current_question"] += 1
        
        # Check if quiz is finished
        if quiz["current_question"] >= len(quiz["questions"]):
            quiz["is_active"] = False
            return False
        
        return True
    
    def get_leaderboard(self, quiz_code: str) -> List[dict]:
        """Get sorted leaderboard for a quiz"""
        if quiz_code not in self.quizzes:
            return []
        
        quiz = self.quizzes[quiz_code]
        players = []
        
        for player_id, data in quiz["players"].items():
            players.append({
                "id": player_id,
                "name": data["name"],
                "score": data["score"]
            })
        
        # Sort by score descending
        players.sort(key=lambda x: x["score"], reverse=True)
        return players
    
    def get_quiz_state(self, quiz_code: str) -> Optional[dict]:
        """Get the full state of a quiz for the host"""
        if quiz_code not in self.quizzes:
            return None
        
        quiz = self.quizzes[quiz_code]
        return {
            "code": quiz["code"],
            "host": quiz["host"],
            "is_active": quiz["is_active"],
            "current_question": quiz["current_question"],
            "total_questions": len(quiz["questions"]),
            "players": list(quiz["players"].values()),
            "player_count": len(quiz["players"])
        }