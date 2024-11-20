import { PersonContext, useHeader } from "../../contexts/personContext";
import { ChildA } from "./childA";
import { ChildB } from "./childB";

const Index = () => {
  const values = useHeader();
  console.log("Parent values", values);

  return (
    <PersonContext.Provider value={values}>
      <div>111</div>;
      <ChildA />
      <ChildB />
    </PersonContext.Provider>
  );
};

export default Index;
