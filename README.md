# infinity-data-show
解决后端给出几万条大数据之后，前端列表dom渲染卡顿，不流畅

## 解决问题
主要解决了后端一次性给出大量数据，前端在一次渲染中，大量的dom插入，使得页面加载缓慢，甚至卡死。

## 原理
通过可视view，可视上一层view，可视下一层view的操作，来减少大量dom的压力。
不过多大的数据量，页面只有这三个view的数据，通过滚动条的判断，对这三个view里面的数据进行动态变化，从而达到大数据量的情况下， 前端渲染不卡顿的效果

## 实现流程图
```mermaid
graph TB
getData(获取一次页面所有的数据数据 缓存到内存中) --> showPage(根据配置展示一屏或者几屛的数据)
showPage --> mouseDown(鼠标向下滚动)
showPage --> mouseUp(鼠标向上滚动)
mouseDown --> isMoreData{是否还有新的数据}
isMoreData{是否还有新的数据} --有--> addData(递增下一屏数据 切割缓存的数据)
isMoreData --没有--> 不加载新的数据
addData(递增下一屏数据) --> removeData(删除第一屏的数据 以保证dom的总数量不增加)
removeData --> addPadding(计算出删除dom的高度 插入一个相同高度的dom 让滚动条的长度和真实情况相同)
mouseUp --> judgeTop(判断鼠标离顶部的距离是否足够)
judgeTop --已经到了足够的高度--> loadTopData(计算当前页数 取出缓冲中的数据添加到页面中 并删除底部一屏数据 已保证dom的总数量不增加)
loadTopData --> removePadding(计算出增加的dmo高度 用先前插入的dom的高度减去这个dom的高度 )
judgeTop --已经到达了数据的第一份 --> 不加载数据