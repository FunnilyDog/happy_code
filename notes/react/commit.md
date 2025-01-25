---
title: "Commit"
date: 2025-01-17T18:41:00+08:00
draft: true
description: ""
summary: ""
summary: "整理 react 18 源码 render 方法 的整体流程 每个步骤做了什么"
---

## commitRoot

beginWork 和 completeWork 阶段都正常结束后，此时所有的 fiber 和真实节点创建完成，进入到 commit 阶段：

```ts
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

function commitRoot(root) {
  const previousUpdateLanePriority = getCurrentUpdatePriority();
  const prevTransition = ReactCurrentBatchConfig.transition;
  try {
    ReactCurrentBatchConfig.transition = 0;
    // 优先级为同步，不可被打断
    setCurrentUpdatePriority(DiscreteEventPriority);
    commitRootImpl(root, previousUpdateLanePriority);
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition;
    setCurrentUpdatePriority(previousUpdateLanePriority);
  }

  return null;
}
```

```ts
function commitRootImpl(
  root: FiberRoot,
  recoverableErrors: null | Array<CapturedValue<mixed>>,
  transitions: Array<Transition> | null,
  renderPriorityLevel: EventPriority
) {
  do {
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  const finishedWork = root.finishedWork;
  const lanes = root.finishedLanes;

  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  root.callbackNode = null;
  root.callbackPriority = NoLane;

  // 如果flags/subtreeFlags中存在PassiveMask，即Passive|ChildDeletion，
  // 那么 rootDoesHavePassiveEffects 为true。也就是说如果使用了useEffect或者是节点有删除的情况
  // 那么就会执行flushPassiveEffects方法：
  if (
    (finishedWork.subtreeFlags & PassiveMask) !== NoFlags ||
    (finishedWork.flags & PassiveMask) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffects) {
      rootDoesHavePassiveEffects = true;
      // 异步执行 useEffect
      scheduleCallback(NormalSchedulerPriority, () => {
        flushPassiveEffects();
        return null;
      });
    }
  }

  // 如果subtreeHasEffects或rootHasEffect存在，说明有更新。
  // 首先会进入beforeMutation阶段，调用commitBeforeMutationEffects方法：
  if (subtreeHasEffects || rootHasEffect) {
    const shouldFireAfterActiveInstanceBlur = commitBeforeMutationEffects(
      root,
      finishedWork
    );
  }

  commitMutationEffects(root, finishedWork, lanes);

  // 同步执行 useLayoutEffect 的 create 并存储 destroy
  commitLayoutEffects(finishedWork, root, lanes);

  if (rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = false;
    rootWithPendingPassiveEffects = root;
    pendingPassiveEffectsLanes = lanes;
  }

  root.current = finishedWork;

  // 如果还有未完成的更新，即优先级不够的更新，那么这里会被继续调度进行更新。
  ensureRootIsScheduled(root, now());

  // 如果当前更新中包含useEffect，并且lanes中含有同步lane，那么需要立即执行flushPassiveEffect
  // 相比于schedule执行flushPassiveEffects，这里执行更靠前。
  if (
    includesSomeLane(pendingPassiveEffectsLanes, SyncLane) &&
    root.tag !== LegacyRoot
  ) {
    flushPassiveEffects();
  }

  flushSyncCallbacks();

  return null;
}

// flushPassiveEffects

export function flushPassiveEffects(): boolean {
  // 如果 rootWithPendingPassiveEffects 存在，说明使用了 useEffect 或者有子节点被删除
  if (rootWithPendingPassiveEffects !== null) {
    const renderPriority = lanesToEventPriority(pendingPassiveEffectsLanes);
    const priority = lowerEventPriority(DefaultEventPriority, renderPriority);
    const prevTransition = ReactCurrentBatchConfig.transition;
    const previousPriority = getCurrentUpdatePriority();
    try {
      // transition 置为 0
      ReactCurrentBatchConfig.transition = 0;
      // 设置 update 优先级，获取 lane 的时候会用得到
      setCurrentUpdatePriority(priority);
      return flushPassiveEffectsImpl();
    } finally {
      setCurrentUpdatePriority(previousPriority);
      ReactCurrentBatchConfig.transition = prevTransition;
    }
  }
  return false;
}

function flushPassiveEffectsImpl() {
  if (rootWithPendingPassiveEffects === null) {
    return false;
  }
  // 针对 fiber.flags === ChildDeletion 的 节点 执行
  // commitPassiveUnmountInsideDeletedTreeOnFiber(fiber, nearestMountedAncestor);
  // 对 function 组件 通过调用
  // safelyCallDestroy(finishedWork, nearestMountedAncestor, destroy);
  // 方法 执行 destroy。然后在
  // commitPassiveUnmountEffectsInsideOfDeletedTree_complete
  // 方法中删除fiber引用并且删除对应真实节点的引用
  // 到底后 执行 commitPassiveUnmountInsideDeletedTreeOnFiber 自下而上处理兄弟节点
  commitPassiveUnmountEffects(root.current);
  // 同上步骤 调用effects里的 create 方法并生成destroy
  commitPassiveMountEffects(root, root.current, lanes, transitions);

  flushSyncCallbacks();
}

// BeforeMutationEffects 阶段

export function commitBeforeMutationEffects(
  root: FiberRoot,
  firstChild: Fiber
) {
  focusedInstanceHandle = prepareForCommit(root.containerInfo);
  nextEffect = firstChild;
  commitBeforeMutationEffects_begin();

  // 。。。省略部分代码
}

function commitBeforeMutationEffects_begin() {
  // 向下遍历，直到找到一个不符合BeforeMutationMask的节点
  while (nextEffect !== null) {
    const fiber = nextEffect;

    const child = fiber.child;
    // export const BeforeMutationMask = Update | Snapshot
    if (
      (fiber.subtreeFlags & BeforeMutationMask) !== NoFlags &&
      child !== null
    ) {
      child.return = fiber;
      nextEffect = child;
    } else {
      commitBeforeMutationEffects_complete();
    }
  }
}

// 自下往上遍历，执行 commitBeforeMutationEffectsOnFiber
function commitBeforeMutationEffects_complete() {
  while (nextEffect !== null) {
    const fiber = nextEffect;
    // 处理 class组件中定义的getSnapshotBeforeUpdate函数
    // 或者 处理 current === null || current.child === null 的HostRoot
    // 将 root.containerInfo 真实节点的内容置空
    commitBeforeMutationEffectsOnFiber(fiber);

    const sibling = fiber.sibling;
    if (sibling !== null) {
      sibling.return = fiber.return;
      nextEffect = sibling;
      return;
    }
    nextEffect = fiber.return;
  }
}

// mutation 阶段

export function commitMutationEffects(
  root: FiberRoot,
  finishedWork: Fiber,
  committedLanes: Lanes
) {
  inProgressLanes = committedLanes;
  inProgressRoot = root;

  // mutation阶段的执行顺序也是自上而下开始遍历，执行删除dom操作，然后到了最底层子节点，
  // 开始自下而上执行插入和更新dom操作
  commitMutationEffectsOnFiber(finishedWork, root, committedLanes);

  inProgressLanes = null;
  inProgressRoot = null;
}

function commitMutationEffectsOnFiber(
  finishedWork: Fiber,
  root: FiberRoot,
  lanes: Lanes
) {
    const current = finishedWork.alternate;
  const flags = finishedWork.flags;

  // The effect flag should be checked *after* we refine the type of fiber,
  // because the fiber tag is more specific. An exception is any flag related
  // to reconcilation, because those can be set on all fiber types.
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent: {
      // Deletion 深度遍历执行删除操作
      recursivelyTraverseMutationEffects(root, finishedWork, lanes);
      // Placement 插入逻辑
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        // 找出 useInsertionEffect 的 destroy 方法去调用
        // 需要注意 destroy 可能为 undefined（函数组件初次挂载的情况下）
          commitHookEffectListUnmount(
            HookInsertion | HookHasEffect,
            finishedWork,
            finishedWork.return,
          );
          // 执行 useInsertionEffect 的回调函数，并将返回值保存到 effect.destory 里。
          commitHookEffectListMount(
            HookInsertion | HookHasEffect,
            finishedWork,
          );
        if (
          enableProfilerTimer &&
          enableProfilerCommitHooks &&
          finishedWork.mode & ProfileMode
        ) {
            startLayoutEffectTimer();
            // useLayoutEffect 对应的 destroy 方法
            // 同样可能不存在
            commitHookEffectListUnmount(
              HookLayout | HookHasEffect,
              finishedWork,
              finishedWork.return,
            );
          recordLayoutEffectDuration(finishedWork);
        }
      }
      return;
    }
    case HostComponent: {
      recursivelyTraverseMutationEffects(root, finishedWork, lanes);
      commitReconciliationEffects(finishedWork);
    }
}
```

# 流程图

![Alt text](/imgs/commit.png "commit 流程图")
