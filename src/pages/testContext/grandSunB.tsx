import { useContext } from "react";
import { initPerson, PersonContext } from "../../contexts/personContext";
import { useEffect } from "react";

export const GrandSonB = () => {
  console.log("grandSonB 更新");

  return <div>grandSonB</div>;
};
