# 重载

```typescript
function func<T>(val: T): T;
function func<T>(val: [T, ...unknown[]]): T;
function func() {}
```

# zustand 优点

    useSyncExternalStore

# react 中同步 setState

1. setState 只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。
2. setState 的“异步”并不是内部异步代码实现的，其本身执行过程和代码是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致这两个场景下没法立马拿到更新后的值，形成了所谓的“异步”，但是我们还是可以通过 setState 的第二个参数，callback 函数去拿到更新后的值的。

3. setState 的批量更新优化机制是建立在“异步”（合成事件，钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新。在“异步”中，如果是对同一个 key 值进行多次 setState，批量更新策略会对其进行覆盖，只对最后一次 setState 进行更新。如果同时 setState 多个不同的 key 值，会先进行合并操作，再在最后一个 setState 进行更新。

# react 事件机制

合成事件：react 会在事件冒泡到 document 时集中捕获，并进行规范化处理，使之在不同浏览器中具有一致性。同时 react 合成事件于原生事件并非一一印设，合成事件有自己的映射规则。

流程：

事件绑定：

1. React 初始化时，会在根节点上绑定原生事件
2. 支持冒泡的事件，React 会同时绑定捕获阶段和冒泡阶段的事件；不支持冒泡的事件，React 则只绑定捕获阶段的事件
3. React 将事件分为三种优先级类型，在绑定事件处理函数时会使用不同的回调函数，但底层都是调用 dispatchEvent 函数

事件触发

1. 在触发事件之前，React 会根据当前实际触发事件的 DOM 元素找到其 Fiber 节点，向上收集同类型事件添加到事件队列中。
2. 根据事件阶段（冒泡/捕获），来决定（顺序/倒序）遍历执行事件函数。
3. 当调用 React 阻止冒泡方法时，就是把变量 isPropagationStopped 设置为一个返回 true 的函数，后续派发事件时只要代码判断时则执行函数结果为 true 则表示阻止冒泡，就不再走下面逻辑。
