from rest_framework import serializers

class StudentSerializer(serializers.Serializer):
    roll_no = serializers.CharField(max_length=20)
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    dob = serializers.DateField()
    gender = serializers.CharField(max_length=10)
    course_id = serializers.IntegerField()

class CourseSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)

class LoginSerializer(serializers.Serializer):
    # id = serializers.IntegerField()
    # name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField()

class AssignmentSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    due_date = serializers.DateField(required=False)
    course_id = serializers.IntegerField()
    student_id = serializers.IntegerField()
    # file = serializers.CharField(required=False, allow_blank=True)

class QuizSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField()
    total_marks = serializers.IntegerField()
    time_limit = serializers.IntegerField()
    
class QuestionSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    text = serializers.CharField()
    marks = serializers.IntegerField()

class OptionSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    text = serializers.CharField()
    is_correct = serializers.BooleanField()