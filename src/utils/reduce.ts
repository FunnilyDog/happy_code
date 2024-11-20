// @ts-ignore
export const cusReduce = (arr, callBack, initialValue) => {
  if (!Array.isArray(arr) || arr.length < 2) return;
  const isUndefindInit = initialValue === undefined;
  let result = isUndefindInit ? arr[0] : initialValue;
  const initIdx = isUndefindInit ? 1 : 0;
  for (let index = initIdx; index < arr.length; index++) {
    const element = arr[index];
    result = callBack(result, element, index, arr);
  }
  return result;
};

const arr = [1, 2, 3, 4, 5];
// @ts-ignore
const sum = cusReduce(arr, (acc, current) => acc + current, 0);
console.log("sum", sum);
