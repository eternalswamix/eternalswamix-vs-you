from flask import Blueprint, request, jsonify, current_app
from app.services.gemini_service import generate_clone_reply

chat_bp = Blueprint("chat", __name__)


@chat_bp.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}

    api_key = (data.get("api_key") or "").strip()
    message = (data.get("message") or "").strip()
    history = data.get("history") or []

    if not api_key:
        return jsonify({"error": "Gemini API key is required."}), 400

    if not message:
        return jsonify({"error": "Message is required."}), 400

    if len(message) > 4000:
        return jsonify({"error": "Message is too long."}), 400

    try:
        reply = generate_clone_reply(
            api_key=api_key,
            message=message,
            history=history,
            model=current_app.config["GEMINI_MODEL"]
        )

        return jsonify({"reply": reply})

    except Exception as error:
        return jsonify({
            "error": "Gemini request failed.",
            "details": str(error)
        }), 500