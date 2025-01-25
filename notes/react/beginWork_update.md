---
title: "BeginWork_update"
date: 2025-01-18T14:57:48+08:00
draft: true
description: ""
summary: ""
---

## 入口

```ts
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // ...省略，这里只关注 switch case 部分

  // 这里列举全部 case，下面会对部分case进行梳理
  switch (workInProgress.tag) {
    // 挂载时, 此时的 function class 组件还未区分，都走该case
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type,
        renderLanes
      );
    }
    case LazyComponent: {
      const elementType = workInProgress.elementType;
      return mountLazyComponent(
        current,
        workInProgress,
        elementType,
        renderLanes
      );
    }
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes
      );
    }
    // 在 create 中 已梳理
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes);

    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);

    case SuspenseComponent:
      return updateSuspenseComponent(current, workInProgress, renderLanes);
    case HostPortal:
      return updatePortalComponent(current, workInProgress, renderLanes);
    case ForwardRef: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === type
          ? unresolvedProps
          : resolveDefaultProps(type, unresolvedProps);
      return updateForwardRef(
        current,
        workInProgress,
        type,
        resolvedProps,
        renderLanes
      );
    }

    case Mode:
      return updateMode(current, workInProgress, renderLanes);
    case Profiler:
      return updateProfiler(current, workInProgress, renderLanes);
    case ContextProvider:
      return updateContextProvider(current, workInProgress, renderLanes);
    case ContextConsumer:
      return updateContextConsumer(current, workInProgress, renderLanes);
    case MemoComponent: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      // Resolve outer props first, then resolve inner props.
      let resolvedProps = resolveDefaultProps(type, unresolvedProps);
      resolvedProps = resolveDefaultProps(type.type, resolvedProps);
      return updateMemoComponent(
        current,
        workInProgress,
        type,
        resolvedProps,
        renderLanes
      );
    }

    // ...省略部分 case
  }
}
```

## case 梳理

在梳理具体 case 之前，将简单介绍部分 公共方法

```ts
export function prepareToReadContext(
  workInProgress: Fiber,
  renderLanes: Lanes
): void {
  currentlyRenderingFiber = workInProgress;
  lastContextDependency = null;
  lastFullyObservedContext = null;

  const dependencies = workInProgress.dependencies;
  if (dependencies !== null) {
    const firstContext = dependencies.firstContext;
    if (firstContext !== null) {
      if (includesSomeLane(dependencies.lanes, renderLanes)) {
        //将 ReactFiberBeginWork 中的 局部属性 didReceiveUpdate 值更改为 true;
        markWorkInProgressReceivedUpdate();
      }
      dependencies.firstContext = null;
    }
  }
}
```

### IndeterminateComponent

函数组件 & 类组件 首次挂载时都会走到该 case 会先执行 renderWithHooks 方法 后 判断 value 是否有 render 方法 来确认是 函数组件 or 类组件 并给 fiber 打标。函数组件 类组件 具体实现 在对应 case 中梳理

```ts
function mountIndeterminateComponent(
  _current,
  workInProgress,
  Component,
  renderLanes
) {
  const props = workInProgress.pendingProps;
  let context;

  prepareToReadContext(workInProgress, renderLanes);

  value = renderWithHooks(
    null,
    workInProgress,
    Component,
    props,
    context,
    renderLanes
  );

  if (
    typeof value === "object" &&
    value !== null &&
    typeof value.render === "function" &&
    value.$$typeof === undefined
  ) {
    workInProgress.tag = ClassComponent;

    // TODO 类组件挂载时 具体实现流程梳理
  } else {
    workInProgress.tag = FunctionComponent;
    // 将子节点
    reconcileChildren(null, workInProgress, value, renderLanes);

    return workInProgress.child;
  }
}
```

### FunctionComponent

