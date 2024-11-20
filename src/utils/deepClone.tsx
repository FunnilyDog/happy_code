const deepClone = (obj: unknown, cacheMap = new WeakMap()): unknown => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (obj instanceof Date) return new Date(obj);

  if (obj instanceof RegExp) return new RegExp(obj);

  if (obj instanceof Function) {
    return obj.toString();
  }

  if (obj instanceof Map) {
    const newMap = new Map();
    obj.forEach((val, key) => newMap.set(key, deepClone(val)));
    return newMap;
  }

  if (obj instanceof Set) {
    const newSet = new Set();
    obj.forEach((val) => newSet.add(deepClone(val)));
    return newSet;
  }

  const newObj: any = Array.isArray(obj) ? [] : {};

  console.log("cacheMap", cacheMap);

  if (cacheMap.has(obj)) return cacheMap.get(obj);
  cacheMap.set(obj, newObj);

  Object.keys(obj).forEach((key) => {
    const item = obj[key as keyof typeof obj];
    if (typeof item === "object" && item !== null) {
      newObj[key] = deepClone(item, cacheMap);
    } else newObj[key] = item;
  });

  return newObj;
};

const obj2: { [key: string]: any } = {
  a: 1,
  b: {
    c: 1,
    d: [1, 2, { o: 1, m: 2 }]
  },
  f: function f() {
    console.log("1", this?.b?.d[0]);
  }
};
obj2["e"] = obj2;
obj2["m"] = new Map([["a", 1]]);
obj2["s"] = new Set([1, 2]);

const objClone1 = deepClone(obj2) as { [key: string]: any };

obj2.e.a = 3;
obj2.b.d[0] = 3;
obj2["m"].set(["b", 2]);
obj2["s"].add(3);
obj2["f"] = () => {
  console.log("3", 3);
};

console.log("objClone1", objClone1, objClone1?.f());

export default deepClone;
