from rest_framework.views import APIView
from django.db import IntegrityError,connection
from rest_framework.response import Response
from student import serializers,db_utils
from rest_framework import status
from .authentication import CookieJWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import make_password, check_password
import os;
from django.conf import settings
from django.utils import timezone
from .google_auth import verify_google_token
# for mail
from django.core.mail import send_mail
import uuid;
from django.core.cache import cache;

# Create your views here.

# @api_view(['GET'])
# def get_all(request):
#     students = get_all_students(request)
#     return Response(students)

class AllFacultyListAPIView(APIView):
    def get(self,request):
        data = db_utils.get_all_detail_for_faculty()
        return Response(data)
    
#============================================STUDENT MANAGEMENT======================================================

#........................get student.....................................
class StudentListAPIView(APIView):
    def get(self, request):
        students = db_utils.get_all_students()
        return Response(students)
    
#................create update student........................................
class StudentCreateAPIView(APIView):

    def post(self, request):
        serializer = serializers.StudentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:

            db_utils.create_student(data["roll_no"],data["name"],data["email"],data["dob"],data["gender"],data["course_id"])

        except IntegrityError as e:
            # Check if the error is for duplicate roll_no
            if "roll_no" in str(e):
                return Response(
                    {"error": "Roll number already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {"error": "Database error: " + str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            {"message": "Student created successfully"},
            status=status.HTTP_201_CREATED
        )
    

    def put(self, request, id):
        serializer = serializers.StudentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            db_utils.update_student(id,data["roll_no"],data["name"],data["email"],data["dob"],data["gender"],data["course_id"])
        except IntegrityError as e:
            # Check if the error is for duplicate roll_no
            if "roll_no" in str(e):
                return Response(
                    {"error": "Roll number already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {"error": "Database error: " + str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )


        return Response(
            {"message": "Student Updated successfully"},
            status=status.HTTP_201_CREATED
        )

#...................search student...........................

class SearchStudentListAPIView(APIView):

    def get(self,request):
        id = request.GET.get("course_id")
        name = request.GET.get("name")
        
        if(id):
            students = db_utils.search_student(id,None)
        
        if(name):
            students = db_utils.search_student(None,name)

        if(id and name):
            students = db_utils.search_student(id,name)

        return Response(students, status=status.HTTP_200_OK)
    

#...........................student profile..........................
class StudentProfileAPIView(APIView):
    # authentication_classes = [StudentJWTAuthentication]
    authentication_classes = [CookieJWTAuthentication]
    def get(self,request):
        token = request.auth
        if not token:
            return Response({"error": "Unauthenticated"}, status=401)

        student_id = token.get("student_id")
        student = db_utils.get_student_by_id(student_id)
        print("id : ",student["profile_image"])
        return Response({
            "student_id": student["id"],
            "roll_no": student["roll_no"],
            "email":student["email"],
            "name": student["name"],
            "profile_image":student["profile_image"],
            "is_faculty":student["is_faculty"],
            "course_id":student["course_id"],
            "course_name":student["course_name"],
        })


#...................student pagination.........................
class StudentListPageAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    def get(self, request):
        token = request.auth
        if not token:
            return Response({"error": "Unauthenticated"}, status=401)
        
        else:
            page = int(request.GET.get("page", 1))
            page_size = 2
            offset = (page - 1) * page_size

            data = db_utils.get_student_page(page_size,offset)
            
            return Response({
                "count": data["count"],
                "page": page,
                "page_size": data["page_size"],
                "results": data["results"]
            })
        
#.....................profile picture update........................
class ProfilePictureUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):
        user_id = request.data.get("id")
        file = request.FILES.get("profile")

        if not user_id:
            return Response({"error": "User ID missing"}, status=400)

        if not file:
            return Response({"error": "No file uploaded"}, status=400)

        upload_folder = os.path.join(settings.MEDIA_ROOT, "profile")
        os.makedirs(upload_folder, exist_ok=True)

        filename = f"user_{user_id}_{file.name}"
        file_path = os.path.join(upload_folder, filename)
        db_utils.add_profile(user_id,filename)

        with open(file_path, "wb+") as f:
            for chunk in file.chunks():
                f.write(chunk)

        return Response({"success": "Profile Image Updated Successfully","profile_image": filename})
    

#...............student assignment.............................
class StudentAssignmentList(APIView):

    def get(self, request,id):
        student_id = request.query_params.get("student_id")
        print(student_id)
        course_id = id
        data = db_utils.get_student_assignment(course_id,student_id)
        return Response(data)

#.......................update active status...................
class UpdateStudentStatusAPIView(APIView):
     def patch(self, request, student_id):
        with connection.cursor() as cursor:
            # 1️⃣ Get current status
            cursor.execute("SELECT is_active FROM students WHERE id = %s", [student_id])
            row = cursor.fetchone()

            if not row:
                return Response(
                    {"error": "Student not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            current_status = row[0]

            # 2️⃣ Toggle status
            new_status = not current_status
            cursor.execute(
                "UPDATE students SET is_active = %s WHERE id = %s",
                [new_status, student_id]
            )

        # 3️⃣ Return response
        return Response(
            {
                "student_id": student_id,
                "is_active": new_status,
                "message": "Student status updated successfully"
            },
            status=status.HTTP_200_OK
        )
     
#...................student false password count..............................
class UpdateStudentCountAPIView(APIView):
    def patch(self,request,student_id):
        with connection.cursor() as cursor:
            cursor.execute("UPDATE students SET count = 0 WHERE id = %s", [student_id])
        
        return Response({
            "message":"Unblock successfully"
        })
        
#========================================STUDENT PROFILE====================================

#.........................get total score........................................
class GetStudentQuizScoreAPIView(APIView):
    def get(self,request,student_id):
        marks = db_utils.get_student_score(student_id)
        return Response(marks)

#========================================COURSE MANAGEMENT===================================

#................get course..........................
class CourseListAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    def get(self, request):
        courses = db_utils.get_all_courses()
        return Response(courses)
    
#.....................create update delete course....................
class CourseCreateAPIView(APIView):

    def post(self, request):
        serializer = serializers.CourseSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            db_utils.create_course(data["name"])
        except IntegrityError as e:
            if "course_name" in str(e):
                return Response(
                    {"error": "Course Name already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {"error": "Database error: " + str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )


        return Response(
            {"message": "course created successfully"},
            status=status.HTTP_201_CREATED
        )
    
    def put(self, request, id):
        serializer = serializers.CourseSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            db_utils.update_course(id,data["name"])
        except IntegrityError as e:
            if "course_name" in str(e):
                return Response(
                    {"error": "Course Name already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {"error": "Database error: " + str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )


        return Response(
            {"message": "course Updated successfully"},
            status=status.HTTP_201_CREATED
        )
    
    def delete(self, request, id):
        data = db_utils.delete_course(id)
        success = data["success"]
        message = data["message"]

        if not success:
            return Response({"error": message}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": message})
    

#==============================================================LOGIN MANAGEMENT===========================================================

#......................manage login............................       
class LoginStudentAPIView(APIView):
    def post(self,request):
        serializer = serializers.LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        
        student = db_utils.get_student_detail(data["email"])
        if not student: 
            return Response({"error": "Enter Registered Email"}, status=status.HTTP_400_BAD_REQUEST)
        
        # is_active = student[0]['is_active']
        # if not is_active:
        #     return Response({"error": "Your account is disabled. Contact faculty."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(student, status=status.HTTP_200_OK)
    

    def put(self,request):
        serializer = serializers.LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        hash_password = make_password(data["password"])
        try:
            db_utils.update_student_password(data["email"],hash_password)
        except:
            return Response( {"error": "password not update"},status=status.HTTP_400_BAD_REQUEST)
        
        return Response( {"message": "password Updated successfully"},status=status.HTTP_201_CREATED)
    
#.............................token genrate..........................
class GenrateTokenAPIView(APIView):
    def post(self,request):
        serializer = serializers.LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        password = data["password"]

        student = db_utils.get_student_detail(data["email"])

        email = student[0]["email"]
        count = student[0]['count']
        if count == 3:
            return Response({"error": "Your account is block. Contact faculty."}, status=status.HTTP_403_FORBIDDEN)

        is_active = student[0]['is_active']
        if not is_active:
            return Response({"error": "Your account is disabled. Contact faculty."}, status=status.HTTP_403_FORBIDDEN)

        unhashed_password = check_password(password, student[0]['password'])
        if not unhashed_password:
            count = count + 1
            db_utils.update_count(email,count)
            return Response({"error": "Invlid Password"}, status=status.HTTP_403_FORBIDDEN)
            
        id = student[0]['id']
        # email = student[0]['email']
        name = student[0]['name']
        refresh = RefreshToken()

            # Add custom data to token
        refresh["user_id"] = id
        refresh["student_id"] = id
        refresh["email"] = email
        refresh["name"] = name

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        db_utils.update_count(email,0)
        response = Response({
            "message": "Login successful",
            "access_token":access_token,
            "refresh_token":refresh_token,
            "login_id":id,
            "email":email,
            "google_image":None
        })
            
        db_utils.update_last_login(id)

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            samesite="Lax",
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite="Lax",
        )

        return response
    
#..............................refresh token...........................
class RefreshTokenAPIView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)

            new_access_token = str(refresh.access_token)

            return Response({
                "access_token": new_access_token
            })

        except (TokenError, InvalidToken):
            return Response(
                {"detail": "Invalid or expired refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
 

#...........................gmail login............................
class GoogleLoginAPIView(APIView):

    def post(self, request):
        token = request.data["token"]
        # print(token)
        if not token:
            return Response(
                {"error": "Token required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_info = verify_google_token(token)
        if not user_info:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        email = user_info["email"]
        name = user_info["name"]
        picture = user_info["picture"]
        # print(user_info)
    
        student = db_utils.get_student_detail(email)
        if not student:
            try:
                db_utils.create_test_student(name,email)
            except:
                return Response(
                    {"error": "This email is not registered. Please use your registered account."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(
                    {"error": "This email is not registered. Please use your registered account."},
                    status=status.HTTP_400_BAD_REQUEST
                )    
        else:
            id = student[0]["id"]
            email = student[0]["email"]
            name = student[0]["name"]

            refresh = RefreshToken()

                # Add custom data to token
            refresh["user_id"] = id
            refresh["student_id"] = id
            refresh["email"] = email
            refresh["name"] = name

            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            db_utils.update_count(email,0)
            response = Response({
                "message": "Login successful",
                "access_token":access_token,
                "refresh_token":refresh_token,
                "login_id":id,
                "email":email,
                "google_image":picture
            })
                
            db_utils.update_last_login(id)

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                samesite="Lax",
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                samesite="Lax",
            )

            return response
    
#===========================================================ASSIGNMENT MANAGEMENT================================================
    
#................get create update delete..........................
class AssignmentCreateAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    # authentication_classes = [CookieJWTAuthentication]
    def get(self, request,id=None):
        # student_id = request.user.id
        # print("request : ",request)
        assignments = db_utils.get_all_assignments()
        return Response(assignments, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = serializers.AssignmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data

        file = request.FILES.get("file")
        student_id = data["student_id"]

        if not file:
            return Response({"error": "No file uploaded"}, status=400)
        
        upload_folder = os.path.join(settings.MEDIA_ROOT, "assignment")
        os.makedirs(upload_folder, exist_ok=True)

        filename = f"user_{student_id}_{file.name}"
        file_path = os.path.join(upload_folder, filename)

        with open(file_path, "wb+") as f:
            for chunk in file.chunks():
                f.write(chunk)

        try:
            assignment_id = db_utils.create_assignment(data, filename, student_id)
        except IntegrityError as e:
            return Response(
                {"error": "Database error: " + str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": "Assignment created successfully", "id": assignment_id},
            status=status.HTTP_201_CREATED
        )

    def put(self, request, id):
        serializer = serializers.AssignmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data

        file = request.FILES.get("file")
        student_id = data["student_id"]

        # if not file:
        #     return Response({"error": "No file uploaded"}, status=400)
        
        if file:
            upload_folder = os.path.join(settings.MEDIA_ROOT, "assignment")
            os.makedirs(upload_folder, exist_ok=True)

            filename = f"user_{student_id}_{file.name}"
            file_path = os.path.join(upload_folder, filename)

            with open(file_path, "wb+") as f:
                for chunk in file.chunks():
                    f.write(chunk)

            updated = db_utils.update_assignment(id, data, filename)

        else:
            updated = db_utils.update_assignment(id, data, filename=None)
        if not updated:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        return Response({"message": "Assignment updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request, id):
        result = db_utils.delete_assignment(id, request.user.id)
        if not result["success"]:
            return Response({"error": result["message"]}, status=status.HTTP_403_FORBIDDEN)

        return Response({"message": result["message"]}, status=status.HTTP_200_OK)
    

#=======================================================password management============================================================================

#........................forgot password..........................
class ForgotPasswordAPIView(APIView):
    def post(self,request):
        email = request.data['email']
        print(email)
        is_email = db_utils.check_email(email)


        if not is_email:
            return Response({"error":"Invalid Email"},status=status.HTTP_400_BAD_REQUEST)
        
        token = str(uuid.uuid4())

        cache.set(token, email, timeout=600)

        reset_link = f"http://localhost:3000/reset-password/{token}"

        send_mail(
            subject="Reset Your Password",
            message=f"Click the link to reset your password:\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {"message": "Password reset link sent"},
            status=status.HTTP_200_OK
        )

#.....................reset password........................
class ResetPasswordAPIView(APIView):
    def post(self,request):
        token = request.data['token']
        password = request.data['password']

        # print("token : ",token)
        # print("password : ",password)
        email=cache.get(token)
        # print("email : ",email)
        if not email:
            return Response({"error":"Invalid Or Expired Link"},status=status.HTTP_400_BAD_REQUEST)
        
        hash_password = make_password(password)
        try:
            db_utils.update_student_password(email,hash_password)
        except:
            return Response( {"error": "password not update"},status=status.HTTP_400_BAD_REQUEST)
        
        cache.clear()
        return Response( {"message": "password Updated successfully"},status=status.HTTP_201_CREATED)
    
#.............................reset password token validation..........................
class ValidatePasswordTokenAPIView(APIView):
    def post(self,request):
        token = request.data.get("token")
        if cache.get(token):
            return Response({"valid": True}, status=200)
        return Response({"error": "Invalid or expired token"}, status=400)

#.......................assignment submission.....................
class AssignmentSubmitAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self,request):
        assignment_id = request.data.get("assignment_id")
        student_id = request.data.get("student_id")
        file = request.FILES.get("file")

        if not assignment_id or not student_id or not file:
            return Response({"error": "All fields required"}, status=400)

        upload_folder = os.path.join(settings.MEDIA_ROOT, "student_assignment")
        os.makedirs(upload_folder, exist_ok=True)

        filename = f"student_{student_id}_{file.name}"
        file_path = os.path.join(upload_folder, filename)

        with open(file_path, "wb+") as f:
            for chunk in file.chunks():
                f.write(chunk)

        print(filename)
        # upload_Assignment(assignment_id,student_id,filename)
        
        try:
            db_utils.upload_Assignment(assignment_id,student_id,filename)
        except:
            return Response( {"error": "assignment not submited"},status=status.HTTP_400_BAD_REQUEST)
        

        return Response(
            {"message": "Assignment submitted successfully"},
            status=201
        )

#=========================================================QUIZ MANAGEMENT====================================================================
#................................all quiz list................................
class QuizListAPIView(APIView):
    def get(self, request):
        quizzes = db_utils.get_quizzes()
        return Response(quizzes)
    
class FacultyQuizListAPIView(APIView):
    def get(self,request):
        quizzes = db_utils.get_faculty_quizzes()
        return Response(quizzes)

#...........................question list on quiz................................
class QuizQuestionsAPIView(APIView):
    def get(self, request, quiz_id):
        student_id = request.query_params.get("student_id")
        score = db_utils.get_submission(student_id, quiz_id)
        if score is not None:
            return Response({
                "submitted": True,
                "score": score,
                "quiz_id": quiz_id
            })
        
        questions = db_utils.get_quiz_questions(quiz_id)
        return Response({
                "submitted": False,
                "score": None,
                "questions": questions
            })

#....................................submit student answer.........................................
class SubmitAnswerAPIView(APIView):
    def post(self, request):
        student_id = request.data['student_id']
        # quiz_id = request.data['quiz_id']
        question_id = request.data['question']
        selected_option_id = request.data['selected_option']
        # print(quiz_id)
        db_utils.save_answer(student_id, question_id, selected_option_id)
        return Response({"status": "success"})

#..........................quiz score............................ 
class QuizScoreAPIView(APIView):
    def get(self, request, quiz_id):
        student_id = request.query_params.get("student_id")
        
        score = db_utils.get_quiz_score(student_id,quiz_id)

        return Response({
            "quiz_id": quiz_id,
            "student_id": student_id,
            "score": score
        })

#....................................create quiz........................................    
class QuizManageAPIView(APIView):
    def post(self,request):
        serializer = serializers.QuizSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        # print("data : ",data['title'])
        try:
            db_utils.create_quiz(data['title'],data['description'],data['total_marks'],data['time_limit'])
        except:
            return Response( {"error": "Quiz not created"},status=status.HTTP_400_BAD_REQUEST)
        

        return Response(
            {"message": "quiz created successfully"},
            status=201
        )

        # print("data :",data)

#.....................................update quiz status - publish or unpublished.........................................
class UpdateQuizStatusAPIView(APIView):
     def patch(self, request, quiz_id):
        with connection.cursor() as cursor:
            # 1️⃣ Get current status
            cursor.execute("SELECT is_published FROM quiz WHERE id = %s", [quiz_id])
            row = cursor.fetchone()

            if not row:
                return Response(
                    {"error": "quiz not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            current_status = row[0]

            # 2️⃣ Toggle status
            new_status = not current_status
            cursor.execute(
                "UPDATE quiz SET is_published = %s WHERE id = %s",
                [new_status, quiz_id]
            )

        # 3️⃣ Return response
        return Response(
            {
                "quiz_id": quiz_id,
                "is_published": new_status,
                "message": "quiz status updated successfully"
            },
            status=status.HTTP_200_OK
        )
     
#....................................create question...........................................
class QuizQuestionsManageAPIView(APIView):
    def get(self, request, quiz_id):
        questions = db_utils.get_quiz_questions(quiz_id)
        return Response(questions)

    def post(self,request):
        serializer = serializers.QuestionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            db_utils.create_question(data['quiz_id'],data['text'],data['marks'])
        except:
            return Response( {"error": "Question not created"},status=status.HTTP_400_BAD_REQUEST)
        

        return Response(
            {"message": "question created successfully"},
            status=201
        )
    
#.......................................create option..................................
class QuizOptionManageAPIView(APIView):
    def post(self,request):
        # print("raw : ",request.data)
        serializer = serializers.OptionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        # data = request.data
        try:
            db_utils.create_option(data['question_id'],data['text'],data['is_correct'])
        except:
            return Response( {"error": "option not created"},status=status.HTTP_400_BAD_REQUEST)
        

        return Response(
            {"message": "option created successfully"},
            status=201
        )
    

#=================================================ATTENDANCE MANAGEMENT==================================================================

#......................................add attendance by faculty............................................
class TodayAttendance(APIView):

    def post(self, request):
        print(request.data)
        student_id = request.data["student_id"]
        faculty_id = request.data["faculty_id"]
        course_id = request.data["course_id"]
        attendance_status = request.data["status"]  # 'P' or 'A'
        date = timezone.now().date()

        try:
            db_utils.add_attendance(student_id, faculty_id, course_id, date, attendance_status)
        except:
            return Response( {"error": "Already submitted Today's attendance"},status=status.HTTP_400_BAD_REQUEST)


        return Response({"message": "Attendance marked"})

class StudentAttendanceAPIView(APIView):
    def get(self,request):
        student_id = request.query_params.get("student_id")
        month = request.query_params.get("month")
        year = request.query_params.get("year")

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    c.course_name,
                    COUNT(*) AS total,
                    SUM(CASE WHEN a.status = 'P' THEN 1 ELSE 0 END) AS present,
                    SUM(CASE WHEN a.status = 'A' THEN 1 ELSE 0 END) AS absent
                FROM attendance a
                JOIN courses c ON c.id = a.course_id
                WHERE a.student_id = %s
                AND (%s IS NULL OR EXTRACT(MONTH FROM a.date) = %s)
                AND (%s IS NULL OR EXTRACT(YEAR FROM a.date) = %s)
                GROUP BY c.course_name
                ORDER BY c.course_name
            """, [student_id, month, month, year, year])

            rows = cursor.fetchall()

        data = []
        for r in rows:
            percentage = round((r[2] * 100) / r[1], 2) if r[1] > 0 else 0
            data.append({
                "course_name": r[0],
                "total": r[1],
                "present": r[2],
                "absent": r[3],
                "percentage": percentage
            })

        return Response(data)
    
class StudentFullAttendanceAPIView(APIView):
    def get(self,request):

        student_id = request.query_params.get("student_id")

        # Optional: academic year (example: 2025)
        year = request.query_params.get("year")

        query = """
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'P' THEN 1 ELSE 0 END) AS present
            FROM attendance
            WHERE student_id = %s
        """
        params = [student_id]

        if year:
            query += " AND EXTRACT(YEAR FROM date) = %s"
            params.append(year)

        with connection.cursor() as cursor:
            cursor.execute(query, params)
            row = cursor.fetchone()

        total = row[0] or 0
        present = row[1] or 0

        percentage = round((present * 100) / total, 2) if total > 0 else 0

        return Response({
            "year": year,
            "total_lectures": total,
            "present": present,
            "percentage": percentage
        })
