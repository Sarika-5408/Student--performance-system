from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db

from routes.auth import auth_bp
from routes.students import students_bp
from routes.marks import marks_bp
from routes.attendance import attendance_bp
from routes.recommendations import recommendations_bp
from routes.reports import reports_bp
from routes.dashboard import dashboard_bp
from sample_data import seed_database
from models.models import User


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # JWT
    jwt = JWTManager(app)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print("INVALID TOKEN:", error)
        return {"error": error}, 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print("MISSING TOKEN:", error)
        return {"error": error}, 401

    # Database
    db.init_app(app)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(marks_bp, url_prefix="/api/marks")
    app.register_blueprint(attendance_bp, url_prefix="/api/attendance")
    app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    @app.route("/")
    def home():
        return "Student Performance System API Running"

    with app.app_context():
        db.create_all()
        seed_database(db)
        # Create default admin user if it doesn't exist
        admin = User.query.filter_by(username="admin").first()

        if not admin:
            admin = User(username="admin",role="admin")
            admin.set_password("Admin@123")
            db.session.add(admin)
            db.session.commit()
            print("✅ Default admin user created")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)