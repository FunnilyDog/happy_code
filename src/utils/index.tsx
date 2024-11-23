/**
 * 防抖 time时间内只执行最后一次
 *  @description fuc 执行函数
 * time 时间
 *
 */
export const debounce = (fuc: () => void, time: number) => {
  let timer: NodeJS.Timeout;
  console.log("222");

  return () => {
    console.log("333");

    console.log("timer", timer);
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = setTimeout(fuc, time);
  };
};

/**
 * 防抖 time时间内执行一次
 *  @description fuc 执行函数
 * time 时间
 * immediately 是否立即执行一次
 *
 */
export const thorttle = (
  fuc: () => void,
  time: number,
  immediately?: boolean
) => {
  let preTime = new Date();

  return () => {
    if (preTime.getDate() + time > new Date().getDate()) {
      fuc();
      preTime = new Date();
    }
  };
};

export const maxNum = (nums: number[]) => {
  const stringNums = nums.map(String);
  // @ts-ignore
  const res = stringNums.sort((a, b) => b + a - (a + b)).join("");
  if (res.startsWith("0")) return "0";
  return res;
};
