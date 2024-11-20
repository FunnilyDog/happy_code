const StateEnum = {
  Pending: "pending",
  Fulfilled: "fulfilled",
  Rejected: "rejected"
};

type VoidFuc = (val: unknown) => void;
type UnknownFuc = (val: unknown) => unknown;

type MicroTaskType = {
  onFulfilled: UnknownFuc;
  onRejected?: UnknownFuc;
  resolve: VoidFuc;
  reject: VoidFuc;
};

const isPromise = (data: any) => {
  if (data !== null && ["object", "function"].includes(typeof data)) {
    return data && typeof data?.then === "function";
  }
  return false;
};

// 模拟执行微任务
const runMicroTask = (task: MutationCallback) => {
  // node 环境
  if (typeof process === "object" && typeof process.nextTick === "function") {
    process.nextTick(task);
  }
  // 浏览器环境
  else if (typeof MutationObserver === "function") {
    const ob = new MutationObserver(task);
    const textNode = document.createTextNode("1");
    ob.observe(textNode, {
      characterData: true
    });
    textNode.data = "2";
  }
};

class MyPromise {
  private result: unknown = null;
  private state: String = StateEnum.Pending;
  private MicroTasks: MicroTaskType[] = [];

  constructor(ex: (resolve: VoidFuc, reject: VoidFuc) => void) {
    const resolve = (val: unknown) => {
      this.changeState(StateEnum.Fulfilled, val);
    };
    const reject = (reason: unknown) => {
      this.changeState(StateEnum.Rejected, reason);
    };
    try {
      ex(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  private changeState(state: string, result: unknown) {
    if (this.state !== StateEnum.Pending) return;
    this.state = state;
    this.result = result;
    this.run();
  }

  private run() {
    if (this.state === StateEnum.Pending) return;
    const task = () => {
      this.MicroTasks.forEach((item) => {
        const { onFulfilled, onRejected, resolve, reject } = item;
        const isSuccess = this.state === StateEnum.Fulfilled;
        const callBack = isSuccess ? onFulfilled : onRejected;
        if (typeof callBack === "function") {
          try {
            const data = callBack(this.result);
            if (isPromise(data)) {
              (data as MyPromise).then(resolve, reject);
            } else resolve(data);
          } catch (error) {
            reject(error);
          }
        }
      });
    };
    runMicroTask(task);
  }

  then(onFulfilled: UnknownFuc, onRejected: UnknownFuc) {
    const newPromise = new MyPromise((resolve, reject) => {
      this.MicroTasks.push({
        onFulfilled,
        onRejected,
        resolve,
        reject
      });
      this.run();
    });
    return newPromise;
  }
}

const b = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise");
  }, 1000);
});

const a = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("MyPromise");
  }, 1000);
});

a.then(
  (res) => console.log("222", res),
  (reason) => console.log("fulfilled reason", reason)
);

export default MyPromise;
