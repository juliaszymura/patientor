import React from "react";
import { useParams } from "react-router-dom";
import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";
import Axios from "axios";
import GenderIcon from "../components/GenderIcon";

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  const patient = patients[id];

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await Axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch({ type: "UPDATE_PATIENT", payload: patient });
      } catch (e) {
        console.error(e);
      }
    };
    // no ssn indicates that only basic info is available in store
    if (!patient || !patient.ssn) fetchPatient();
  }, [dispatch, id, patient]);

  if (!patient) {
    return null;
  }

  return (
    <div className="App">
      <h2>
        {patient.name} <GenderIcon gender={patient.gender} />
      </h2>
      <div>SSN: {patient.ssn}</div>
      <div>Occupation: {patient.occupation}</div>
    </div>
  );
};

export default PatientPage;
