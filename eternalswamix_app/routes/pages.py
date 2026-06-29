from flask import Blueprint, render_template, current_app, session, redirect

pages_bp = Blueprint("pages", __name__)


@pages_bp.get("/")
def landing():
    if session.get("user"):
        return redirect("/chat")

    return render_template(
        "landing.html",
        google_client_id=current_app.config["GOOGLE_CLIENT_ID"],
        google_authorized_origins=current_app.config["GOOGLE_AUTHORIZED_ORIGINS"]
    )


@pages_bp.get("/chat")
def chat_page():
    if not session.get("user"):
        return redirect("/")

    return render_template("chat.html")
