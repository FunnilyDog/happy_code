import { useNavigate } from "react-router-dom";
import { test } from "./test";
import Modal from "../../components/dialog";
// import { useState } from "react";

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

      <button
        onClick={() => {
          Modal.confirm({
            title: "111",
            context: <div>22222</div>
          });
        }}
      >
        打开弹窗
      </button>
      {/* <Modal visible={visible} show={show} onClose={onClose}>
        <div>1111</div>
      </Modal> */}
    </div>
  );
};

export default Index;
