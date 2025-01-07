class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

/** 创建一个长为len 的链表 返回头指针 */
const makeNode = (len: number) => {
  let count = 1,
    head = new ListNode(count),
    cur = head;
  while (count < len) {
    count++;
    const node = new ListNode(count);
    cur.next = node;
    cur = cur.next;
  }
  return head;
};

/** 遍历链表值输出 */
const mapList = (head: ListNode | null) => {
  const res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
};
/** 反转链表 并返回 链表反转后的 头尾 指针 */
const reverseList = (
  head: ListNode | null
): { head: ListNode | null; lastHead: ListNode | null } => {
  let cur = head,
    pre = null,
    count = 0;
  while (cur) {
    count++;
    let temp = cur.next;
    cur.next = pre;
    pre = cur;
    cur = temp;
  }

  return {
    head: pre,
    lastHead: head
  };
};

/** k个一组反转链表 */
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  let stack: {
    head: ListNode | null;
    needReverse: boolean;
  }[] = [
    {
      head,
      needReverse: false
    }
  ];
  let cur = head;
  let count = 0;
  while (cur) {
    count++;
    cur = cur.next;
    if (count === k) {
      count = 0;
      stack[stack.length - 1].needReverse = true;
      cur &&
        stack.push({
          head: cur,
          needReverse: false
        });
    }
  }
  const newStack = stack.map((item) => {
    if (item.needReverse) return reverseList(item.head);
    return {
      head: item.head,
      lastHead: null
    };
  });
  newStack.forEach((item, idx) => {
    if (item?.lastHead) item.lastHead.next = newStack[idx + 1]?.head || null;
  });

  return newStack[0].head;
}

reverseKGroup(makeNode(6), 3);

export { mapList, makeNode, reverseKGroup, reverseList };
