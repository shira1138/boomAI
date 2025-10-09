from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({'message': 'Backend is running'})

@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask!'})

def handler(environ, start_response):
    return app.wsgi_app(environ, start_response)
