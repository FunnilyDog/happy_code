---
title: "React18 阅读笔记 -- render 调度阶段"
date: 2025-01-13T13:55:00+08:00
draft: false
textColor: white
summary: "整理 react 18 源码 render 方法 的整体流程 每个步骤做了什么"
---

{{< badge >}}
New article!
{{< /badge >}}

## ReactDOM.createRoot

创建了一个 reactfiberrootnode current 属性指向一个新 fiber,并绑定所有事件监听

```ts
  /**
   * 创建 tag = 1 的 FiberRoot 对象
   * 并在current 上挂载了一个 tag = 3, mode = 1 的空fiber
   * 初始化该 fiber 的 UpdateQueue  initializeUpdateQueue(uninitializedFiber)
   */
  const root = createContainer(
    container,
    ConcurrentRoot, //  常量 1
    null,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
  );
  // container[__reactContainer$(一串随机数)] = root.current;
  markContainerAsRoot(root.current, container);

  const rootContainerElement: Document | Element | DocumentFragment =
    container.nodeType === COMMENT_NODE
      ? (container.parentNode: any)
      : container;
  /** 为 container 添加事件监听 */
  listenToAllSupportedEvents(rootContainerElement);

  /**
   * this._internalRoot = internalRoot;
   * 挂载到 ReactDOMRoot._internalRoot 属性上
  */
  return new ReactDOMRoot(root);
```

## react

```ts
// path: packages/react-dom/src/client/ReactDomRoot.js

ReactDOMRoot.prototype.render = function (children: ReactNodeList): void {
  // ...省略部分代码
  updateContainer(children, root, null, null);
};

// path: packages/react-reconciler/src/ReactFiberReconciler.old.js
function updateContainer(
  element: ReactNodeList, // Index
  container: OpaqueRoot, // root
  parentComponent: ?React$Component<any, any>, // null
  callback: ?Function // null
): Lane {
  // 初始化一个 update 任务
  const update = createUpdate(eventTime, lane);
  update.payload = { element };

  /**
   * 将创建的 update任务 添加到 ReactFiberConcurrentUpdates 文件
   * 全局变量 concurrentQueues 中
   * 用传入的 lane 更新fiber链表中的所有 lane 并返回 root
   * */
  const fiber = container.current;
  const queue: SharedQueue<State> = fiber.updateQueue.shared;
  const interleaved = queue.interleaved;
  if (interleaved === null) {
    update.next = update;
    ReactFiberConcurrentUpdates.concurrentQueues = [queue];
  }
  queue.interleaved = update;
  // 上面是 enqueueUpdate 方法的具体实现 执行栈太长就把重要步骤挪过来方便查看了

  const root = markUpdateLaneFromFiberToRoot(fiber, lane);

  if (root !== null) {
    scheduleUpdateOnFiber(root, current, lane, eventTime);
    entangleTransitions(root, current, lane);
  }
}
```

```ts
// path: packages/react-reconciler/src/ReactFiberWorkLoop.old.js
function scheduleUpdateOnFiber(
  root: FiberRoot,
  fiber: Fiber,
  lane: Lane,
  eventTime: number
) {
  // 将 eventTime 按 lane 插入到 root.eventTimes 中
  markRootUpdated(root, lane, eventTime);
  // 做的事情蛮多
  ensureRootIsScheduled(root, eventTime);
}

// ensureRootIsScheduled
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  //根据 root.eventTimes 计算出 root.expirationTimes
  markRootUpdated(root, lane, eventTime);

  const nextLanes = getNextLanes(root, NoLanes);
  const newCallbackPriority = getHighestPriorityLane(nextLanes);

  const existingCallbackNode = root.callbackNode;
  if (existingCallbackNode != null) {
    // Cancel the existing callback. We'll schedule a new one below.
    cancelCallback(existingCallbackNode);
  }
  let newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );

  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
}

function scheduleCallback(priorityLevel, callback) {
  // 这里调用的就是 Scheduler 中的 unstable_scheduleCallback 方法
  return Scheduler_scheduleCallback(priorityLevel, callback);
}

// path: packages/scheduler/src/forks/Scheduler.js
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = getCurrentTime();
  var startTime = currentTime;
  // NormalPriority 是 5000
  var timeout = 5000;
  var expirationTime = startTime + timeout;

  var newTask = {
    id: taskIdCounter++,
    callback, // performConcurrentWorkOnRoot 方法
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1
  };

  newTask.sortIndex = expirationTime;
  // 将 newTask 放进 taskQueue 并按照 sortIndex 排序
  push(taskQueue, newTask);

  // 挂载时都为初始值 false
  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;

    function requestHostCallback(callback) {
      scheduledHostCallback = callback;
      // 挂载时都为初始值 false
      if (!isMessageLoopRunning) {
        isMessageLoopRunning = true;
        // 通过 postMessage 异步调用 performWorkUntilDeadline
        schedulePerformWorkUntilDeadline();
      }
    }

    requestHostCallback(flushWork);
  }
}

// path: packages/scheduler/src/forks/Scheduler.js
const performWorkUntilDeadline = () => {
  const currentTime = getCurrentTime();

  let hasMoreWork = true;
  try {
    // 这里的 scheduledHostCallback 就是 flushWork
    hasMoreWork = scheduledHostCallback(true, currentTime);
  } finally {
    // 还有任务则再调一轮
    if (hasMoreWork) {
      schedulePerformWorkUntilDeadline();
    } else {
      isMessageLoopRunning = false;
      scheduledHostCallback = null;
    }
  }
};

// path: packages/scheduler/src/forks/Scheduler.js
// hasTimeRemaining = true ,initialTime = currentTime
function flushWork(hasTimeRemaining, initialTime) {
  isHostCallbackScheduled = false;

  isPerformingWork = true;

  // 这里的 currentPriorityLevel 为初始值 3
  const previousPriorityLevel = currentPriorityLevel;

  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
    if (enableProfiling) {
      const currentTime = getCurrentTime();
      markSchedulerSuspended(currentTime);
    }
  }
}

// path: packages/scheduler/src/forks/Scheduler.js
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  currentTask = peek(taskQueue);

  while (currentTask !== null) {
    // 这里的 callback 就是 performConcurrentWorkOnRoot
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      // 至此 任务调度 完成，开始执行任务 进入 reconciler 阶段
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
    }
  }
}
```

