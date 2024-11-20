type Handler = {
  onFulfilled: (val: unknown) => unknown;
  onRejected?: (val: unknown) => unknown;
  resolve: (val: unknown) => unknown;
  reject: (val: unknown) => unknown;
};

const isPromise = (val: unknown) => {
  if (val !== null && ["object", "function"].includes(typeof val)) {
    // @ts-ignore
    return val && typeof val?.then === "function";
  }
  return false;
};

const runMicroTask = (task: Function) => {
  if (typeof process === "object" && typeof process.nextTick === "function") {
    process.nextTick(task);
  }
  // ????
  if (typeof MutationObserver === "function") {
    // ?
    const ob = new MutationObserver(task as any);
    const textNode = document.createTextNode("1");
    ob.observe(textNode, {
      characterData: true
    });
    textNode.data = "2";
  }
};

export class MyPromise<T> {
  private result: unknown = null;
  private state: String = "pending";
  private handlers: Handler[] = [];

  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    const resolve = (result: unknown) => {
      this.changeState(MyPromise.FULFILLED, result);
    };
    const reject = (reason?: unknown) => {
      this.changeState(MyPromise.REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  private run() {
    if (this.state === MyPromise.PENDING) return;
    this.handlers.forEach((item) => {
      const { onFulfilled, onRejected, resolve, reject } = item;
      const isSuccess = this.state === MyPromise.FULFILLED;
      const callBack = isSuccess ? onFulfilled : onRejected;

      // 如果回调是一个函数则执行
      if (typeof callBack === "function") {
        try {
          const data = callBack(this.result);
          if (isPromise(data))
            (data as MyPromise<unknown>).then(resolve, reject);
          else resolve(data);
        } catch (error) {
          reject(error);
        }
      }
      // 否则直接根据当前promise状态去更新then方法返回的promise的状态
      else isSuccess ? resolve(this.result) : reject(this.state);
    });
  }

  private changeState(state: string, result: unknown) {
    if (this.state !== MyPromise.PENDING) return;
    this.state = state;
    this.result = result;
    runMicroTask(this.run.bind(this));
  }

  then(
    onFulfilled: (val: unknown) => void,
    onRejected?: (reason?: unknown) => void
  ) {
    const thenPromise = new MyPromise((resolve, reject) => {
      this.handlers.push({
        onFulfilled,
        onRejected,
        resolve,
        reject
      });
      runMicroTask(this.run.bind(this));
    });

    return thenPromise;
  }
}

const a = new MyPromise((resolve, reject) => {
  resolve("MyPromise");
});

const b = new Promise((resolve, reject) => {
  resolve("Promise");
});

a.then(
  (res) => {
    console.log("res", res);
    return b;
  },
  (reason) => {
    console.log("reason", reason);
  }
).then((data) => {
  console.log("data", data);
});
