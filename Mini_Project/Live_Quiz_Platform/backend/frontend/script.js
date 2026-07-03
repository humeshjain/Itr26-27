// script.js - Shared utilities for quiz platform

console.log("📚 script.js loaded");

// API functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(endpoint, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.detail || `HTTP error! status: ${response.status}`);
        }
        
        return result;
    } catch (error) {
        console.error(`❌ API Error (${endpoint}):`, error);
        throw error;
    }
}

// Quiz API wrapper
const QuizAPI = {
    createQuiz: (hostName) => apiRequest('/api/create-quiz', 'POST', { host_name: hostName }),
    joinQuiz: (quizCode, playerName) => apiRequest('/api/join-quiz', 'POST', { quiz_code: quizCode, player_name: playerName }),
    startQuiz: (quizCode) => apiRequest('/api/start-quiz', 'POST', { quiz_code: quizCode }),
    submitAnswer: (quizCode, playerId, answerIndex) => apiRequest('/api/submit-answer', 'POST', { quiz_code: quizCode, player_id: playerId, answer_index: answerIndex }),
    nextQuestion: (quizCode) => apiRequest('/api/next-question', 'POST', { quiz_code: quizCode }),
    getLeaderboard: (quizCode) => apiRequest(`/api/leaderboard/${quizCode}`),
    getQuizState: (quizCode) => apiRequest(`/api/quiz-state/${quizCode}`),
};

// WebSocket helper
function connectWebSocket(quizCode, playerId, onMessage) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/${quizCode}/${playerId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => console.log('✅ WebSocket connected');
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (onMessage) onMessage(data);
        } catch (error) {
            console.error('❌ WebSocket parse error:', error);
        }
    };
    ws.onerror = (error) => console.error('❌ WebSocket error:', error);
    ws.onclose = () => console.log('🔌 WebSocket disconnected');
    
    return ws;
}

console.log("✅ QuizAPI ready:", QuizAPI);