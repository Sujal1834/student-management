const BASE_URL = "http://127.0.0.1:8000/course";

export const createCourse = async (data: { name: string }) => {

    const response = await fetch(`${BASE_URL}/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const dataval = await response.json();
    if (!response.ok) {
        throw new Error(dataval.error || "Something went wrong");
      }

    alert(dataval.message);
    // return dataval;
}

export const updateCourse = async (id : number,data: { name: string }) => {

    const response = await fetch(`${BASE_URL}/update/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const dataval = await response.json();
    if (!response.ok) {
        throw new Error(dataval.error || "Something went wrong");
      }

    // alert(dataval.message);
    // <Toast type={toast.type as any} message={toast.message} onClose={() => setToast(null)} />
    return dataval;
}

export const deleteCourse = async (id : number) => {

    const response = await fetch(`${BASE_URL}/delete/${id}/`, {
        method: "DELETE"
    });

    const dataval = await response.json();
    if (!response.ok) {
        // alert(dataval.error)
        return dataval;
    }
    else
    {
        // alert(dataval.message);
        return dataval;
    }
}
