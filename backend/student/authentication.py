from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get("Authorization")

        if not header or not header.startswith("Bearer "):
            return None

        token = header.split(" ")[1]

        try:
            access_token = AccessToken(token)
        except TokenError as e:
            if "expired" in str(e).lower():
                raise AuthenticationFailed("Token has expired")
            raise AuthenticationFailed({"error": "Invalid token"})
        # user is None (no ORM)
        return (None, access_token)



        # header = request.headers.get("Authorization")

        # if not header or not header.startswith("Bearer "):
        #     return None

        # token = header.split(" ")[1]

        # try:
        #     UntypedToken(token)
        # except InvalidToken:
        #     raise AuthenticationFailed("Invalid token")

        # access_token = AccessToken(token)

        # # Return (user, token)
        # # user can be None since you don't use ORM
        # return (None, access_token)
        # ....
        # token = request.COOKIES.get("access_token")

        # if not token:
        #     return None

        # try:
        #     access_token = AccessToken(token)
        # except InvalidToken:
        #     raise AuthenticationFailed("Invalid token")

        # return (None, access_token)



        # print("Cookies received:", request.COOKIES)
        # token = request.COOKIES.get("access_token")

        # if not token:
        #     return None

        # try:
        #     validated_token = AccessToken(token)
        # except Exception:
        #     raise AuthenticationFailed("Invalid or expired token")

        # student_id = validated_token.get("student_id")
        # if not student_id:
        #     raise AuthenticationFailed("Token missing student_id")

        # return (student_id, validated_token)


        # print("Cookies received:", request.COOKIES)

        # token = request.COOKIES.get("access_token")
        # if not token:
        #     return None  # No token → user is anonymous

        # try:
        #     validated_token = AccessToken(token)
        # except InvalidToken:
        #     raise AuthenticationFailed("Invalid or expired token")

        # student_id = validated_token.get("student_id")
        # email = validated_token.get("email")

        # if not student_id or not email:
        #     raise AuthenticationFailed("Token missing required student data")

        # # You can optionally return a dictionary as 'user'
        # user = {"student_id": student_id, "email": email}

        # # DRF will set request.user = user, request.auth = validated_token
        # return (user, validated_token)
