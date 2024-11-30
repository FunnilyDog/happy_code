import { useNavigate } from "react-router-dom";
// import "../../utils/deepClone";

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    resolve({ name: "dengx", age: 18 });
  });
};

export function* _async() {
  const userInfo: number = yield getUserInfo();
  console.log("2222", userInfo);
  const name: string = yield () => {
    return "dengxi";
  };
  console.log("name", name);

  const num: number = yield 3;
  console.log("num", num);
}

export const autoRun = (generator: () => Generator<any>) => {
  const gen = generator();

  const next = (data: any) => {
    const result = gen.next(data);
    if (result.done) return;
    if (result.value instanceof Promise) {
      result.value.then((res: any) => {
        next(res);
      });
    } else if (typeof result.value === "function") {
      next(result.value());
    } else {
      next(result.value);
    }
  };
  next(undefined);
};
Promise.retry = (callback, retryTime = 5) => {
  // const curPromise = callback()
  console.log("retryTime", retryTime);

  return new Promise((resolve, reject) => {
    callback().then(
      () => {
        resolve(retryTime);
        console.log("retryTime", retryTime);
      },
      (reason) => {
        if (!retryTime) reject(reason);
        else {
          const p = Promise.retry(callback, --retryTime).then(resolve, reject);
          console.log("p", p);
        }
      }
    );
  });
};
function getProm() {
  const n = Math.random();
  return new Promise((resolve, reject) => {
    setTimeout(() => (n > 1 ? resolve(n) : reject(n)), 1000);
  });
}
Promise.retry(getProm)
  .then((res) => console.log("res", res))
  .catch((err) => console.log("err", err));

const Index = () => {
  // autoRun(_async);

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
