import React from "react";
import { useParams } from "react-router-dom";
import { setDiagnosisList, updatePatient, useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Diagnosis, Patient } from "../types";
import Axios from "axios";
import GenderIcon from "../components/GenderIcon";

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const patient = patients[id];

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await Axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(patient));
      } catch (e) {
        console.error(e);
      }
    };
    // no ssn indicates that only basic info is available in store
    if (!patient || !patient.ssn) fetchPatient();
  }, [dispatch, id, patient]);

  React.useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const { data: diagnoses } = await Axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosisList(diagnoses));
      } catch (e) {
        console.error(e);
      }
    };
    if (Object.keys(diagnoses).length === 0) fetchDiagnoses();
  }, [dispatch, diagnoses]);

  if (!patient || Object.keys(diagnoses).length === 0) {
    return null;
  }

  return (
    <div className="App">
      <h2>
        {patient.name} <GenderIcon gender={patient.gender} />
      </h2>
      <div>SSN: {patient.ssn}</div>
      <div>Occupation: {patient.occupation}</div>
      <h4>Entries</h4>
      {patient.entries?.map((entry) => (
        <div key={entry.id}>
          <div>
            {entry.date} {entry.description}
          </div>
          <ul>
            {entry.diagnosisCodes?.map((code, i) => (
              <li key={i}>
                {code}: {diagnoses[code].name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
