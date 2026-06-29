from flask import Flask
from .config import Config


def create_app():
    flask_app = Flask(
        __name__,
        template_folder="../templates",
        static_folder="../static",
        static_url_path="/static"
    )

    flask_app.config.from_object(Config)

    from .routes.pages import pages_bp
    from .routes.chat import chat_bp
    from .routes.auth import auth_bp

    flask_app.register_blueprint(pages_bp)
    flask_app.register_blueprint(chat_bp)
    flask_app.register_blueprint(auth_bp)

    return flask_app