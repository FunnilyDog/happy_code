export const test = () => {};

const findUnUsed = (check: number[], used: number[][]) => {
  // 非交集
  let res = [check];

  const len = used.length;
  // 过滤掉used交集
  for (let i = 0; i < len; i++) {
    // 当前已使用
    const [start, end] = used[i];
    res.forEach((item, idx) => {
      // 1.包含关系 删除item 添加两段
      if (start >= item[0] && end <= item[1]) {
        res.splice(idx, 1, [item[0], start], [end, item[1]]);
      }
      //  [start,end]  =  [34, 90],  item = [20,80]
      if (start <= item[1] && end >= item[1]) {
        res.splice(idx, 1, [item[0], start]);
      }
      //  [start,end]  = [-20,30]  item = [20,80]
      if (start <= item[0] && end >= item[0]) {
        res.splice(idx, 1, [end, item[1]]);
      }
    });
  }
  console.log("res", res);
  const result = [];

  for (let index = 0; index < res.length; index++) {
    let [start, end] = res[index];
    start++;
    while (start < end) {
      result.push(start);
      start++;
    }
  }
  return result;
};

const check = [20, 80];
const used = [
  [-20, 30],
  [34, 90],
  [85, 200]
];
/**
 * 
 * 输入  check = [20, 80] ，used = [
  [-20, 30],
  [34, 90],
  [85, 200]
] 

输出： [31,32,33]
 */

// [31,32,33]
console.log(findUnUsed(check, used));
