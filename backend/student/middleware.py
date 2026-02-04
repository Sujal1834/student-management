from datetime import time
# from rest_framework import status
# from rest_framework.response import Response
from django.http import JsonResponse
from django.utils import timezone

class QuizTimeRestrictionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/quizzes/"):
            now = timezone.localtime().time()
            # print(now)
            if now > time(17,0):
                return JsonResponse(
                    {"error": "quiz access closed after 5 pm"},
                    status=401
                )

        return self.get_response(request)
