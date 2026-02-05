import os
import csv
from django.conf import settings

ATTENDANCE_DIR = os.path.join(settings.MEDIA_ROOT, "attendance_data")


def add_attendance_to_csv(student_id, faculty_id, course_id, date_value, status):
    os.makedirs(ATTENDANCE_DIR, exist_ok=True)

    month_name = date_value.strftime("%Y_%m")
    file_path = os.path.join(
        ATTENDANCE_DIR,
        f"attendance_{month_name}.csv"
    )

    date_str = date_value.strftime("%d-%m-%Y")
    student_col = f"{student_id}({course_id})"

    rows = []
    header = ["date"]

    # 1️⃣ Read existing CSV (if exists)
    if os.path.exists(file_path):
        with open(file_path, "r", newline="") as f:
            reader = csv.DictReader(f)
            header = reader.fieldnames
            rows = list(reader)

    # 2️⃣ Add student column if not exists
    if student_col not in header:
        header.insert(-1 if "faculty_id" in header else len(header), student_col)

        for row in rows:
            row[student_col] = ""

    # 3️⃣ Check if date row exists
    date_row = None
    for row in rows:
        if row["date"] == date_str:
            date_row = row
            break

    # 4️⃣ If date row not exists → create it
    if not date_row:
        date_row = {h: "" for h in header}
        date_row["date"] = date_str
        date_row["faculty_id"] = str(faculty_id)
        rows.append(date_row)

    # 5️⃣ Mark attendance
    date_row[student_col] = status

    # Ensure faculty_id column exists
    if "faculty_id" not in header:
        header.append("faculty_id")

    # 6️⃣ Write CSV back
    with open(file_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        writer.writerows(rows)
