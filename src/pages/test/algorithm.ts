export const algorithm = () => {};

// dp[i] = dp[i - 1][1] + dp[i - 1][0] + dp[i - 1][1];
// dp[2] = cm + mc + mm
// ['mc', 'mm', 'cm']
// 字符串全由c，m组成，但是不能连续出现两个c在一起，然后给一个字符串总长度，计算可能出现的结果
const getMaxGroupNum = (k: number): string[] => {
  if (k === 0) return [];
  if (k === 1)  return ["c", "m"];
  

  return getMaxGroupNum(k - 1).map((item) => {
    const isC = item[item.length - 1] === "c";
    if (isC) return item + "m";
    else return [item + "c", item + "m"];
  }).flat();
   
};

const res = getMaxGroupNum(3);
console.log("res", res);
