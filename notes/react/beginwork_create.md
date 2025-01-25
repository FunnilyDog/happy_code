---
title: "React18 阅读笔记 -- beginwork fiber创建"
date: 2025-01-17T18:43:49+08:00
draft: true
description: ""
summary: "整理 react 18 源码 render 方法 的整体流程 每个步骤做了什么"
---

## 入口

```ts
// path: packages/react-reconciler/src/ReactFiberBeginWork.old.js
beginWork = (current, unitOfWork, lanes) => {
  didReceiveUpdate = false;
  workInProgress.lanes = NoLanes;
  // 一大堆switch case 单独放在下一个文件中整理
  // 这里只处理了 unitOfWork 为 hostRoot 的case
  return updateHostRoot(current, workInProgress, renderLanes);
};

function updateHostRoot(current, workInProgress, renderLanes) {
  pushHostRootContext(workInProgress);

  // 将 current 的 UpdateQueue 拷贝给 workInProgress
  cloneUpdateQueue(current, workInProgress);

  /**
   * 将当前将要进行的更新 shared.pending 的环形链表，拆开拼接到到 lastBaseUpdate 的后面；
   * 执行 firstBaseUpdate 链表的操作时，若当前 update 对应的任务的优先级符合要求，则执行；
   * 若优先级较低，则存储执行到当前节点的状态，做为下次渲染时的初始值，和接下来所有的 update 节点；
   * 将执行所有操作后得到的 newState 重新给到 workInProgress.memoizedState；
   * 然后存储刚才淘汰下来的低优先级任务的链表，以便下次更新；
   */
  processUpdateQueue(workInProgress, nextProps, null, renderLanes);

  const nextState: RootState = workInProgress.memoizedState;
  const root: FiberRoot = workInProgress.stateNode;
  const nextChildren = nextState.element;

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);

  return workInProgress.child;
}
```

## reconcileChildren

```ts
// export const reconcileChildFibers = ChildReconciler(true);
// export const mountChildFibers = ChildReconciler(false);
// 该初始化参数b表示是否有 current ,未在 reconcileChildFibers 中使用
function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // mountChildFibers 也就是初始化 ChildReconciler 后 执行 reconcileChildFibers
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
    // 更新阶段
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}
```

## reconcileChildFibers

```ts
// path: packages/react-reconciler/src/ReactChildFiber.old.js
//  根据 newChild.$$typeof 不同类型 创建 fiber
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
  lanes: Lanes
): Fiber | null {
  if (typeof newChild === "object" && newChild !== null) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE: // react.element
        return placeSingleChild(
          // 调用 createFiberFromElement 为child 创建 fiber
          reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          )
        );
      case REACT_LAZY_TYPE: // react.lazy
        const payload = newChild._payload;
        const init = newChild._init;
        // TODO: This function is supposed to be non-recursive.
        return reconcileChildFibers(
          returnFiber,
          currentFirstChild,
          // _init: lazyInitializer, 具体实现 放在 update 中梳理
          init(payload),
          lanes
        );
      case REACT_PORTAL_TYPE: // react.portal
        return placeSingleChild(
          reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes)
        );
    }

    // child有多个
    if (isArray(newChild)) {
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild,
        lanes
      );
    }

    throwOnInvalidObjectType(returnFiber, newChild);
  }
}
```

### REACT_ELEMENT_TYPE

当类型为 react.element 时，会先调用 reconcileSingleElement 方法，校验 key 和 type 是否一致，如果一致则使用 useFiber 方法进行复用 fiber。然后 调用 placeSingleChild 根据 current 与 当前 finber.alternate 判断是否需要给 fiber.flages 标记为新增

```ts
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement,
  lanes: Lanes
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  while (child !== null) {
    // key 一致 直接复用
    if (child.key === key) {
      const elementType = element.type;
      if (elementType === REACT_FRAGMENT_TYPE) {
        if (child.tag === Fragment) {
          // 如果是 Fragment 标签 则跳过直接复用 Fragment 的 children
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props.children);
          existing.return = returnFiber;
          return existing;
        }
      } else {
        deleteRemainingChildren(returnFiber, child.sibling);
        const existing = useFiber(child, element.props);
        existing.ref = coerceRef(returnFiber, child, element);
        existing.return = returnFiber;
        return existing;
      }
      // Didn't match.
      // 遍历所有子节点 将 child 加入 fiber.deletions 并将 renturnFiber.flags 标记为 ChildDeletion
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }
  // 否则直接新建fiber
  if (element.type === REACT_FRAGMENT_TYPE) {
    const created = createFiberFromFragment(
      element.props.children,
      returnFiber.mode,
      lanes,
      element.key
    );
    created.return = returnFiber;
    return created;
  } else {
    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = coerceRef(returnFiber, currentFirstChild, element);
    created.return = returnFiber;
    return created;
  }
}

function placeSingleChild(newFiber: Fiber): Fiber {
  if (shouldTrackSideEffects && newFiber.alternate === null) {
    newFiber.flags |= Placement;
  }
  return newFiber;
}
```

### REACT_LAZY_TYPE

```ts

```

### reconcileChildrenArray

