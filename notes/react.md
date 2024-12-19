# setState 原理

## 挂载

1. 创建一个 hook 节点，挂载所有初始的数据；
2. 若 initialState 是函数类型，则使用执行它后的结果；
3. 将 hook 节点挂载到函数组件对应的 fiber 节点上；
4. 把所有执行的 setState(action) 里的参数 action，全部挂载到链表中；
5. 返回该 hook 的初始值 和 set 方法；

## 更新

1. 把上次遗留下来的低优先级任务（如果有的话）与当前的任务拼接（这里不对当前任务进行优先级的区分，会在第 2 步进行区分）到 baseQueue 属性上；
2. 遍历 baseQueue 属性上所有的任务，若符合当前优先级的，则执行该 update 节点；若不符合，则将此节点到最后的所有节点都存储起来，便于下次渲染遍历，并将到此刻计算出的 state 作
3. 为下次更新时的基准 state（在 React 内部，下次渲染的初始 state，可能并不是当前页面展示的那个 state，只有所有的任务都满足优先级完成执行后，两者才是一样的）；
4. 遍历完所有可以执行的任务后，得到一个新的 newState，然后判断与之前的 state 是否一样，若不一样，则标记该 fiber 节点需要更新，并返回新的 newState 和 dispatch 方法。

# react fiber

Fiber 是一个 JavaScript 对象，代表 React 的一个工作单元，它包含了与组件相关的信息以及组件之前的关联信息。
在 fiber 出现之前 react 的 vdom diff 阶段是没办法中断的 必须一次性 完成 diff 并渲染，这会造成页面的假死。fiber 工作流程主要分两个阶段

1. Reconciler: 依照 fiber 链条 逐个进行 diff 收集副作用并生成 work in progress tree，该过程可被中断。
   2.commit: 执行所有副作用 并 更新 DOM 该过程不可中断

# HOC hook renderProps

HOC 纯函数 接收一个组件 对组件功能进行增强 返回增强后组件
render props: 将一个函数作为 prop 传递给一个组件，而这个函数用来返回要渲染的 UI。通过这种方式，父组件可以控制子组件渲染的内容，同时还能实现灵活的逻辑复用

# useEffect 依赖引用类型

更新时会被重新分配地址导致每次更新时都会执行 useEffect
