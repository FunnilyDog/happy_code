# flex

默认值 flex: initial 等价于 flex: 0 1 auto

flex: 1 // flex-grow:1; flex-shrink:1; flex-basis:0%
flex: auto // flex-grow:1; flex-shrink:1; flex-basis: auto

flex: 1 应用场景: 等分布局；自适应布局；

什么情况下主轴不为 row

## flex-basis

默认值：auto
flex-basis 指定了 flex 元素在主轴方向上的初始大小，当一个元素同时被设置了 flex-basis (除值为 auto 外) 和 width (或者在 flex-direction: column 情况下设置了 height) , flex-basis 具有更高的优先级。
取值：固定值
