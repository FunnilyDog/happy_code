import React, { useEffect, useState } from "react";
import useTestStore from "../../stores/testStore";
import TestContext from "../testContext";

// import { useState } from "react";
const Index = () => {
  const [count, setCount] = useState(0);
  const { bears, bearsAdd, removeAllBears } = useTestStore();
  console.log("test store component");

  useEffect(() => {
    console.log("count", count);
  }, [count]);

  return (
    <>
      <div>
        <p>Bears: {bears}</p>
        <button onClick={() => bearsAdd(1)}>Increment</button>
        <button onClick={removeAllBears}>Decrement</button>
      </div>

      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount((count) => count + 1)}>
          Increment
        </button>
      </div>
      <TestContext />
    </>
  );
};

// const MemoIndex = React.memo(Index, (pre, cur) => {
//   console.log("test store memo", { pre, cur });
//   return true;
// });

export default Index;
