export const test = () => {};

// 金融 格式化
/**
 * params： number
 * return  100,000
 */

function addStrings(num1: string, num2: string): string {
  const len1 = num1.length,
    len2 = num2.length;

  let m = len1 - 1,
    n = len2 - 1,
    temp = 0;
  let res = "";

  while (m >= 0 || n >= 0) {
    let sum =
      Number(m >= 0 ? num1[m] : 0) + Number(n >= 0 ? num2[n] : 0) + temp;
    if (sum >= 10) {
      temp = 1;
      sum = sum - 10;
    } else temp = 0;
    res = sum + res;
    m--;
    n--;
  }
  return temp ? temp + res : res;
}

// function multiply(num1: string, num2: string): string {
//   let sum = "0",
//     len1 = num1.length - 1,
//     len2 = num2.length - 1;

//   for (let i = len1; i >= 0; i--) {
//     let m1 = num1[i];
//     let curO1 = "";
//     for (let j = len1; j > i; j--) {
//       curO1 += "0";
//     }
//     console.log({ curO1 });

//     for (let m = len2; m >= 0; m--) {
//       let m2 = num2[m];
//       let cur02 = "";
//       for (let n = len2; n > m; n--) {
//         cur02 += "0";
//       }
//       let cur = (+m1 * +m2).toString();
//       cur = cur + curO1 + cur02;

//       while (cur[0] == "0" && cur.length > 0) {
//         cur = cur.slice(1);
//       }
//       sum = addStrings(sum, cur);
//     }
//   }
//   return sum.toString();
// }

function multiply(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";
  /**
   * 创建 tag = 1 的 FiberRoot 对象
   * 并在current 上挂载了一个 tag = 3, mode = 1 的空fiber
   * 初始化该 fiber 的 UpdateQueue  initializeUpdateQueue(uninitializedFiber)
   */
  /**
   *
   *
   */
  let m = num1.length,
    n = num2.length,
    sumArr = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const idx = i + j;
      const preIdx = i + j + 1;
      const temp = +num1[i] * +num2[j] + sumArr[preIdx];

      sumArr[idx] += Math.floor(temp / 10);
      sumArr[preIdx] = temp % 10;

      let aa = [...sumArr];

      console.log({ i, j, temp, aa });
    }
  }
  console.log("sumArr", sumArr);

  while (sumArr[0] == 0) {
    sumArr.shift();
  }
  return sumArr.join("");
}

const aa = multiply("99", "99");

console.log({
  aa,
  isTrue:
    aa === "67143675422804947379429215144664313370120390398055713625298709447"
  //        67143675422804950950894450486013855453431967744504577914139585479n
});

console.log("addStrings", addStrings("0000", "0"));
