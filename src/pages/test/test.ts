export const test = () => {};

// 金融 格式化
/**
 * params： number
 * return  100,000
 */

const numFormat = (val: number) => {
  let res = val
    .toString()
    .split("")
    .reverse()
    .reduce((pre, cur, idx) => {
      return idx % 3 === 0 ? cur + "," + pre : cur + pre;
    }, "");
  return res;
};
console.log("numFormat(2345425);", numFormat(2345425));

// 随机乱序
/**
 * params nums[]
 * return 乱序数组
 */
const nums = [2, 4, 4, 5, 1];
const randomArr = (nums: number[]) => {
  const len = nums.length;
  // 创建一个下标映射随机下标的数组
  // random 怎么保证不同且在0——len - 1
  const map = new Map();
  let res: number[] = [];
  // len = 15
  let key = 0;
  while (map.size < len) {
    let random = Math.floor(Math.random() * len);
    if (map.has(random)) continue;
    else {
      map.set(random, key);
      res[key] = nums[random];
      key++;
    }
  }
  return res;
};
console.log("randomArr", randomArr(nums));