```ts
// path: packages/react-reconciler/src/ReactFiberWorkLoop.old.js
function performConcurrentWorkOnRoot(root, didTimeout) {
  const originalCallbackNode = root.callbackNode;

  /**  刷新pending状态的effects, 有可能某些effect会取消本次任务 */
  const didFlushPassiveEffects = flushPassiveEffects();

  let lanes = getNextLanes(root, NoLanes);

  let exitStatus = renderRootSync(root, lanes);

  if (![0, 1, 2, 6].includes(exitStatus)) {
    root.finishedWork = finishedWork;
    root.finishedLanes = lanes;
    // !调和阶段完成 提交fiber树
    finishConcurrentRender(root, exitStatus, lanes);
  }

  ensureRootIsScheduled(root, now());

  // 若还是同一个任务则继续返回该任务
  if (root.callbackNode === originalCallbackNode) {
    return performConcurrentWorkOnRoot.bind(null, root);
  }

  return null;
}

function renderRootSync(root: FiberRoot, lanes: Lanes) {
  // 存储 executionContext
  const prevExecutionContext = executionContext;
  // 将 executionContext 更新为 RenderContext
  executionContext |= RenderContext;

  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  // 如果workinprogress不存在 则初始化一个
  // 并将 queue.interleaved 移到 queue.pending 中
  // 这里的 queue 存的是 root.current.updateQueue.shared
  // 在 enqueueConcurrentClassUpdate 方法中给 queue.interleaved 赋值为 update;
  // 该update 是在 updateContainer 方法中 创建的 并将 payload属性赋值为了 render方法里的 第一个参数
  prepareFreshStack(root, lanes);

  do {
    try {
      workLoopSync();
      break;
    } catch (thrownValue) {
      handleError(root, thrownValue);
    }
  } while (true);

  return workInProgressRootExitStatus;
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork: Fiber): void {
  const current = unitOfWork.alternate;
  let next; // 用来存放beginWork()返回的结果
  // 根据 workInProgress.tag 创建对应 fiber
  // 若 为 函数组件 则调用 renderWidthHook 执行函数组件 并 创建对应fiber
  next = beginWork(current, unitOfWork, subtreeRenderLanes);

  // 更新状态了
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    // 下次的workLoopSync/workLoopConcurrent的while循环的循环主体为子Fiber节点
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork: Fiber): void {
  // 本次 performUnitOfWork 的循环主体 workInprogress 的最底层 child
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;

    // 只要 beginWork 阶段正常执行后（即执行无异常），都会进到这一段逻辑来
    let next;
    next = completeWork(current, completedWork, subtreeRenderLanes);

    resetCurrentDebugFiberInDEV();

    if (next !== null) {
      workInProgress = next;
      return;
    }

    // 取当前Fiber节点(completedWork)的兄弟(sibling)节点；
    // 如果有值，则结束completeUnitOfWork，并将该兄弟节点作为下次performUnitOfWork的主体(unitOfWork)
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // If there is more work to do in this returnFiber, do that next.
      workInProgress = siblingFiber;
      return;
    }
    // Otherwise, return to the parent
    // 若没有兄弟节点，则将在下次do...while循环中处理父节点(completedWork.return)
    completedWork = returnFiber;
    // Update the next thing we're working on in case something throws.
    // 此处需要注意！
    // 虽然把workInProgress置为completedWork，但由于没有return，即没有结束completeUnitOfWork，因此没有意义
    // 直到completedWork（此时实际上是本循环中原completedWork.return）为null，结束do...while循环后
    // 此时completeUnitOfWork的运行结果(workInProgress)为null
    // 也意味着performSyncWorkOnRoot/performConcurrentWorkOnRoot中的while循环也达到了结束条件
    workInProgress = completedWork;
  } while (completedWork !== null);

  // We've reached the root.
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted;
  }
}

finishConcurrentRender(root, exitStatus, lanes) {
 switch (exitStatus) {
  case RootCompleted: {
    // The work completed. Ready to commit.
      commitRoot(
        root,
        workInProgressRootRecoverableErrors,
        workInProgressTransitions,
      )
      break;
  }
 }
}

function commitRootImpl(
  root: FiberRoot,
  recoverableErrors: null | Array<CapturedValue<mixed>>,
  transitions: Array<Transition> | null,
  renderPriorityLevel: EventPriority,
) {
  do {
    flushPassiveEffects()
  } while (rootWithPendingPassiveEffects !== null);

  const finishedWork = root.finishedWork;
  const lanes = root.finishedLanes;

  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  root.callbackNode = null;
  root.callbackPriority = NoLane;

  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    pendingPassiveEffectsRemainingLanes = remainingLanes;
    pendingPassiveTransitions = transitions;
    scheduleCallback(NormalSchedulerPriority, () => {
      flushPassiveEffects();
      return null;
    });
  }
   if (subtreeHasEffects || rootHasEffect) {
    const shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(
      root,
      finishedWork,
    );
   }

}
```
