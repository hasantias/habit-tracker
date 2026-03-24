from flask import Flask
from config import Config
from models import db
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes_auth import auth_bp
from routes_tasks import tasks_bp
from routes_connect import connect_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
jwt = JWTManager(app)

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(connect_bp, url_prefix='/api/connect')

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return "Habit Tracker API is running"

if __name__ == '__main__':
    # app.run(debug=True, port=5000)
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
