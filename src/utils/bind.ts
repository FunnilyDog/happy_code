Function.prototype.myApply = function (context: any, args: unknown[]) {
  console.log("context", context, this);

  if (context === null || context === undefined) context = window;
  else if (typeof context !== "object") context = new Object(context);

  const fnKey = Symbol();
  context[fnKey] = this;

  const res = context[fnKey](...args);
  return res;
};

Function.prototype.myCall = function (context: any, ...args: any[]) {
  console.log("context", context, args);

  if (context === null || context === undefined) context = window;
  else if (typeof context !== "object") context = new Object(context);

  const fnKey = Symbol();
  context[fnKey] = this;

  const res = context[fnKey](...args);
  return res;
};

Function.prototype.myBind = function (context: any, ...bindArgs: any[]) {
  console.log("context", context, bindArgs);

  if (context === null || context === undefined) context = window;
  else if (typeof context !== "object") context = new Object(context);

  const fnKey = Symbol();
  context[fnKey] = this;

  return function (...args: any[]) {
    const newArgs = bindArgs.concat(args);
    context[fnKey](newArgs);
  };
};

function fn(args: any) {
  // @ts-ignore
  console.log("fn this", this as any, args);
}
let obj = {
  myname: "张三"
};

const a = fn.myBind(obj, 1, 2, 3); // this会变成传入的obj，传入的参数必须是一个数组；
a();
// fn.myCall(1, 2);
