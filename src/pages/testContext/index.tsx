import { PersonContext, useHeader } from "../../contexts/personContext";
import { ChildA } from "./childA";
import { ChildB } from "./childB";
import styles from "./index.module.less";

const Index = () => {
  const values = useHeader();
  console.log("Parent values", values);

  return (
    <PersonContext.Provider value={values}>
      <div className={styles.box}>
        111
        <ChildA />
        <ChildB />
      </div>
    </PersonContext.Provider>
  );
};

export default Index;
