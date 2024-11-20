// export const format = (val: number) => {
//   if (!val) return;
//   const arr = val.toString().split("").reverse();
//   return arr.reduce((pre, cur, index) => (index % 3 ? cur : cur + ",") + pre);
// };

// export const format = (val: number) => {
//   if (!val) return;
//   // return val.toString().replace(/\B(?=(\d{3})+\b)/g, ",");
//   return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };

export const format = (val: number) => {
  if (!val) return;
  return new Intl.NumberFormat().format(val);
};

const arr = [
  "井柏然",
  "冯绍峰",
  "刘烨",
  "孙红雷",
  "李易峰",
  "李晨",
  "杜淳",
  "胡歌",
  "贾乃亮",
  "邓超",
  "陆毅",
  "陈坤",
  "韩庚",
  "鹿晗",
  "黄晓明"
];

export const sortAs = (array: any[]) => {
  return arr.sort(new Intl.Collator("zh").compare);
};
