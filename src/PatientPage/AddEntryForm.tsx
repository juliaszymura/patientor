import React from "react";
import { Grid, Button, Form as SemanticUiForm } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import {
  DiagnosisSelection,
  TextField,
  NumberField,
} from "../AddPatientModal/FormField";
import { Entry, EntryType } from "../types";
import { useStateValue } from "../state";

export type EntryFormValues = Omit<Entry, "id">;

interface AddEntryFormProps {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export type EntryTypeOption = {
  value: EntryType;
  label: string;
};

const entryTypeOptions: EntryTypeOption[] = [
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.HealthCheck, label: "HealthCheck" },
  { value: EntryType.OccupationalHealthcare, label: "OccupationalHealthcare" },
];

type SelectEntryTypeFieldProps = {
  name: string;
  label: string;
  options: EntryTypeOption[];
};

const SelectEntryTypeField: React.FC<SelectEntryTypeFieldProps> = ({
  name,
  label,
  options,
}: SelectEntryTypeFieldProps) => (
  <SemanticUiForm.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </SemanticUiForm.Field>
);

export const AddEntryForm: React.FC<AddEntryFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [{ diagnoses }] = useStateValue();

  const hospitalDischarge = () => {
    return (
      <SemanticUiForm.Field>
        <label>Discharge</label>
        <Field
          label="Date"
          placeholder="Discharge date"
          name="discharge.date"
          component={TextField}
        />
        <Field
          label="Criteria"
          placeholder="Criteria"
          name="discharge.criteria"
          component={TextField}
        />
      </SemanticUiForm.Field>
    );
  };

  const healthCheckRating = () => {
    return (
      <Field
        label={"Rating"}
        name={"healthCheckRating"}
        min={0}
        max={4}
        component={NumberField}
      />
    );
  };

  return (
    <Formik
      initialValues={{
        type: EntryType.OccupationalHealthcare,
        date: "1111-11-11",
        description: "fdsgfghj",
        specialist: "dsjhgk",
        diagnosisCodes: [],
        discharge: {
          date: "",
          criteria: "",
        },
        healthCheckRating: 2,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.healthCheckRating) {
          errors.healthCheckRating = requiredError;
        }
        if (values.healthCheckRating < 0 || values.healthCheckRating > 3) {
          errors.healthCheckRating = "Value must be between 1-4";
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <SelectEntryTypeField
              label="Entry type"
              name="type"
              options={entryTypeOptions}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {values.type === EntryType.Hospital && hospitalDischarge()}
            {values.type === EntryType.HealthCheck && healthCheckRating()}
            {console.log(values)}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={
                    // !dirty ||
                    !isValid
                  }
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
