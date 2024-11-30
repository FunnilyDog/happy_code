import React, { createContext, useMemo, useState } from "react";

export type PersonType = {
  name: string;
  age: number;
  sex: string;
  hobby: {
    game: string[];
    sports: string[];
  };
};
export type PersonContextType = {
  person: PersonType;
  personB: PersonType;
  setPerson: React.Dispatch<React.SetStateAction<PersonType>>;
  setPersonB: React.Dispatch<React.SetStateAction<PersonType>>;
};

export const initPerson = {
  name: "dx",
  age: 19,
  sex: "男",
  hobby: {
    game: ["Lol", "DNF"],
    sports: ["swim", "table tennis"]
  }
};
export const initPerson2 = {
  name: "dx",
  age: 19,
  sex: "男",
  hobby: {
    game: ["Lol", "DNF"],
    sports: ["swim", "table tennis"]
  }
};
// TODO 切换成 useSyncExternalStore
export const PersonContext = createContext<PersonContextType | null>(null);

export const useHeader = () => {
  const [person, setPerson] = useState(initPerson2);
  const [personB, setPersonB] = useState(initPerson2);

  const values = useMemo(
    () => ({
      person,
      setPerson,
      personB,
      setPersonB
    }),
    [person, setPerson, personB, setPersonB]
  );

  return values;
};
