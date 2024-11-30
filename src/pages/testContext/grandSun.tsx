import { useContext } from "react";
import { initPerson2, PersonContext } from "../../contexts/personContext";
import { useEffect } from "react";

export const GrandSon = () => {
  const { personB, setPersonB } = useContext(PersonContext)!;
  console.log("grandSonA 更新");

  useEffect(() => {
    setPersonB({
      ...initPerson2,
      name: "grandSon"
    });
  }, [setPersonB]);

  return (
    <div>
      {personB.name}
      <div>{personB.age}</div>
    </div>
  );
};
