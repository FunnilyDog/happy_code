import styles from "./index.module.less";
import { createRoot } from "react-dom/client";

type PropsType = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactElement;
};
const Modal = (props: PropsType) => {
  const { visible, onClose, children } = props;
  if (!visible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeBtn}>
          关闭&times;
        </button>

        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};

const ConFirmModel = (props: any) => {
  const Element = (props: any) => {
    const { title, context } = props;
    return (
      <div className={styles.overlay} id={"model"}>
        <div className={styles.modal}>
          {title}{" "}
          <button className={styles.closeBtn} onClick={close}>
            关闭&times;
          </button>
          <div className={styles.modalContent}>{context}</div>
        </div>
      </div>
    );
  };

  const div = document.createElement("div");
  let root: any = null;

  const confirm = (props: any) => {
    const { target, title, context } = props;
    div.id = "div";
    document.body.appendChild(div);
    const contanier = target || document.getElementById("div");
    if (contanier) {
      if (!root)
        root = createRoot(contanier, { identifierPrefix: "customRoot" });
      root.render(Element({ title, context }));
    }
  };
  const close = () => {
    root = root?.unmount();
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  };
  confirm(props);

  return {
    close
  };
};

const ExportModal = {
  confirm: (props: any) => ConFirmModel(props),
  Modal
};

export default ExportModal;
