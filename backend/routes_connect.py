from flask import Blueprint, request, jsonify
from models import db, Task, Reaction, User, TaskLog
from flask_jwt_extended import jwt_required, get_jwt_identity

connect_bp = Blueprint('connect', __name__)

@connect_bp.route('/feed', methods=['GET'])
def get_feed():
    shared_tasks = Task.query.filter_by(is_shared=True).order_by(Task.created_at.desc()).all()
    result = []
    
    for t in shared_tasks:
        owner = User.query.get(t.owner_id)
        reactions = Reaction.query.filter_by(task_id=t.id).all()
        logs = TaskLog.query.filter_by(task_id=t.id).all()
        streak = len(logs)
        result.append({
            'id': t.id,
            'title': t.title,
            'description': t.description,
            'owner': owner.username,
            'streak': streak,
            'reactions': [{'emoji': r.emoji, 'user_id': r.user_id} for r in reactions]
        })
        
    return jsonify(result), 200

@connect_bp.route('/<int:task_id>/react', methods=['POST'])
@jwt_required()
def add_reaction(task_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    emoji = data.get('emoji')
    
    if not emoji:
        return jsonify({'message': 'Emoji required'}), 400
        
    reaction = Reaction(emoji=emoji, user_id=user_id, task_id=task_id)
    db.session.add(reaction)
    db.session.commit()
    
    return jsonify({'message': 'Reaction added'}), 201
