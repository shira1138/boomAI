from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import logging
from datetime import datetime
import json
import uuid
import random

# Configuration
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'boom-ai-secret-key')
    RATE_LIMIT = "100 per day;10 per minute"
    MODEL_PATH = os.environ.get('MODEL_PATH', './models')


# Initialize app
app = Flask(__name__, static_folder='frontend/build', static_url_path='')
app.config.from_object(Config)
CORS(app)

# Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=[app.config['RATE_LIMIT']],
    storage_uri="memory://",
)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
    handlers=[
        logging.FileHandler('boom_ai.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


# AI Model Logic
class BoomAIModel:
    def __init__(self):
        self.models = {}
        self.conversations = {}

    def load_models(self):
        """Load multiple AI models for different tasks"""
        try:
            self.models = {
                'chat': self._load_chat_model(),
                'analysis': self._load_analysis_model(),
                'creative': self._load_creative_model()
            }
            logger.info("All AI models loaded successfully")
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")

    def _load_chat_model(self):
        return {"type": "chat", "status": "loaded"}

    def _load_analysis_model(self):
        return {"type": "analysis", "status": "loaded"}

    def _load_creative_model(self):
        return {"type": "creative", "status": "loaded"}

    def process_message(self, message, conversation_id=None, model_type='chat'):
        if conversation_id is None:
            conversation_id = str(uuid.uuid4())

        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = {
                'created_at': datetime.now().isoformat(),
                'messages': [],
                'model_type': model_type
            }

        ai_response = self._generate_response(message, model_type)

        self.conversations[conversation_id]['messages'].append({
            'user_message': message,
            'ai_response': ai_response,
            'timestamp': datetime.now().isoformat()
        })

        return {
            'conversation_id': conversation_id,
            'response': ai_response,
            'model_used': model_type,
            'tokens_used': len(message.split()) + len(ai_response['response'].split())
        }

    def _generate_response(self, message, model_type):
        normalized = message.lower().strip()

        custom_responses = {
            "who developed boom ai": "Boom AI was proudly developed by Gift Chimwaza, a student studying civil engineering at MUBAS",
            "who is gift chimwaza": "Gift Chimwaza is a detail-oriented builder and security-minded operator, known for crafting robust, user-centric systems.",
            "what is boom ai": "Boom AI is a modular, scalable AI assistant built to handle chat, analysis, and creative tasks with clarity and operational excellence.",
            "who made this": "This system was created by Gift Chimwaza, with a focus on accessibility, security, and delighting users.",
            "who built this": "Gift Chimwaza built Boom AI from the ground up, integrating frontend, backend, and model orchestration."
        }

        if normalized in custom_responses:
            return {
                'response': custom_responses[normalized],
                'confidence': 0.99,
                'sources': ['Internal System Metadata'],
                'suggested_questions': [
                    "What can Boom AI do?",
                    "How was it built?",
                    "Can I contribute?"
                ]
            }

        base_responses = {
            'chat': [
                f"I understand you're asking: {message}. Here's my thoughtful response...",
                f"Interesting question about {message}. Let me share some insights...",
                f"Regarding {message}, I think you'll find this perspective helpful..."
            ],
            'analysis': [
                f"Analyzing your query: {message}. The data suggests...",
                f"Based on analytical processing of '{message}', the results indicate...",
                f"Statistical analysis of your question reveals..."
            ],
            'creative': [
                f"✨ Inspired by '{message}', let me create something magical...",
                f"🎨 Creative interpretation of your idea: {message}",
                f"💫 Building on '{message}', here's a creative perspective..."
            ]
        }

        response_text = random.choice(base_responses.get(model_type, base_responses['chat']))

        return {
            'response': response_text,
            'confidence': round(random.uniform(0.8, 0.98), 2),
            'sources': ['Internal Knowledge Base', 'Pattern Analysis'],
            'suggested_questions': [
                "Can you tell me more about this?",
                "How does this apply to my situation?",
                "What are the alternatives?"
            ]
        }


# Initialize AI system
boom_ai = BoomAIModel()
boom_ai.load_models()

# === ROUTES ===

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        question = data.get('question', '').strip()

        if not question:
            return jsonify({"error": "No question provided"}), 400

        result = boom_ai.process_message(question, model_type='chat')

        return jsonify({
            "answer": result['response']['response'],
            "confidence": result['response']['confidence'],
            "suggested_questions": result['response']['suggested_questions']
        })

    except Exception as e:
        logger.error(f"Ask endpoint error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Boom AI API",
        "timestamp": datetime.now().isoformat(),
        "models_loaded": len(boom_ai.models) > 0,
        "active_conversations": len(boom_ai.conversations)
    })


@app.route('/api/chat', methods=['POST'])
@limiter.limit("10 per minute")
def chat():
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return jsonify({"error": "Missing 'message' in request"}), 400

        message = data['message']
        conversation_id = data.get('conversation_id')
        model_type = data.get('model_type', 'chat')

        if model_type not in ['chat', 'analysis', 'creative']:
            return jsonify({"error": "Invalid model type"}), 400

        logger.info(f"Processing chat message: {message[:100]}...")

        result = boom_ai.process_message(message, conversation_id, model_type)

        return jsonify({
            "success": True,
            "conversation_id": result['conversation_id'],
            "response": result['response'],
            "model_used": result['model_used'],
            "tokens_used": result['tokens_used'],
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({"error": "Failed to process message"}), 500


@app.route('/api/conversation/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    if conversation_id in boom_ai.conversations:
        return jsonify({
            "success": True,
            "conversation": boom_ai.conversations[conversation_id]
        })
    else:
        return jsonify({"error": "Conversation not found"}), 404


@app.route('/api/models', methods=['GET'])
def get_models():
    return jsonify({
        "available_models": [
            {"id": "chat", "name": "Chat Assistant", "description": "General conversation and Q&A"},
            {"id": "analysis", "name": "Data Analysis", "description": "Data processing and insights"},
            {"id": "creative", "name": "Creative Writer", "description": "Creative writing and ideas"}
        ]
    })


@app.route('/api/analyze', methods=['POST'])
@limiter.limit("5 per minute")
def analyze_text():
    try:
        data = request.get_json()
        text = data.get('text', '')

        analysis = {
            'word_count': len(text.split()),
            'char_count': len(text),
            'estimated_reading_time': f"{max(1, len(text.split()) // 200)} minutes",
            'sentiment': 'neutral',
            'key_topics': list(set([word for word in text.lower().split() if len(word) > 4][:5]))
        }

        return jsonify({
            "success": True,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({"error": "Analysis failed"}), 500


# Run server
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
