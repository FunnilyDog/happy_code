import { Component, ReactNode } from "react";
import ReactDOM from "react-dom";

export class Portal extends Component<{ children?: ReactNode }> {
  container: Element | null | void = null;
  timer: NodeJS.Timeout | null = null;

  componentDidMount() {
    this.createContainer();

    this.timer = setTimeout(() => {
      // getContainer 返回ref时，子组件首先执行 componentDidMount,此时ref还未赋值
      if (!this.container) {
        this.createContainer();
      }
    });
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  createContainer() {
    this.container = document.getElementById("root");
    console.log("container", this.container);

    this.forceUpdate();
  }
  render(): ReactNode {
    const { children } = this.props;
    console.log("document.body", document.body);
    if (this.container) return ReactDOM.createPortal(children, this.container);
    return null;
  }
}
