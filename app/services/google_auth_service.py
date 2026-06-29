from google.oauth2 import id_token
from google.auth.transport import requests


def verify_google_token(token, client_id):
    if not token:
        raise ValueError("Google credential token is missing.")

    if not client_id:
        raise ValueError("GOOGLE_CLIENT_ID is missing in .env.")

    payload = id_token.verify_oauth2_token(
        token,
        requests.Request(),
        client_id
    )

    return {
        "google_user_id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "avatar_url": payload.get("picture")
    }