import React from "react";
import { useParams } from "react-router-dom";
import { setDiagnosisList, updatePatient, useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Diagnosis, EntryFormValuesOmitUnion, Patient } from "../types";
import Axios from "axios";
import GenderIcon from "../components/GenderIcon";
import EntryDetails from "./EntryDetails";
import { Button, Header, List } from "semantic-ui-react";
import AddEntryModal from "./AddEntryModal";
import { EntryFormValues } from "./AddEntryForm";

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    // build base new entry
    const valuesWithOptionals = values as EntryFormValuesOmitUnion;
    const baseEntryWithoutDiagnosisCodes = {
      type: valuesWithOptionals.type,
      date: valuesWithOptionals.date,
      description: valuesWithOptionals.description,
      specialist: valuesWithOptionals.specialist,
    };

    // add optional diagnosis codes
    let baseEntry;
    if (valuesWithOptionals.diagnosisCodes?.length !== 0) {
      baseEntry = {
        ...baseEntryWithoutDiagnosisCodes,
        diagnosisCodes: valuesWithOptionals.diagnosisCodes,
      };
    } else {
      baseEntry = { ...baseEntryWithoutDiagnosisCodes };
    }

    // add required and optional properties for each type
    let entryToSave;
    switch (valuesWithOptionals.type) {
      case "Hospital":
        if (
          valuesWithOptionals.discharge?.date !== "" &&
          valuesWithOptionals.discharge?.criteria !== ""
        ) {
          entryToSave = {
            ...baseEntry,
            discharge: valuesWithOptionals.discharge,
            type: "Hospital",
          };
        } else {
          entryToSave = { ...baseEntry, type: "Hospital" };
        }
        break;
      case "HealthCheck":
        entryToSave = {
          ...baseEntry,
          healthCheckRating: valuesWithOptionals.healthCheckRating,
          type: "HealthCheck",
        };
        break;
      case "OccupationalHealthcare":
        const entryWithEmployerName = {
          ...baseEntry,
          employerName: valuesWithOptionals.employerName,
        };
        if (
          valuesWithOptionals.sickLeave?.startDate !== "" &&
          valuesWithOptionals.sickLeave?.endDate !== ""
        ) {
          entryToSave = {
            ...entryWithEmployerName,
            sickLeave: valuesWithOptionals.sickLeave,
            type: "OccupationalHealthcare",
          };
        } else {
          entryToSave = {
            ...entryWithEmployerName,
            type: "OccupationalHealthcare",
          };
        }
        break;
      default:
        console.error(`Discriminated union type: ${values.type}`);
    }

    // attempt to save patient
    try {
      const { data: updatedPatient } = await Axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        entryToSave
      );
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

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
      <Header as="h2">
        {patient.name} <GenderIcon gender={patient.gender} />
      </Header>
      <div>SSN: {patient.ssn}</div>
      <div>Occupation: {patient.occupation}</div>
      {patient.entries?.length !== 0 && (
        <>
          <Header as="h3">Entries</Header>
          <List celled>
            {patient.entries?.map((entry) => (
              <List.Item key={entry.id}>
                <EntryDetails entry={entry} />
              </List.Item>
            ))}
          </List>
        </>
      )}
      <AddEntryModal
        modalOpen={modalOpen}
        onClose={closeModal}
        error={error}
        onSubmit={submitNewEntry}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientPage;
