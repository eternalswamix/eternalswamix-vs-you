from flask import Blueprint, request, jsonify, session, current_app
from eternalswamix_app.services.google_auth_service import verify_google_token
from eternalswamix_app.services.supabase_service import save_google_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/api/auth/google")
def google_login():
    data = request.get_json(silent=True) or {}
    credential = data.get("credential")

    try:
        user = verify_google_token(
            token=credential,
            client_id=current_app.config["GOOGLE_CLIENT_ID"]
        )

        if not user.get("google_user_id") or not user.get("email"):
            return jsonify({"error": "Invalid Google user data."}), 400

        session["user"] = user

        save_google_user(user)

        return jsonify({
            "message": "Login successful.",
            "user": user
        })

    except Exception as error:
        return jsonify({
            "error": "Google login failed.",
            "details": str(error)
        }), 401


@auth_bp.get("/api/auth/me")
def current_user():
    user = session.get("user")

    if not user:
        return jsonify({"error": "Not logged in."}), 401

    return jsonify({"user": user})


@auth_bp.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out."})
