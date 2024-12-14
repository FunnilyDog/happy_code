declare interface Function {
  myApply: any;
  myCall: any;
  myBind: any;
  myInstanceOf: (fuc: Function) => boolean;
}

declare interface Object {
  __proto__: any;
}
