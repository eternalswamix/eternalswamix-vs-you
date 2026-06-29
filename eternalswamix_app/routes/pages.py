from flask import Blueprint, Response, current_app, redirect, render_template, send_from_directory, session, url_for

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


@pages_bp.get("/robots.txt")
def robots_txt():
    body = "\n".join([
        "User-agent: *",
        "Allow: /",
        "Disallow: /chat",
        "Sitemap: /sitemap.xml",
        ""
    ])
    return Response(body, mimetype="text/plain")


@pages_bp.get("/sitemap.xml")
def sitemap_xml():
    landing_url = url_for("pages.landing", _external=True)
    body = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{landing_url}</loc>
    <priority>1.0</priority>
  </url>
</urlset>
"""
    return Response(body, mimetype="application/xml")


@pages_bp.get("/favicon.ico")
@pages_bp.get("/favicon.svg")
def favicon():
    return send_from_directory(
        current_app.static_folder,
        "assets/favicon.svg",
        mimetype="image/svg+xml"
    )
