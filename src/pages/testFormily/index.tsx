import { Button } from "antd";
import CustomForm from "./form/form";
import FormWithControl from "./form/formWithConrtol";
import { useNavigate } from "react-router-dom";

const Index = (props: any) => {
  const navgiteTo = useNavigate();
  console.log("props", props);

  return (
    <>
      <h2>登录</h2>
      <CustomForm />
      <FormWithControl />
      {/* <Outlet /> */}
    </>
  );
};

export default Index;
