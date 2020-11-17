import React from "react";
import { List, StrictIconProps } from "semantic-ui-react";
import { useStateValue } from "../state";
import {
  Entry,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HealthCheckRating,
  EntryType,
} from "../types";

interface EntryDetailsProps {
  entry: Entry;
}

interface HospitalEntryDetailsProps {
  entry: HospitalEntry;
  typeIcon?: "hospital";
}

interface HealthCheckEntryDetailsProps {
  entry: HealthCheckEntry;
  typeIcon?: "stethoscope";
}

interface OccupationalHealthcareEntryDetailsProps {
  entry: OccupationalHealthcareEntry;
  typeIcon?: "medkit";
}

type EntryDetailsWithIconsProps =
  | HospitalEntryDetailsProps
  | HealthCheckEntryDetailsProps
  | OccupationalHealthcareEntryDetailsProps;

const assertUnreachable = (value: never): never => {
  throw new Error(`Discriminated union member: ${JSON.stringify(value)}`);
};

const EntryHeader: React.FC<EntryDetailsWithIconsProps> = ({
  entry,
  typeIcon,
}: EntryDetailsWithIconsProps) => {
  return (
    <List size="huge">
      <List.Item>
        <List.Icon name={typeIcon} />
        <List.Content>{entry.date}</List.Content>
      </List.Item>
      {entry.type === EntryType.OccupationalHealthcare && (
        <List.Item>
          <List.Icon name="building" />
          <List.Content> {entry.employerName}</List.Content>
        </List.Item>
      )}
    </List>
  );
};

const EntryCommon: React.FC<EntryDetailsProps> = ({
  entry,
}: EntryDetailsProps) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <>
      <List.Item>
        <List.Icon name="user md" />
        <List.Content> {entry.specialist}</List.Content>
      </List.Item>
      <List.Item>
        <List.Icon name="clipboard" />
        <List.Content> {entry.description}</List.Content>
      </List.Item>
      {entry.diagnosisCodes && (
        <List.Item>
          <List.List>
            {entry.diagnosisCodes?.map((code, i) => (
              <List.Item key={i}>
                <List.Icon name="file" />
                <List.Content>
                  {code}: {diagnoses[code].name}
                </List.Content>
              </List.Item>
            ))}
          </List.List>
        </List.Item>
      )}
    </>
  );
};

const HospitalEntryDetails: React.FC<HospitalEntryDetailsProps> = ({
  entry,
}: HospitalEntryDetailsProps) => {
  return (
    <div>
      <EntryHeader {...{ entry, typeIcon: "hospital" }} />
      <List>
        <EntryCommon entry={entry} />
        {entry.discharge && (
          <List.Item>
            <List.Icon name="sign out alternate" />
            <List.Content>
              {entry.discharge?.date}: {entry.discharge?.criteria}
            </List.Content>
          </List.Item>
        )}
      </List>
    </div>
  );
};

const HealthCheckEntryDetals: React.FC<HealthCheckEntryDetailsProps> = ({
  entry,
}: HealthCheckEntryDetailsProps) => {
  enum HealthCheckRatingColor {
    "green" = 0,
    "yellow" = 1,
    "orange" = 2,
    "red" = 3,
  }
  return (
    <div>
      <EntryHeader {...{ entry, typeIcon: "stethoscope" }} />
      <List>
        <EntryCommon entry={entry} />
        <List.Item>
          <List.Icon
            name="heart"
            color={
              HealthCheckRatingColor[
                entry.healthCheckRating
              ] as StrictIconProps["color"]
            }
          />
          <List.Content>
            {HealthCheckRating[entry.healthCheckRating]}
          </List.Content>
        </List.Item>
      </List>
    </div>
  );
};

const OccupationalHealthcareEntryDetails: React.FC<OccupationalHealthcareEntryDetailsProps> = ({
  entry,
}: OccupationalHealthcareEntryDetailsProps) => {
  return (
    <div>
      <EntryHeader {...{ entry, typeIcon: "medkit" }} />
      <List>
        <EntryCommon entry={entry} />
        {entry.sickLeave && (
          <List.Item>
            <List.Icon name="bed" />
            <List.Content>
              {" "}
              {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
            </List.Content>
          </List.Item>
        )}
      </List>
    </div>
  );
};

const EntryDetails: React.FC<EntryDetailsProps> = ({
  entry,
}: EntryDetailsProps) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryDetals entry={entry} />;
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      assertUnreachable(entry);
      return <></>;
  }
};

export default EntryDetails;
