"""
Live Quiz Platform - FastAPI Server (PATH FIXED)
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from quiz_manager import QuizManager

# Initialize FastAPI app
app = FastAPI(title="Live Quiz Platform", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize quiz manager
quiz_manager = QuizManager()

# Store active WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, quiz_code: str, player_id: str):
        await websocket.accept()
        
        if quiz_code not in self.active_connections:
            self.active_connections[quiz_code] = {}
        
        self.active_connections[quiz_code][player_id] = websocket
    
    def disconnect(self, quiz_code: str, player_id: str):
        if quiz_code in self.active_connections:
            self.active_connections[quiz_code].pop(player_id, None)
            if not self.active_connections[quiz_code]:
                del self.active_connections[quiz_code]
    
    async def broadcast_to_quiz(self, quiz_code: str, message: dict, exclude_player: str = None):
        if quiz_code not in self.active_connections:
            return
        
        for player_id, connection in self.active_connections[quiz_code].items():
            if player_id != exclude_player:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

# Pydantic models
class CreateQuizRequest(BaseModel):
    host_name: str

class JoinQuizRequest(BaseModel):
    quiz_code: str
    player_name: str

class SubmitAnswerRequest(BaseModel):
    quiz_code: str
    player_id: str
    answer_index: int

class StartQuizRequest(BaseModel):
    quiz_code: str

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Option 1: Frontend is inside backend folder
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Option 2: Frontend is outside backend folder (uncomment if needed)
# PARENT_DIR = os.path.dirname(BASE_DIR)
# FRONTEND_DIR = os.path.join(PARENT_DIR, "frontend")

print(f"📁 Base directory: {BASE_DIR}")
print(f"📁 Looking for frontend at: {FRONTEND_DIR}")

# Check if frontend exists
if os.path.exists(FRONTEND_DIR):
    print(f"✅ Frontend directory found!")
    print(f"📄 Files: {os.listdir(FRONTEND_DIR)}")
else:
    print(f"❌ Frontend directory NOT found at {FRONTEND_DIR}")
    print("📌 Make sure the 'frontend' folder is in the same directory as main.py")

# API Endpoints
@app.post("/api/create-quiz")
async def create_quiz(request: CreateQuizRequest):
    """Create a new quiz"""
    if not request.host_name:
        raise HTTPException(status_code=400, detail="Host name is required")
    
    quiz_code = quiz_manager.create_quiz(request.host_name)
    return {"quiz_code": quiz_code, "message": "Quiz created successfully"}

@app.post("/api/join-quiz")
async def join_quiz(request: JoinQuizRequest):
    """Join an existing quiz"""
    if not request.quiz_code or not request.player_name:
        raise HTTPException(status_code=400, detail="Quiz code and player name are required")
    
    player_id = quiz_manager.join_quiz(request.quiz_code, request.player_name)
    
    if not player_id:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    return {"player_id": player_id, "message": "Joined successfully"}

@app.post("/api/start-quiz")
async def start_quiz(request: StartQuizRequest):
    """Start a quiz"""
    if not request.quiz_code:
        raise HTTPException(status_code=400, detail="Quiz code is required")
    
    success = quiz_manager.start_quiz(request.quiz_code)
    
    if not success:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    current_question = quiz_manager.get_current_question(request.quiz_code)
    if current_question:
        await manager.broadcast_to_quiz(
            request.quiz_code,
            {
                "type": "new_question",
                "question": current_question
            }
        )
    
    return {"message": "Quiz started"}

@app.post("/api/submit-answer")
async def submit_answer(request: SubmitAnswerRequest):
    """Submit an answer"""
    if not all([request.quiz_code, request.player_id, request.answer_index is not None]):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    is_correct = quiz_manager.submit_answer(
        request.quiz_code, 
        request.player_id, 
        request.answer_index
    )
    
    if is_correct is None:
        raise HTTPException(status_code=404, detail="Quiz or player not found")
    
    return {"correct": is_correct}

@app.post("/api/next-question")
async def next_question(request: StartQuizRequest):
    """Move to next question"""
    if not request.quiz_code:
        raise HTTPException(status_code=400, detail="Quiz code is required")
    
    has_next = quiz_manager.next_question(request.quiz_code)
    
    if has_next:
        current_question = quiz_manager.get_current_question(request.quiz_code)
        if current_question:
            await manager.broadcast_to_quiz(
                request.quiz_code,
                {
                    "type": "new_question",
                    "question": current_question
                }
            )
        return {"has_next": True, "message": "Next question"}
    else:
        leaderboard = quiz_manager.get_leaderboard(request.quiz_code)
        await manager.broadcast_to_quiz(
            request.quiz_code,
            {
                "type": "quiz_finished",
                "leaderboard": leaderboard
            }
        )
        return {"has_next": False, "message": "Quiz finished"}

@app.get("/api/leaderboard/{quiz_code}")
async def get_leaderboard(quiz_code: str):
    """Get leaderboard"""
    leaderboard = quiz_manager.get_leaderboard(quiz_code)
    return {"leaderboard": leaderboard}

@app.get("/api/quiz-state/{quiz_code}")
async def get_quiz_state(quiz_code: str):
    """Get quiz state"""
    state = quiz_manager.get_quiz_state(quiz_code)
    if not state:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return state

# WebSocket endpoint
@app.websocket("/ws/{quiz_code}/{player_id}")
async def websocket_endpoint(websocket: WebSocket, quiz_code: str, player_id: str):
    await manager.connect(websocket, quiz_code, player_id)
    
    try:
        current_question = quiz_manager.get_current_question(quiz_code)
        if current_question:
            await websocket.send_json({
                "type": "new_question",
                "question": current_question
            })
        else:
            await websocket.send_json({
                "type": "waiting",
                "message": "Waiting for quiz to start..."
            })
        
        while True:
            data = await websocket.receive_text()
            
    except WebSocketDisconnect:
        manager.disconnect(quiz_code, player_id)

# Serve HTML files - FIXED PATH
@app.get("/")
async def serve_root():
    """Serve the host page"""
    file_path = os.path.join(FRONTEND_DIR, "host.html")
    print(f"🔍 Looking for: {file_path}")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        return {"error": f"host.html not found at {file_path}"}

@app.get("/player")
async def serve_player():
    """Serve the player page"""
    file_path = os.path.join(FRONTEND_DIR, "player.html")
    print(f"🔍 Looking for: {file_path}")
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        return {"error": f"player.html not found at {file_path}"}

@app.get("/{path:path}")
async def serve_static(path: str):
    """Serve static files (CSS, JS)"""
    file_path = os.path.join(FRONTEND_DIR, path)
    if os.path.exists(file_path) and path.endswith((".css", ".js", ".html")):
        return FileResponse(file_path)
    return {"error": f"File not found: {path}"}

if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting Live Quiz Platform...")
    print(f"📁 Serving files from: {FRONTEND_DIR}")
    print("🌐 Open http://localhost:8000 for Host Dashboard")
    print("🌐 Open http://localhost:8000/player for Player View")
    print("📌 Press CTRL+C to stop\n")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")