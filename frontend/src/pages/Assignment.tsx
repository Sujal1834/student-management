import React, { useEffect, useState } from "react";
import { Assignment } from "../types/assignment";
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
} from "../services/assignmentService";
import "../styles/Assignment.css"
import AssignmentHeader from "../components/assignment/AssignmentHeader";
import AssignmentTable from "../components/assignment/AssignmentTable";
import AssignmentModal from "../components/assignment/AssignmentModal";
import { error } from "console";

const AssignmentPage = () => {
  const [loading,setLoading] = useState<boolean>(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [showModal, setShowModal] = useState(false);
  // const [loggedInStudentId, setLoggedInStudentId] = useState<number | null>(null);

  // useEffect(() => {
  //   const id = localStorage.getItem("login_id");
  //   if (id) {
  //     setLoggedInStudentId(Number(id));
  //   }
  //   loadAssignments()
  // }, []);

  const loggedInStudentId = Number(localStorage.getItem("login_id"));

  const loadAssignments = async () => {
    try{
      const data = await fetchAssignments();
      // console.log("data : ",data)
      setAssignments(data);

    }
    catch(error : any) {
      // setAssignments([])
      // loadAssignments()
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
      loadAssignments();
  }, []);


  if(!loggedInStudentId) return <h1>login</h1>;
  if(loading) return <div className="home-container-spin"><div className="spin"></div></div>;

  return (
    <>
    <div className="assignment-container">
      <AssignmentHeader
        onCreate={() => {
          setSelected(null);
          setShowModal(true);
        }}
      />

      <AssignmentTable
        assignments={assignments}
        loggedInStudentId={loggedInStudentId}
        onEdit={(assignment) => {
          setSelected(assignment);
          setShowModal(true);
        }}
      />

      {showModal && (
        <AssignmentModal
          assignment={selected}
          onClose={() => setShowModal(false)}
          onSuccess={loadAssignments}
        />
      )}
      </div>
    </>
  );
};

export default AssignmentPage;
