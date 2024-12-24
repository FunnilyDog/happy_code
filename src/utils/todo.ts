export const test = () => {};
// function task(name: string, time: number) {
//   return () =>
//     new Promise((resolve) => {
//       console.log("任务" + name + "开始");
//       setTimeout(() => {
//         console.log("任务" + name + "完成");
//         resolve(name);
//       }, time);
//     });
// }
// const taskList = [
//   task("1", 1000),
//   task("2", 2000),
//   task("3", 3000),
//   task("4", 1000),
//   task("5", 2000),
//   task("6", 3000),
//   task("7", 1000)
// ];

// // 最多n个任务并行执行 直至任务列表执行完全 返回 完成态
// function runTasks(taskList: Function[], n: number) {
//   return new Promise((resolve) => {
//     let count = 0,
//       i = 0;
//     const len = taskList.length;

//     const run = () => {
//       if (i === len) return;
//       const item = taskList[i++];
//       item().then(() => {
//         if (++count === len) resolve("done");
//         run();
//       });
//     };
//     const max = Math.min(n, len);
//     for (let index = 0; index < max; index++) {
//       run();
//     }
//   });
// }
// runTasks(taskList, 3).then(() => console.log("所有任务执行完成"));

/**
 * 若干 情侣聚会 号码牌一致 [1,1]
 * 一个单身 号码牌
 *
 * 输入 arr[]
 * 输出 不匹配当前值
 */

const findSignl = (arr: number[]) => {
  // arr.sort((a, b) => a - b);
  const len = arr.length;
  let res;
  // [1,2,2,3,3]
  for (let index = 0; index < len; index++) {
    if (
      (index < 1 || arr[index] !== arr[index - 1]) &&
      (arr[index] !== arr[index + 1] || index === len - 1)
    ) {
      res = arr[index];
      break;
    }
  }
  return res;
};
// console.log("findSignl()", findSignl([ 3, 3, 4, 2, 2]));

/**
 * 小偷 偷 东西，每户金额不一致
 * 偷相邻 报警， 间隔
 * 求出 能偷的最大值
 *
 * 输入: number[]  number > 0
 * 输出: 非相邻数之和最大值
 */

// [ 9, 888,999, 8, 8]
// max[n] = Math.max(max[n-1],max[n-2] + nums[n])
const getMaxSum = (nums: number[], idx: number): number => {
  if (idx === 0) return nums[0];
  if (idx === 1) return nums[0] > nums[1] ? nums[0] : nums[1];

  const sum1 = getMaxSum(nums, idx - 2) + nums[idx];
  const sum2 = getMaxSum(nums, idx - 1);
  return Math.max(sum1, sum2);
};
function rob(nums: number[]): number {
  const len = nums.length;
  return getMaxSum(nums, len - 1);
}
// console.log("[ 9, 5,999, 8, 8]", rob([9, 5, 999, 8, 8]));

class MonkeyClass {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  eat(type: string) {
    console.log(`I eat ${type}`);
    return this;
  }

  sleep(time: number) {
    console.log(`等待 ${time} s`);
    return this;
  }
}

function Monkey(name: string) {
  console.log(`my name is ${name}`);

  const eat = (type: string) => {
    console.log(`I eat ${type}`);
    return {
      eat,
      sleep
    };
  };

  const sleep = (time: number) => {
    console.log(`等待 ${time} s`);
    return {
      eat,
      sleep
    };
  };
  return {
    eat,
    sleep
  };
}

Monkey("Alan").eat("Banana").sleep(4).eat("Apple").sleep(5).eat("Pear");

const formatAmount = (val: number | string): string => {
  if (typeof +val !== "number" || Number.isNaN(+val)) return "-";
  let xiaoshu = Number(+val).toFixed(2).split(".")[1];
  let [num] = String(val).split(".");
  num = String(Number(num))
    .split("")
    .reverse()
    .reduce((pre, cur, idx) => {
      return (idx % 3 ? cur : cur + ",") + pre;
    });

  return `${num}.${xiaoshu}`;
};

// console.log("formatAmount(2688.28)", formatAmount(2688.289)); //=> "2,688.00"
// console.log('formatAmount("2e6")', formatAmount("2e6")); //=> "2,000,000.00"
// formatAmount(-2.33333333); //=> "-2.33"
// console.log('formatAmount("Alibaba")', formatAmount("Alibaba")); //=> "-"

/**
 * 手动实现一个 useEffect
 *
 */

/**
 *
 * @param callback deps更改后执行方法
 * @param deps 依赖
 * @returns void | Function
 */
let preDeps: any[] | undefined = [];
let preReturnFunction = () => {};

const useEffect = (callback: Function, deps?: any[]): void | Function => {
  // !deps  更新
  // deps.length !== 0 更新
  // deps 有变更 更新
  const hasUpdate = deps?.reduce((cur, pre, index) => {
    return Object.is(cur, preDeps?.[index]) && pre;
  }, true);

  // 需要更新
  if (!deps || deps.length || hasUpdate) {
    if (preReturnFunction && typeof preReturnFunction === "function") {
      preReturnFunction();
    }
    const fn = callback();
    preReturnFunction = fn;
  }
  preDeps = deps;
  //  TODO 挂载时执行一次 怎么处理
};
