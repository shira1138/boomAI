from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "BoomAI backend is live!"})

# Export the app for Vercel
handler = app
