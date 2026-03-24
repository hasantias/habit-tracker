from flask import Blueprint, request, jsonify
from models import db, Task, TaskLog, Reaction
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())
    tasks = Task.query.filter_by(owner_id=user_id).all()
    
    result = []
    for t in tasks:
        logs = TaskLog.query.filter_by(task_id=t.id).all()
        streak = len(logs) # Simple streak representation
        result.append({
            'id': t.id,
            'title': t.title,
            'description': t.description,
            'repeat_interval': t.repeat_interval,
            'is_shared': t.is_shared,
            'streak': streak
        })
    return jsonify(result), 200

@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    new_task = Task(
        title=data.get('title'),
        description=data.get('description', ''),
        repeat_interval=data.get('repeat_interval', 'daily'),
        is_shared=data.get('is_shared', False),
        owner_id=user_id
    )
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({'message': 'Task created', 'id': new_task.id}), 201

@tasks_bp.route('/<int:task_id>/log', methods=['POST'])
@jwt_required()
def log_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, owner_id=user_id).first()
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
        
    log = TaskLog(task_id=task.id)
    db.session.add(log)
    db.session.commit()
    
    return jsonify({'message': 'Task logged successfully'}), 200

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.filter_by(id=task_id, owner_id=user_id).first()
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
        
    # Delete related logs and reactions
    TaskLog.query.filter_by(task_id=task.id).delete()
    Reaction.query.filter_by(task_id=task.id).delete()
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted'}), 200