```ts
function reconcileChildrenArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<*>,
  lanes: Lanes
): Fiber | null {
  let resultingFirstChild: Fiber | null = null;
  let previousNewFiber: Fiber | null = null;

  // oldFiber 是老 fiber 的第一个 child，可以通过 sibling 进行遍历。
  let oldFiber = currentFirstChild;
  // lastPlacedIndex 表示最后一个老fiber被复用的位置
  let lastPlacedIndex = 0;
  // 表示新 ReactElement 的位置
  let newIdx = 0;
  // 表示下一个老fiber
  let nextOldFiber = null;

  // Diff 算法，标记子节点中需要的操作，记录在 flags 中
  // 这个位置相当于只对比了前面的一部分，
  // 如果出现 key 和 type 不一致的情况，那么会跳出对比。
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      // 一直找到 oldFiber index 与 newIdx 相等的节点
      // 否则的话，oldFiber 不向后遍历。
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      // 遍历下一个 fiber
      nextOldFiber = oldFiber.sibling;
    }
    // 这里的 newChildren 是 jsx 解析出来的 children，为 ReactElement节点
    // 根据节点类型创建或者更新 fiber
    const newFiber = updateSlot(
      returnFiber,
      oldFiber,
      newChildren[newIdx],
      lanes
    );
    if (newFiber === null) {
      // key 或 type 不相同时，不可复用。
      // 此时 newFiber 为 null，对比就会终止。
      // 这就意味着找到了第一个无法复用的节点
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }
    // 更新时 需要标记
    if (shouldTrackSideEffects) {
      if (oldFiber && newFiber.alternate === null) {
        // 将老的fiber 添加 ChildDeletion 标记
        deleteChild(returnFiber, oldFiber);
      }
    }
    // 取 current.index 和 lastPlacedIndex 最大值
    // 并给 newFiber.flag 添加 Placement / Forked 标记
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    // 建立 newFiber 之间的联系
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }

  // 遍历跳出之后，会判断老fiber或者是新ReactElement遍历完成没。
  // 如果 newChildren 遍历完成，那么所有剩余的老fiber都应该标记为删除
  if (newIdx === newChildren.length) {
    // 标记删除，记录到 父 fiber 的 deletions 属性中
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
  }
  // 如果老fiber遍历完成，那么所有剩余新的ReactElement都是新插入的节点，创建newFiber
  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      // 根据 ReactElement 创建 fiber
      const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
      if (newFiber === null) {
        continue;
      }
      // 为 newFiber.flage 添加 place 标记
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  // 后续的是因为 key 和 type 不一致导致没有遍历完的数组。
  // 此时开始复用的算法。
  // 首先将老节点转换为 map 形式：{ key|index : fiber }
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

  for (; newIdx < newChildren.length; newIdx++) {
    // 从 existingChildren 中匹配 newIdx  / newChild.key，
    // 若匹配到 则调用 useFiber 复用拿出存储的 oldFiber
    // 否则创建 新fiber
    const newFiber = updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChildren[newIdx],
      lanes
    );
    if (newFiber !== null) {
      if (shouldTrackSideEffects) {
        if (newFiber.alternate !== null) {
          // 如果已经复用了，在 map 中删除对应的 fiber
          existingChildren.delete(
            newFiber.key === null ? newIdx : newFiber.key
          );
        }
      }
      // 能复用时，更新最后一个复用的 老fiber 的 index
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
  }

  if (shouldTrackSideEffects) {
    // 将所有没有被复用的老fiber标记为删除
    existingChildren.forEach((child) => deleteChild(returnFiber, child));
  }

  return resultingFirstChild;
}

// 用于 diff 算法，标记最后匹配的 old fiber 的位置
function placeChild(
  newFiber: Fiber,
  lastPlacedIndex: number,
  newIndex: number
): number {
  newFiber.index = newIndex;
  // 当父亲的 current 不存在时，此时为 mount，shouldTrackSideEffects 为 false，不用做处理。
  // 当父亲的 current 存在时，shouldTrackSideEffects 为 true。
  // 例如，当遇到第一个需要重新创建的节点时，它对应的 parent 的 current 存在，标记为更新。
  // 当遍历到子节点时，由于子节点对应的 parent 的 current 不存在，此时不标记更新。
  // 这样做的好处是，只有父亲被标记为更新，而其后代均不作标记。
  // 在 completeWork 的时候子节点直接全添加到父亲上。
  // 在 commit 的时候只需要将父亲添加到 根节点上即可。
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex;
  }
  // 如果复用了 老fiber
  const current = newFiber.alternate;
  if (current !== null) {
    const oldIndex = current.index;
    // 如果老的 index < lastPlacedIndex，说明这些老的节点无法复用。
    if (oldIndex < lastPlacedIndex) {
      // 不可复用，需要替换
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    } else {
      // This item can stay in place.
      // 否则说明这个老节点可以复用，返回老节点 index
      return oldIndex;
    }
  } else {
    // 如果 老 fiber不存在，那么需要替换
    // 注意这里被标记了，commit的时候会进行处理
    newFiber.flags |= Placement;
    return lastPlacedIndex;
  }
}
```
