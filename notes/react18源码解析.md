# createRoot

创建了一个 reactfiberrootnode current 属性指向一个新 fiber,并绑定所有事件监听

```ts
/** 创建 tag = 1 的 FiberRoot 对象
   * 并在current 上挂载了一个 tag = 3, mode = 1 的空fiber */
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
```
