import { useNavigate } from "react-router-dom";

const Index = () => {
  const navgiteTo = useNavigate();
  return (
    <div>
      111
      <button
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
