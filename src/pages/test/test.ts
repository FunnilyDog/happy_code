export const test = () => {};

/**
 * 
 * 给定一个菜单数据，结构如下：
请实现一个函数，返回一个包含所有完整菜单路径url的数组：['a/b/c', 'a/c/e', ...]
数据如下：
const urls = [
  {
    url: "/business",
    name: "商务",
    children: [
      {
        url: "/product-reporting",
        name: "产品申报",
        children: []
      },
      {
        url: "/offerlist",
        name: "报价列表",
        children: []
      }
    ]
  },
  {
    url: "/product",
    name: "产品",
    children: [
      {
        url: "/certification",
        name: "产品包装认证",
        children: [
          {
            url: "/cert1",
            name: "包装认证1",
            children: []
          },
          {
            url: "/cert2",
            name: "包装认证2",
            children: []
          }
        ]
      },
      {
        url: "/catalog",
        name: "产品类目",
        children: []
      }
    ]
  },
  {
    url: "/order",
    name: "订单",
    children: []
  }
];
    
// 输出：
[
	'/business/product-reporting',
	'/business/offerlist',
	'/product/certification/cert1',
	'/product/certification/cert2',
	'/product/catalog',
	'/order'
]
 */

const urls = [
  {
    url: "/business",
    name: "商务",
    children: [
      {
        url: "/product-reporting",
        name: "产品申报",
        children: []
      },
      {
        url: "/offerlist",
        name: "报价列表",
        children: []
      }
    ]
  },
  {
    url: "/product",
    name: "产品",
    children: [
      {
        url: "/certification",
        name: "产品包装认证",
        children: [
          {
            url: "/cert1",
            name: "包装认证1",
            children: []
          },
          {
            url: "/cert2",
            name: "包装认证2",
            children: []
          }
        ]
      },
      {
        url: "/catalog",
        name: "产品类目",
        children: []
      }
    ]
  },
  {
    url: "/order",
    name: "订单",
    children: []
  }
];
type Obj = {
  url: string;
  name: string;
  children: Obj[];
};

const getUrl = (preUrl: string = "", res: string[] = [], arr: Obj[]): any => {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const item = arr[i];
    const curUrl = preUrl + item.url;
    if (!item.children.length) {
      res.push(curUrl);
    } else {
      let children = item.children;
      let temp = getUrl(curUrl, res, children);
      res.concat(temp);
    }
  }
  return res;
};

const getUrls = getUrl.bind(null, "", []);

// console.log("-->", getUrls(urls));

function findKthLargest(nums: number[], k: number): number {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    map.set(nums[i], 1);
  }
  map.forEach((val, key) => {
    console.log("val", val, key);
  });
  return 1;
}

// findKthLargest([3, 2, 1, 5, 6, 4],2);
