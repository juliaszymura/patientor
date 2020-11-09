import React from "react";
import { Icon } from "semantic-ui-react";
import { Gender } from "../types";

interface GenderIconProps {
  gender: Gender;
}

const assertUnreachable = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const GenderIcon = ({ gender }: GenderIconProps) => {
  let icon = <></>;

  switch (gender) {
    case Gender.Other:
      icon = <Icon name="genderless"></Icon>;
      break;
    case Gender.Male:
      icon = <Icon name="mars"></Icon>;
      break;
    case Gender.Female:
      icon = <Icon name="venus"></Icon>;
      break;
    default:
      assertUnreachable(gender);
  }

  return icon;
};

export default GenderIcon;
