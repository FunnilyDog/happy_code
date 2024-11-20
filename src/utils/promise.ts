import { rejects } from "assert";

export class MyPromise<T> {
  private state: "pending" | "fulfilled" | "rejected";
  private value: any;
  private reason: any;
  private successFucTask: Function[];
  private failedFucTask: Function[];

  constructor(
    arguFuc: (
      resolve: (val: T | MyPromise<T>) => void,
      reject: (val: T | MyPromise<T>) => void
    ) => void
  ) {
    this.state = "pending";
    this.value = "";
    this.reason = "";
    this.successFucTask = [];
    this.failedFucTask = [];

    const successFuc = (val: T | MyPromise<T>) => {
      if (val instanceof MyPromise) {
        val.then(successFuc);
      } else {
        this.state = "fulfilled";
        this.value = val;
        console.log("successFuc val", val);

        this.successFucTask?.map((fuc) => {
          fuc?.(val);
        });
      }
    };

    const failedFuc = (reason: any) => {
      if (reason instanceof MyPromise) {
        reason.catch(failedFuc);
      } else {
        this.state = "rejected";
        this.reason = reason;
        this.failedFucTask?.map((fuc) => {
          fuc?.(reason);
        });
      }
    };

    arguFuc(successFuc, failedFuc);
  }

  then<RT, RF = never>(
    onSuccess: (val: RT) => RT | void | MyPromise<RT>,
    onFailed?: (reason: RF) => RF | MyPromise<RF>
  ) {
    return new MyPromise((resolve, reject) => {
      const successFuc = (value: any) => {
        const result = onSuccess(value);
        if (result instanceof MyPromise) {
          result.then(resolve, reject);
        }
      };
      const failedFuc = (reason: any) => {
        if (onFailed) {
          const result = onFailed(reason);
          if (result instanceof MyPromise) {
            result.catch(reject);
            // ????
          } else resolve(result);
        } else reject(reason);
      };

      switch (this.state) {
        case "pending":
          this.successFucTask.push(successFuc);
          if (onFailed) this.failedFucTask.push(failedFuc);
          break;

        case "fulfilled":
          successFuc(this.value);
          break;
        case "rejected":
          failedFuc(this.value);
          break;
      }
    });
  }
  catch<RF>(onReject: (reason: RF) => RF | MyPromise<RF>) {
    return new MyPromise((resolve, reject) => {
      if (this.state === "rejected") {
        // ??? catch 用resolve?
        resolve(onReject(this.reason));
      } else {
        this.failedFucTask.push(() => resolve(onReject(this.reason)));
      }
    });
  }
  finally(callBack: Function) {
    switch (this.state) {
      case "pending":
        this.successFucTask.push(callBack);
        this.failedFucTask.push(callBack);
        break;
      case "fulfilled":
        callBack();
        break;
      case "rejected":
        callBack();
        break;
    }
  }
}
