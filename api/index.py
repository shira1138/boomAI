from flask import Flask, jsonify, request

app = Flask(__name__)

# Root route for health check or confirmation
@app.route('/')
def home():
    return jsonify({'message': 'Backend is running'})

# Example API route
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from Flask!'})

# Vercel-compatible entry point
def handler(environ, start_response):
    return app.wsgi_app(environ, start_response)
