from django.db import connection
from rest_framework.response import Response
from django.utils.timezone import now



# ======================================================STUDENT MANAGEMENT===========================================================

# ..................all student........................

def get_all_students():
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM get_students()"
        )
        return cursor.fetchall()

    students = [{
            "roll_no": r[0], 
            "name": r[1], 
            "email": r[2],
            "dob":r[3],
            "gender":r[4],
            "course_id":r[5]
        } 
        for r in rows
        ]

    return students

# ..................create student...................

def create_student(roll_no,name,email,dob,gender,course_id):
    with connection.cursor() as cursor:
        cursor.execute(
            "CALL create_student(%s,%s,%s,%s,%s,%s)",[name,email,roll_no,dob,gender,course_id]
        )

def create_test_student(name,email):
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO test_student(name,email) VALUES (%s,%s)",[name,email]
        )

# ..................update student...................

def update_student(id,roll_no,name,email,dob,gender,course_id):
    with connection.cursor() as cursor:
        cursor.execute(
            "CALL update_student(%s,%s,%s,%s,%s,%s,%s)",[id,name,email,roll_no,dob,gender,course_id]
        )

# .................student detail on email and password....................

def get_student_detail(email):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM get_student_by_email(%s)",[email]
        )
        row =  cursor.fetchone()
        if not row:
            return None
    
    student = [
        {
            "id":row[0],
            "name":row[1],
            "email":row[2],
            "password":row[3],
            "is_active":row[4],
            "count":row[5]
        }]

    return student

# ....................update student password.......................

def update_student_password(email,password):
    with connection.cursor() as cursor:
        cursor.execute(
            "CALL update_password(%s,%s)",[email,password]
        )

# ...................student page.......................

def get_student_page(page_size, offset):
     with connection.cursor() as cursor:
            # total count
        cursor.execute("SELECT COUNT(*) FROM students WHERE is_faculty = 'False'")
        total = cursor.fetchone()[0]

            # paginated data
        cursor.execute(
                "SELECT * FROM students WHERE is_faculty='False' ORDER BY roll_no LIMIT (%s) OFFSET (%s)",[page_size, offset]
            )
            
        
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return ({
            "count": total,
            "page_size": page_size,
            "results": results
        })
     
#....................student detail by id...................

def get_student_by_id(id):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT s.*,c.course_name FROM students s INNER JOIN courses c ON s.course_id=c.id WHERE s.id = (%s); ",[id])
        row = cursor.fetchone()

    student = {
            "id":row[0],
            "name": row[1], 
            "email": row[2],
            "roll_no": row[3], 
            "dob":row[4],
            "gender":row[5],
            "course_id":row[6],
            "profile_image":row[10],
            "is_faculty":row[11],
            "course_name":row[14]
            } 

    return student

#.......................update profile image.......................

def add_profile(id,profile):
    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE students SET profile_image = (%s) WHERE id = (%s)",[profile,id])

    
#..........................search student..............................

def search_student(course_id=None,name=None):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM search_students(%s,%s)",[course_id,name]
        )
        rows = cursor.fetchall()

    students = [{
            "roll_no": r[0], 
            "name": r[1], 
            "email": r[2],
            "dob":r[3],
            "gender":r[4],
            "course_id":r[5]
        } 
        for r in rows
        ]

    return students

#------------by name----------
# def get_search_students(name):
#     with connection.cursor() as cursor:
#         cursor.execute(
#             "SELECT * FROM WHERE name ILIKE (%s) and is_faculty='False'",[f"%{name}%"]
#         )
#         rows = cursor.fetchall()

#     students = [{
#             "roll_no": r[1], 
#             "name": r[2], 
#             "email": r[3],
#             "dob":r[4],
#             "gender":r[5],
#             "course_id":r[6]
#         } 
#         for r in rows
#         ]

#     return students

#-------------by course-id--------------
# def get_search_on_course(id):
#     with connection.cursor() as cursor:
#         cursor.execute(
#             "SELECT * FROM students WHERE course_id = (%s) and is_faculty='False'",[id]
#         )
#         rows = cursor.fetchall()
    
#     students = [{
#             "roll_no": r[1], 
#             "name": r[2], 
#             "email": r[3],
#             "dob":r[4],
#             "gender":r[5],
#             "course_id":r[6]
#         } 
#         for r in rows
#         ]

#     return students

# --------------search student by id and name---------------
# def get_search_students_on_both(id,name):
#     with connection.cursor() as cursor:
#         cursor.execute(
#             "SELECT * FROM students WHERE course_id = (%s) and name ILIKE %s and is_faculty = 'False'",[id,f"%{name}%"]
#         )
#         rows = cursor.fetchall()
    
#     students = [{
#             "roll_no": r[1], 
#             "name": r[2], 
#             "email": r[3],
#             "dob":r[4],
#             "gender":r[5],
#             "course_id":r[6]
#         } 
#         for r in rows
#         ]