```ts
function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps: any,
  renderLanes
) {
  // ...
  let context, nextChildren, hasId;

  prepareToReadContext(workInProgress, renderLanes);

  nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps,
    context,
    renderLanes
  );

  // ...省略部分代码 只关注 主要步骤

  // React DevTools reads this flag.
  workInProgress.flags |= PerformedWork;

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
```

#### renderWithHooks

```ts
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes
): any {
  // 将 HooksDispatcher 切换为 update
  ReactCurrentDispatcher.current =
    current === null || current.memoizedState === null
      ? HooksDispatcherOnMount
      : HooksDispatcherOnUpdate;

  // 这里的 Component 则为具体的 函数组件
  let children = Component(props, secondArg);

  return children;
}
```

### LazyComponent

```ts
function mountLazyComponent(
  _current,
  workInProgress,
  elementType,
  renderLanes
) {
  const props = workInProgress.pendingProps;
  const lazyComponent: LazyComponentType<any, any> = elementType;
  const payload = lazyComponent._payload;
  const init = lazyComponent._init;
  let Component = init(payload);

  workInProgress.type = Component;
  const resolvedTag = (workInProgress.tag = resolveLazyComponentTag(Component));
  const resolvedProps = resolveDefaultProps(Component, props);
  let child;
  switch (resolvedTag) {
    case FunctionComponent: {
      // 具体流程在对应case中梳理
    }
    case ClassComponent: {
      //  ...
    }
    // ...
  }
}

// 该方法会在 renderWidthHook 中执行,后在 遍历到 lazy 组件时 执行 init 初始化组件
// 后续更新 则走 对应分支
export function lazy<T>(
  ctor: () => Thenable<{default: T, ...}>,
): LazyComponent<T, Payload<T>> {
  const payload: Payload<T> = {
    // We use these fields to store the result.
    _status: Uninitialized,
    _result: ctor,
  };

  const lazyType: LazyComponent<T, Payload<T>> = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer,
  };

  return lazyType;
}

function lazyInitializer<T>(payload: Payload<T>): T {
  if (payload._status === Uninitialized) {
    const ctor = payload._result;
    // 执行异步加载方法 （一般是 import()）
    const thenable = ctor();
    thenable.then(
      moduleObject => {
        // 同步 lazy 组件 的状态与加载结果
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          payload._status = Resolved;
          payload._result = moduleObject;
        }
      },
      error => {
        if (payload._status === Pending || payload._status === Uninitialized) {
          // Transition to the next state.
          payload._status = Rejected;
          payload._result = error;
        }
      },
    );
    if (payload._status === Uninitialized) {
      // 首次进来时改为 Pending 状态
      const pending: PendingPayload = (payload: any);
      pending._status = Pending;
      pending._result = thenable;
    }
  }
  if (payload._status === Resolved) {
    // 如果 promise 完成了，那么会将加载的模块返回
    const moduleObject = payload._result;
    return moduleObject.default;
  } else {
    // 第一次加载时，报错
    throw payload._result;
  }
}
```

### HostComponent

const isDirectTextChild = shouldSetTextContent(type, nextProps);
// ...
reconcileChildren(current, workInProgress, nextChildren, renderLanes);

### SuspenseComponent

TODO 后续补充

### HostPortal

```ts
function updatePortalComponent(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
) {
  // 在它的子节点被添加时，可以找到这个containerInfo节点。
  // 这样就可以达到fiber在rootFiber内，但是添加的真实节点在其他节点的目的
  pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
  const nextChildren = workInProgress.pendingProps;

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

export function createPortal(
  children: ReactNodeList,
  containerInfo: any,
  implementation: any,
  key: ?string = null
): ReactPortal {
  return {
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : "" + key,
    children,
    containerInfo,
    implementation
  };
}

export function createFiberFromPortal(
  portal: ReactPortal,
  mode: TypeOfMode,
  lanes: Lanes
): Fiber {
  const pendingProps = portal.children !== null ? portal.children : [];
  const fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
  fiber.lanes = lanes;
  fiber.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null, // Used by persistent updates
    implementation: portal.implementation
  };
  return fiber;
}
```

###
