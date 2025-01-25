---
title: "CompleteWork"
date: 2025-01-18T13:05:52+08:00
draft: true
description: ""
summary: ""
---

```ts
// path: packages/react-reconciler/src/ReactFiberCompleteWork.old.js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      bubbleProperties(workInProgress);
      return null;
    case HostText: {
      // ...省略部分代码
      // 根据不同tag 为 stateNode 创建 对应dom 节点
      workInProgress.stateNode = createTextInstance(
        newText,
        rootContainerInstance, // root
        currentHostContext,
        workInProgress
      );
      // 将所有child 的 return赋值为 completedWork；
      // 计算 completedWork 的 subtreeFlags
      bubbleProperties(workInProgress);
      return null;
    }
    case HostComponent: {
      // 将当前 fiber 移出 fiberStack
      popHostContext(workInProgress);
      // 在beginWork中对于HostRoot和HostPortal节点都会将真实节点container全
      // 局存储到rootInstanceStackCursor.current，而在completeWork阶段将其移出。
      // 在访问子节点时就能正确获取到它所在的容器
      // 获取的是当前的 RootHostContainer
      const rootContainerInstance = getRootHostContainer();
      const type = workInProgress.type;
      if (current !== null && workInProgress.stateNode != null) {
        // // 如果真实节点存在，那么进行更新
        updateHostComponent(
          current,
          workInProgress,
          type,
          newProps,
          rootContainerInstance
        );

      } else {
        if (!newProps) {
          bubbleProperties(workInProgress);
          return null;
        }

        const currentHostContext = getHostContext();

        const instance = createInstance(
          type,
          newProps,
          rootContainerInstance,
          currentHostContext,
          workInProgress
        );
        // 将能渲染的子节点全部添加到当前创建的节点instance上
        appendAllChildren(instance, workInProgress, false, false);

        workInProgress.stateNode = instance;

      }
      bubbleProperties(workInProgress);
      return null;
    }
  }
}

export function updateHostComponent() {
  // ...

  // 类似结构：['name', '张三', 'id', 333, 'style', { color: 'red' }]
  const updatePayload = prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext,
  );
  workInProgress.updateQueue = (updatePayload: any);
  // 标记为 Update
  if (updatePayload) {
    markUpdate(workInProgress);
  }
};

export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object
): Instance {
  // 创建了 element
  const domElement: Instance = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace
  );
  // 建立关系 node . '__reactFiber$' + randomKey = fiber
  precacheFiberNode(internalInstanceHandle, domElement);
  // 建立关系 node . '__reactProps$' + randomKey = props
  updateFiberProps(domElement, props);
  return domElement;
}
```