#     return students


#.......................................update student count.............................
def update_count(email,count):
    with connection.cursor() as cursor:
        cursor.execute(
            "UPDATE students SET count = (%s) WHERE email = (%s)",
            [count,email]
        ) 

#.........................faculty detail - number of section.....................
def get_all_detail_for_faculty():
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM courses"
        )
        course_row = cursor.fetchone()

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM students WHERE is_faculty = 'false'"
        )
        student_row = cursor.fetchone()

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM assignments"
        )
        assignment_row = cursor.fetchone()

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*) FROM quiz"
        )
        quiz_row = cursor.fetchone()

    return {
        "course_row" : course_row,
         "student_row" : student_row,
         "assignment_row" : assignment_row,
         "quiz_row" : quiz_row
    }

# ===========================================================course management===============================================================

# ........all course...........
def get_all_courses():
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM get_courses()"
        )
        return cursor.fetchall()

    courses = [{
            "id": r[0], 
            "course_name": r[1], 
        } 
        for r in rows
        ]

    return courses

# ................create course.................
def create_course(name):
    with connection.cursor() as cursor:
        cursor.execute(
            "CALL create_course(%s)",[name]
        )

# ................update course...............
def update_course(id,name):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT update_course(%s,%s)",[id,name]
        )
        return True
    
# ...............delete course..............
def delete_course(id):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM delete_course(%s)",[id]
        )
        row = cursor.fetchone()
    
    success, message = row  

    data =  {
        "success": success,
        "message": message
    }

    return data


#============================================================ASSIGNMENT MANAGEMENT==============================================================


# ..................get all assignments ...................
def get_all_assignments(student_id=None):

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT a.id, a.title, a.description, a.due_date, a.course_id, 
            a.student_id, a.file, a.created_at, c.course_name 
            FROM assignments a
            JOIN courses c ON c.id = a.course_id
            ORDER BY a.created_at DESC
            """)
        rows = cursor.fetchall()
    
    assignments = [{
        "id": r[0],
        "title": r[1],
        "description": r[2],
        "due_date": r[3],
        "course_id": r[4],
        "student_id": r[5],
        "file": r[6],
        "created_at": r[7],
        "course_name": r[8],
    } for r in rows]

    return assignments


# ..................... create assignment ...........................
def create_assignment(data, file, student_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT save_assignment(%s,%s,%s,%s,%s,%s,%s)
        """, [
            None,
            data["title"],
            data["description"],
            data["due_date"],
            data["course_id"],
            student_id,
            file
        ])
        cursor.fetchone()[0]
    return True


# ................... update assignment .....................
def update_assignment(assignment_id, data, filename):
    if(filename):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT save_assignment(%s,%s,%s,%s,%s,%s,%s)
            """, [
                assignment_id,
                data["title"],
                data["description"],
                data["due_date"],
                data["course_id"],
                data["student_id"],
                filename
            ])
            row = cursor.fetchone()
    else:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT save_assignment(%s,%s,%s,%s,%s,%s,%s)
            """, [
                assignment_id,
                data["title"],
                data["description"],
                data["due_date"],
                data["course_id"],
                data["student_id"],
                None
            ])
            row = cursor.fetchone() 
    
    return bool(row)  # True if updated, False if not owner


# .................... delete assignment .....................
def delete_assignment(assignment_id, student_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            DELETE FROM assignments
            WHERE id=%s AND student_id=%s
            RETURNING id
        """, [assignment_id, student_id])
        row = cursor.fetchone()

    if row:
        return {"success": True, "message": "Assignment deleted successfully"}
    else:
        return {"success": False, "message": "Not allowed or assignment not found"}
    

# ..........................get student assignment.....................
def get_student_assignment(course_id,student_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT a.id, a.title, a.description, a.due_date, a.file, s.submitted_at
            FROM assignments a LEFT JOIN 
            assignment_submission s ON a.id = s.assignment_id and s.student_id = %s
            WHERE a.course_id = %s 
            ORDER BY due_date ASC
        """, [student_id,course_id])

        columns = [col[0] for col in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return data
    
# =====================================================Forgot Password=================================================================

# ......................validate email..........................
def check_email(email):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT email FROM students WHERE email = (%s) ",[email]
        )
        row = cursor.fetchone()

    if row:
        return True
    else:
        return False
    

#.........................update login time..........................
def update_last_login(student_id):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            UPDATE students
            SET last_login = NOW()
            WHERE id = %s
            """,
            [student_id]
        )


#..........................submit assignment.............................
def upload_Assignment(assignment_id,student_id,file_path):
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO assignment_submission
            (assignment_id, student_id, file, submitted_at)
            VALUES (%s, %s, %s, %s)
        """, [
            assignment_id,
            student_id,
            file_path,
            now()
        ])

