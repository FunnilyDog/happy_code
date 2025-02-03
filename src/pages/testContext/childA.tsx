import { memo } from "react";
import { GrandSon } from "./grandSun";
import { GrandSonB } from "./grandSunB";

const ChildA = () => {
  console.log("ChildA 更新");

  return (
    <div>
      {/* {person.name}
      <div>{person.age}</div> */}
      <GrandSon />
      <GrandSonB />
    </div>
  );
};
// const memoIndex = memo(ChildA);

export { ChildA };
