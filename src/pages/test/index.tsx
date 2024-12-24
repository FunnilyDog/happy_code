import { useNavigate } from "react-router-dom";
import { test } from "./test";

const Index = () => {
  test();
  const navgiteTo = useNavigate();

  return (
    <div>
      <div>点击</div>

      <button
        id="form"
        onClick={() => {
          navgiteTo("/testContext");
        }}
      >
        跳转
      </button>
    </div>
  );
};

export default Index;