#=========================================================QUIZ MANAGEMENT===============================================================================

#....................get quiz page.................
def get_quizzes():
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM quiz  WHERE is_published = 'true' ORDER BY id")
        rows = cursor.fetchall()
    # Convert to dict
    quizzes = []
    for row in rows:
        quizzes.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "total_marks": row[3],
            "time_limit": row[4],
            "created_at": row[5],
            "is_published":row[6]
        })
    return quizzes

def get_faculty_quizzes():
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM quiz ORDER BY id")
        rows = cursor.fetchall()
    # Convert to dict
    quizzes = []
    for row in rows:
        quizzes.append({
            "id": row[0],
            "title": row[1],
            "description": row[2],
            "total_marks": row[3],
            "time_limit": row[4],
            "created_at": row[5],
            "is_published":row[6]
        })
    return quizzes


#.....................save answer.........................
def save_answer(student_id, question_id, selected_option_id):
    # print(question_id)
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO student_answer (student_id, question_id, selected_option_id)
            VALUES (%s, %s, %s)
        """, [student_id, question_id, selected_option_id])


#......................fetch question.....................
def get_quiz_questions(quiz_id):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT q.id, q.text, q.marks, o.id, o.text, o.is_correct
            FROM question q
            LEFT JOIN option o ON q.id = o.question_id
            WHERE q.quiz_id = %s
        """, [quiz_id])
        rows = cursor.fetchall()
    
    questions = {}
    for q_id, q_text, q_marks, o_id, o_text, o_is_correct in rows:
        if q_id not in questions:
            questions[q_id] = {"id": q_id, "text": q_text, "marks": q_marks, "options": []}
        questions[q_id]["options"].append({"id": o_id, "text": o_text, "is_correct":o_is_correct})
    return list(questions.values())

#..................get student score....................
def get_quiz_score(student_id,quiz_id):

    with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COALESCE(SUM(q.marks), 0)
                FROM student_answer sa
                JOIN question q ON sa.question_id = q.id
                JOIN option o ON sa.selected_option_id = o.id
                WHERE sa.student_id = %s
                  AND q.quiz_id = %s
                  AND o.is_correct = TRUE
            """, [student_id, quiz_id])

            score = cursor.fetchone()[0]
            print(score)
    
    with connection.cursor() as cursor:
            cursor.execute(
                """INSERT INTO submitted_quiz (student_id, quiz_id, score)
                VALUES (%s,%s,%s)
                ON CONFLICT (student_id, quiz_id) DO NOTHING;""",[student_id,quiz_id,score]
            )

    return score

#.......................validation for quiz submission....................
def get_submission(student_id, quiz_id):
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT score FROM submitted_quiz WHERE student_id=%s AND quiz_id=%s",
            [student_id, quiz_id]
        )
        result = cursor.fetchone()
        if result:
            return result[0]  
    return None

#.............................create quiz......................................
def create_quiz(title,description,total_marks,time_limit):
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO quiz(title,description,total_marks,time_limit) VALUES (%s,%s,%s,%s)",
            [title,description,total_marks,time_limit]
        )

#................................create question................................
def create_question(quiz_id,text,marks):
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO question(quiz_id,text,marks) VALUES (%s,%s,%s)",
            [quiz_id,text,marks]
        )

#..................................create option............................
def create_option(question_id,text,is_correct):
    with connection.cursor() as cursor:
        cursor.execute(
            "INSERT INTO option(question_id,text,is_correct) VALUES (%s,%s,%s)",
            [question_id,text,is_correct]
        )

#==================================================STUDENT DASHBOARD MANAGEMENT================================================================
def get_student_score(student_id):
    with connection.cursor() as cursor:
        cursor.execute(
            """SELECT sq.student_id, SUM(sq.score), SUM(q.total_marks), COUNT(*)
            FROM submitted_quiz sq
            JOIN quiz q ON q.id = sq.quiz_id
            WHERE sq.student_id = (%s)
            GROUP BY sq.student_id;""",
            [student_id]
        )
        row = cursor.fetchone()
        
    
    if(row):
        marks = [
            {
                "student_id":row[0],
                "obtain_marks":row[1],
                "total_marks":row[2],
                "quiz_count":row[3]
            }
        ]
        return marks
    
    marks = [{
        "student_id":student_id,
        "obtain_marks":0,
        "total_marks":0,
        "quiz_count":0
    }]
    return  marks

#====================================================ATTENDANCE MANAGEMENT===============================================

#..................................add attendance........................................
def add_attendance(student_id, faculty_id, course_id, date,attendance_status):
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO attendance (student_id, faculty_id, course_id, date, status)
            VALUES (%s, %s, %s, %s, %s)
        """, [student_id, faculty_id, course_id, date,attendance_status])