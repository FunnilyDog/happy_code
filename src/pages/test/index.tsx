import { useNavigate } from "react-router-dom";
import { test } from "./test";
import Modal from "../../components/dialog";
import React, { useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { title } from "process";
import { Portal } from "../../components/Portal";

const Index = () => {
  test();
  const [visible, setVisible] = React.useState(false);
  const navgiteTo = useNavigate();

  // const show = () => {
  //   setVisible(true);
  // };
  // const onClose = () => {
  //   setVisible(false);
  //   Model.
  // };

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
            visible,
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
