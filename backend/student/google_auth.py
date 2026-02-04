# google_auth.py
from google.oauth2 import id_token
from google.auth.transport import requests

def verify_google_token(token):
    try:
        return id_token.verify_oauth2_token(
            token,
            requests.Request(),
            "1030804377014-8crcqp56eok2ugf7nqcts6ef6ttala9u.apps.googleusercontent.com"
        )
    except Exception:
        return None
