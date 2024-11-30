// const StateEnum = {
//   Pending: "pending",
//   Fulfilled: "fulfilled",
//   Rejected: "rejected"
// };

enum StateEnum {
  Pending = "pending",
  Fulfilled = "fulfilled",
  Rejected = "rejected"
}

type VoidFuc = (val: unknown) => void;
type UnknownFuc = (val: unknown) => unknown;

type MicroTaskType = {
  onFulfilled: null | UnknownFuc;
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
const runMicroTask = (task: () => void) => {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(task);
  } else if (
    typeof process === "object" &&
    typeof process.nextTick === "function"
  ) {
    process.nextTick(task);
  }
};

class MyPromise {
  private result: unknown = null;
  private state: String = StateEnum.Pending;
  private MicroTasks: MicroTaskType[] = [];

  constructor(excutor: (resolve: VoidFuc, reject: VoidFuc) => void) {
    this.state = StateEnum.Pending;
    this.result = null;
    excutor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve = (res: unknown) => {
    this.changeState(StateEnum.Fulfilled, res);
  };

  reject = (reason: unknown) => {
    this.changeState(StateEnum.Rejected, reason);
  };

  private changeState(state: StateEnum, result: unknown) {
    if (this.state !== StateEnum.Pending) return;
    this.state = state;
    this.result = result;
    this.run();
  }

  private runOne(
    callBack: any,
    resolve: VoidFuc,
    reject: VoidFuc,
    isSuccess: boolean
  ) {
    try {
      const resCallBack = isSuccess ? resolve : reject;
      if (typeof callBack === "function") {
        const data = callBack(this.result);
        if (isPromise(data)) {
          (data as MyPromise).then(resolve, reject);
        } else resCallBack(data);
      } else resCallBack(this.result);
    } catch (error) {
      reject(error);
    }
  }

  private run() {
    if (this.state === StateEnum.Pending) return;

    this.MicroTasks?.forEach((item) => {
      const task = () => {
        const { onFulfilled, onRejected, resolve, reject } = item;
        const isSuccess = this.state === StateEnum.Fulfilled;
        const callBack = isSuccess ? onFulfilled : onRejected;
        this.runOne(callBack, resolve, reject, isSuccess);
      };
      runMicroTask(task);
    });
  }

  then(onFulfilled: UnknownFuc, onRejected: UnknownFuc) {
    const resultPromise = new MyPromise((resolve: VoidFuc, reject: VoidFuc) => {
      this.MicroTasks.push({
        onFulfilled,
        onRejected,
        resolve,
        reject
      });
      this.run();
    });
    return resultPromise;
  }

  catch(callBack: UnknownFuc) {
    return this.then(() => {}, callBack);
  }

  finally(callBack: () => void) {
    return this.then(
      (result) => {
        callBack();
        return result;
      },
      (reason) => {
        callBack();
        throw reason;
      }
    );
  }

  static resolve(value: any) {
    if (value instanceof Promise) return value;
    const p = new MyPromise((resolve, reject) => {
      if (isPromise(value)) {
        value.then(resolve, reject);
      } else resolve(value);
    });
    return p;
  }

  static reject(value: any) {
    return new MyPromise((resolve, reject) => {
      reject(value);
    });
  }
}

const b = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("1Promise");
  }, 3000);
});

const a = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("MyPromise");
  }, 1000);
});

a.then(
  (res) => {
    console.log("then resolve", res);
    return b;
  },
  () => {}
)
  .then(
    (res) => {
      console.log("then2 resolve", res);
    },
    () => {}
  )
  .catch((error: unknown) => {
    console.log("error", error);
  });

export default MyPromise;
