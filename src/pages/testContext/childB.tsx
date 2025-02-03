import { memo } from "react";

const ChildB = () => {
  return <div>ChildB</div>;
};

const MemoChildB = memo(ChildB);

export { ChildB };
