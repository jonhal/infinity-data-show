# infinity-data-show
解决后端给出几万条大数据之后，前端列表dom渲染卡顿，不流畅

## 解决问题
主要解决了后端一次性给出大量数据，前端在一次渲染中，大量的dom插入，使得页面加载缓慢，甚至卡死。

## 原理
通过可视view，可视上一层view，可视下一层view的操作，来减少大量dom的压力。
不过多大的数据量，页面只有这三个view的数据，通过滚动条的判断，对这三个view里面的数据进行动态变化，从而达到大数据量的情况下， 前端渲染不卡顿的效果
 [请用力戳戳戳戳戳戳戳戳戳戳戳戳戳戳戳我](https://jonhal.github.io/infinity-data-show/dist/) 
 
## 实现流程图
<img src='https://github.com/jonhal/infinity-data-show/blob/gh-pages/%E6%B5%81%E7%A8%8B%E5%9B%BE1.png'>
