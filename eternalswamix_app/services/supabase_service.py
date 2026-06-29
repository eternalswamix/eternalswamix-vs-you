from datetime import datetime, timezone
from supabase import create_client
from flask import current_app


def get_supabase_client():
    url = current_app.config["SUPABASE_URL"]
    key = current_app.config["SUPABASE_SERVICE_ROLE_KEY"]

    if not url or not key:
        raise ValueError("Supabase URL or Service Role Key is missing.")

    return create_client(url, key)


def save_universal_data(
    google_user_id,
    email,
    name,
    avatar_url,
    data_type,
    data_key,
    data
):
    supabase = get_supabase_client()

    row = {
        "google_user_id": google_user_id,
        "email": email,
        "name": name,
        "avatar_url": avatar_url,
        "project_name": current_app.config["PROJECT_NAME"],
        "data_type": data_type,
        "data_key": data_key,
        "data": data,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }

    result = (
        supabase
        .table("universal_user_data")
        .upsert(
            row,
            on_conflict="google_user_id,project_name,data_type,data_key"
        )
        .execute()
    )

    return result


def save_google_user(user):
    return save_universal_data(
        google_user_id=user["google_user_id"],
        email=user["email"],
        name=user.get("name"),
        avatar_url=user.get("avatar_url"),
        data_type="profile",
        data_key="google_profile",
        data={
            "provider": "google",
            "google_user_id": user["google_user_id"],
            "email": user["email"],
            "name": user.get("name"),
            "avatar_url": user.get("avatar_url")
        }
    )