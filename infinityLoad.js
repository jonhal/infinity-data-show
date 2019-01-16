/**
 * @file infinityLoad.js
 * simotophs@gmail.com
 * 解决滚动框一次性加载大量数据会造成卡顿的情况，采取批量加载的方式，当用户展示满4页的数据之后再有新的数据
 * 那么就增加第五页数据的同时会删除第一页的数据，始终保持滚动框内只有4页数据的情况，相反往上加载的时候也需要
 * 增加头部数据同时减去底部数据。同时，滚动条要和真实情况匹配，比如用户加载了20页的数据，那么需要通过paddingtop撑起
 * 一块空白区域，去让滚动条变小
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    }
    else {
        root.infinityLoad = factory();
    }
}(this, function () {
    let pageData = {
        pageSize: 25,
        lastIndex: 0,
        topIndex: 0,
        clientHeight: 38,
        paddingTop: 0,
        paddingBottom: 10,
        topNode: '',
        bottomNode: '',
        end: false,
        lastSpliceNum: 0
    };
    /**
     * 获取头部数据 删除尾部数据 减少页面高度，使滚动条与实际情况相符
     * @param {number} topIndex 前一页的pageindex
     */
    let getTopData = function (topIndex) {
        let {data, pageSize, lastSpliceNum} = pageData;
        let topData = [];
        let topDom = document.getElementById('topDom');
        let bottomDom = document.getElementById('bottomDom');
        let newPaddingTop = 0;
        // 头部加一个pagesize的数据
        let appendData = data.slice((topIndex - 1) * pageSize, (topIndex) * pageSize);
        // 如果是减少一页数据请情况下需要减掉的paddingtop，也是为了保持滚动条与真实情况下的一致性。
        let basePaddingTop = pageData.paddingTop - pageSize * pageData.clientHeight;
        topData = appendData.concat(pageData.curData);
        pageData.lastIndex = pageData.lastIndex - 1;
        if (topIndex >= 0) {
            // 如果是在底部，那么去除一页加上多余的lastSpliceNum的数据，不然就清除底部的一个pagesize数据
            if (pageData.end) {
                topData.splice(-(pageSize + lastSpliceNum), pageSize);
            }
            else {
                topData.splice(-(pageSize), pageSize);
            }
        }
        // 如果是在底部，那么头部paddingtop需要去掉一页加上多余的lastSpliceNum的数据，不然就减少一个pagesize的padding
        if (pageData.end) {
            newPaddingTop = basePaddingTop - pageData.lastSpliceNum * pageData.clientHeight;
        }
        else {
            newPaddingTop = basePaddingTop;
        }
        // 更新地回调
        if (topData.length) {
            pageData.updataFn(topData);
        }
        topDom.style.paddingTop = newPaddingTop + 'px';
        // 恢复paddingbottom 和 isend
        bottomDom.style.paddingBottom = 300 + 'px';
        // 更新end和当前数据的情况
        pageData.end = false;
        pageData.paddingTop = newPaddingTop;
        pageData.curData = topData;
    };
    /**
     * 获取底部的更新数据 删除头部数据 加大页面高度，使滚动条与实际情况相符
     * @param {number} lastIndex 最后一页的数据
     */
    let getEndData = function (lastIndex) {
        let {data, pageSize} = pageData;
        let totalPage = data.length / pageSize;
        let nextPage = lastIndex + 1;
        let prevPage = lastIndex - 1;
        let lastData = [];
        let lastSpliceNum = 0;
        let length = 0;
        let num = 0;
        let appendData = [];
        let newPaddingTop = '0px';
        let topDom = document.getElementById('topDom');
        let bottomDom = document.getElementById('bottomDom');
        // 处理最后一页后面还有数据的数据的情况
        if (totalPage >= lastIndex) {
            // 获得下一块要加载的数据
            appendData = data.slice(lastIndex * pageSize, nextPage * pageSize);
            lastData = pageData.curData.concat(appendData);
            // 撑起滚动条高度，算出新增的paddingTop，clientHeight是单个行的高度，pageSize是一批多少行
            newPaddingTop = pageData.paddingTop + pageSize * pageData.clientHeight;
            // 更新paddingTop 和 lastIndex
            topDom.style.paddingTop = newPaddingTop + 'px';
            pageData.paddingTop = newPaddingTop;
            pageData.lastIndex = lastIndex;
        }
        // 处理在总页数和最后一页数之间不满一页的情况。比如totalPage是5.5，lastIndex是6，那么要加载6-5.5=0.5的那块数据会进入这个逻辑
        else if (totalPage > lastIndex - 1) { // 处理数据最后的一部分
            length = data.length;
            // 总得数据长度减掉最后一页之前所有的数据长度，等于最后一部分的数据长度
            num = length - lastIndex * pageSize;
            appendData = data.slice(lastIndex * pageSize, length);
            lastData = pageData.curData.concat(appendData);
            // 撑起滚动条高度，算出新增的paddingTop，clientHeight是单个行的高度，pageSize是一批多少行
            newPaddingTop = pageData.paddingTop + num * pageData.clientHeight;
            topDom.style.paddingTop = newPaddingTop + 'px';
            pageData.paddingTop = newPaddingTop;
            pageData.end = true;
            // 更新下最后剩余的个数，为了从底部往上滚动的时候，能计算出往上滚动时需要去掉的paddngTop高度
            lastSpliceNum = num;
            bottomDom.style.paddingBottom = 0;
        }
        // 因为数据往底部增加了，为了保证滚动顺畅，需要判断是不是去掉头部多余的数据，如果page没到3则数据不去除
        if (prevPage > 3 && lastData) {
            // 如果到底部了那么头部减去的数量就是前面保存的lastSpliceNum，其他情况下头部减去一个pageSize就可以了
            pageData.end ? lastData.splice(0, lastSpliceNum) : lastData.splice(0, pageSize * 1);
        }
        // 将lastData复制到curData作为保存
        pageData.curData = lastData || pageData.curData;
        // 如果是最后有剩余的不是加载一个pagesize数据的情况，保留剩余的num
        pageData.lastSpliceNum = lastSpliceNum;
        // 更新完成之后暴露出去一个回调
        if (pageData.curData.length && pageData.updataFn) {
            pageData.updataFn(pageData.curData);
        }
    };
    /**
     * 在dom的头部和底部插入两个dom
     * @param {Object} dom 需要被插入的外层dom
     * @param {Object} pageData 比source优先级高的json，如果内容相同，会覆盖source的json
     */
    let makeTopAndBottomDom = function (dom) {
        pageData.topNode = document.createElement('div');
        pageData.topNode.style.paddingBottom = '300px';
        pageData.topNode.id = 'bottomDom';
        dom.appendChild(pageData.topNode);
        pageData.bottomNode = document.createElement('div');
        pageData.bottomNode.style.paddingTop = '0px';
        pageData.bottomNode.id = 'topDom';
        dom.insertBefore(pageData.bottomNode, dom.firstChild);
    };
    /**
     * 监听滚动事件，判断什么时候到底还是到顶部，处理各自的逻辑代码。
     */
    let scrollEvent = function () {
        let {scrollDom: {scrollHeight, clientHeight, scrollTop}} = pageData;
        let topDom = document.getElementById('topDom');
        // 读取当前最后一页
        let lastIndex = pageData.lastIndex;
        // awayFromButtom 一行的clientHeight * 6 是一页的距离 * 4 展示4页 去掉底部的paddingbottom
        // 允许滚动条内容是4页，每页6个数据，超过的情况下，会增加底部的内容，去掉头部的内容
        let awayFromButtom = pageData.clientHeight * 6 * 4 - 300;
        // 滚动条离底部并且还有数据的时候调用getEndData加载新的底部数据
        if ((scrollTop + clientHeight > scrollHeight - awayFromButtom) && !pageData.end) {
            // 最后一页自增1
            lastIndex++;
            // 获取底部数据
            getEndData(lastIndex);
        }
        // 加载头部数据的判断
        else if (scrollTop < pageData.paddingTop) {
            // 如果当前页数大于4页，那么才加载头部数据
            if (lastIndex > 4) {
                // 获取当前情况下加载的是最后一页的前4页
                getTopData(lastIndex - 4);
            }
            // 小于4页的情况，清空头部的padding，保持滚动条高度和实际情况相同
            else {
                topDom.style.paddingTop = '0px';
                pageData.paddingTop = 0;
            }
        }
    };
    /**
     * josn合并，target覆盖source,直接修改source对象，这边没考虑子对象又是json的情况
     * @param {Object} source 源json，会被直接修改
     * @param {Object} target 比source优先级高的json，如果内容相同，会覆盖source的json
     */
    let combineJson = function (source, target) {
        for (let key in target) {
            source[key] = target[key];
        }
    };
    return {
        init(options) {
            // 传入配置文件
            combineJson(pageData, options.pageData);
            // 配置第一页展示的数据
            pageData.curData = pageData.data.slice(0, pageData.pageSize);
            // 配置监听滚动的父级框
            pageData.scrollDom = pageData.rootDom || window;
            // 每次更新之后的回调
            pageData.updataFn = options.updataFn;
            // 在父级框的上设置上下的dom，因为加载新增的dom之后会删除掉一部分的dom
            // 所以需要计算出删掉的总得高度，把滚动条成搞，下面的dom主要为了不滚到底加载数据
            makeTopAndBottomDom(pageData.scrollDom);
            // 加载滚动监听事件
            pageData.scrollDom.addEventListener('scroll', scrollEvent);
        },
        /**
         * 更新变量
         * @param {Object} data 数据源
        */
        updateSourceData(data) {
            pageData.data = data;
        },
        /**
         * 获取改变后的所有数据
        */
        getAllData() {
            return pageData.data;
        },
        /**
         * 结束滚动
        */
        stopInfinity() {
            if (!pageData.scrollDom) {
                return;
            }
            // 取消监听事件，去掉头部和底部的bottom
            pageData.scrollDom.removeEventListener('scroll', scrollEvent);
            pageData.topNode.style.display = 'none';
            pageData.bottomNode.style.display = 'none';
        },
        /**
         * 开启滚动
        */
        startInfinity() {
            if (!pageData.scrollDom) {
                return;
            }
            // 为了保证不重复滚动，开启滚动前先停止滚动
            this.stopInfinity();
            pageData.scrollDom.addEventListener('scroll', scrollEvent);
            pageData.topNode.style.display = 'block';
            pageData.bottomNode.style.display = 'block';
        }
    };
}));
