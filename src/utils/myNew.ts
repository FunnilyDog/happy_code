export const myNew = (fn: Function, ...args: any[]) => {
  let obj = {};
  const res = fn.apply(obj, args);
  if (typeof res === "object") {
    return res;
  }
  return obj;
};
