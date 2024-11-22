type Node = {
  key: number;
  value: unknown;
  parentKey: number;
};

type treeNode = {
  key: number;
  value: unknown;
  parentKey: number;
  childRen?: null | treeNode[];
};
const list = [
  { key: 7, value: "G", parentKey: 4 },
  { key: 3, value: "C", parentKey: 1 },
  { key: 1, value: "A", parentKey: 0 },
  { key: 2, value: "B", parentKey: 0 },
  { key: 4, value: "D", parentKey: 1 },
  { key: 5, value: "E", parentKey: 2 },
  { key: 6, value: "F", parentKey: 3 }
];
const tree: treeNode[] = [
  {
    key: 1,
    value: "A",
    parentKey: 0,
    childRen: [
      {
        key: 3,
        value: "C",
        parentKey: 1,
        childRen: [
          {
            key: 6,
            value: "F",
            parentKey: 3,
            childRen: []
          }
        ]
      },
      {
        key: 4,
        value: "D",
        parentKey: 1,
        childRen: [
          {
            key: 7,
            value: "G",
            parentKey: 4,
            childRen: []
          }
        ]
      }
    ]
  },
  {
    key: 2,
    value: "B",
    parentKey: 0,
    childRen: [
      {
        key: 5,
        value: "E",
        parentKey: 2,
        childRen: []
      }
    ]
  }
];

const getChildren = (
  list: Array<Node>,
  result: treeNode[],
  parentKey: number
) => {
  list.forEach((item) => {
    if (item.parentKey === parentKey) {
      const newItem = {
        ...item,
        childRen: []
      };
      result.push(newItem);
      getChildren(list, newItem.childRen, item.key);
    }
  });
};

const listToTreeRecursion = (list: Array<Node>) => {
  const result: treeNode[] = [];
  getChildren(list, result, 0);
  return result;
};

function arrayToTree(items: Array<Node>) {
  let res: treeNode[] = []; // 存放结果集
  let map: Record<string, any> = {};

  // 边做map存储，边找对应关系
  items.forEach((i) => {
    const id = i.key;
    const pid = i.parentKey;

    map[id] = {
      ...i,
      childRen: map?.[id]?.childRen || []
    };

    if (pid === 0) res.push(map[id]);
    else {
      if (!map[pid]) map[pid] = { childRen: [] };
      map[pid].childRen.push(map[id]);
    }
  });
  return res;
}

const getChildRenList = (tree: treeNode[], result: Array<Node>) => {
  tree.forEach((item) => {
    if (!item?.childRen || item.childRen?.length === 0) {
      result.push(item);
    } else getChildRenList(item.childRen, result);
  });
};

const treeToList = (tree: treeNode[]) => {
  const result: Array<Node> = [];
  getChildRenList(tree, result);
  return result;
};

const tree1 = arrayToTree(list);
console.log("tree1", tree1);

const testList = treeToList(tree);
console.log("testList", testList);

export { list, tree, listToTreeRecursion, arrayToTree, treeToList };
