export const validateStudentForm = (formData: any) => {
  if (!formData.roll_no.trim())
    return "Student roll number is required";

  if (!/^\d+$/.test(formData.roll_no))
    return "Roll number must contain only numbers";

  if (!formData.name.trim())
    return "Student name is required";

  if (!formData.email.trim())
    return "Student email is required";

  if (!formData.dob)
    return "Date of birth is required";

  const selectedDate = new Date(formData.dob);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today)
    return "Date of birth cannot be in the future";

  if (!formData.gender)
    return "Gender is required";

  if (formData.course_id === "")
    return "Course is required";

  return "";
};

export const validateLoginForm = (formData : any) =>
{
  if (!formData.email.trim())
    return "email is required";

  if (!formData.password.trim())
    return "password is required";

  // if (!formData.trim())
  //   return "New password is required";

  // if (!password2.trim())
  //   return "Reenter Password is required";

  return;
};