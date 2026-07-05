# routes/auth.py — Authentication endpoints
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from models.models import User, Student
from extensions import db

auth_bp = Blueprint("auth", __name__)

# ── LOGIN ─────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Username and password required"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    identity_data = {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "roll_no": user.roll_no
    }

    token = create_access_token(identity=str(user.id))
    
    student_data = None
    if user.role == "student" and user.roll_no:
        s = Student.query.get(user.roll_no)
        if s:
            student_data = s.to_dict()

    return jsonify({
        "token": token,
        "user": user.to_dict(),
        "student": student_data
    }), 200


# ── CURRENT USER ─────────────────────────────────────
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    identity = get_jwt_identity()
    return jsonify(identity), 200


# ── REGISTER (ADMIN ONLY) ────────────────────────────
@auth_bp.route("/register", methods=["POST"])
@jwt_required()
def register():
    caller = get_jwt_identity()

    if caller["role"] != "admin":
        return jsonify({"error": "Admin access required"}), 403

    data = request.get_json()

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already exists"}), 409

    user = User(
        username=data["username"],
        role=data.get("role", "student"),
        roll_no=data.get("roll_no")
    )

    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_dict()), 201


# ── CHANGE PASSWORD ──────────────────────────────────
@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    identity = get_jwt_identity()
    data = request.get_json()

    user = User.query.get(identity["id"])

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.check_password(data.get("current_password", "")):
        return jsonify({"error": "Current password incorrect"}), 400

    user.set_password(data["new_password"])
    db.session.commit()

    return jsonify({"message": "Password updated"}), 200