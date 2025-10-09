from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask!'})

# Vercel-compatible entry point
def app_handler(request):
    return app(request)
