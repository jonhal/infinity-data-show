
/**
 * @file infinityLoad.js
 * lujunhao@baidu.com
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    }
    else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else {
        // Browser globals (root is window)
        root.infinityLoad = factory();
    }
}(this, function () {
    let pageData = {
        pageSize: 25,
        lastIndex: 0,
        topIndex: 0,
        clientHeight: 56,
        paddingTop: 0,
        paddingBottom: 10
    };

    let state = {

    };

    let setState = function () {

    };

    let getScrollTop = function () {
        let scrollTop = 0;
        let bodyScrollTop = 0;
        let documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    };

    let getWindowHeight = function () {
        let windowHeight = 0;
        if (document.compatMode === 'CSS1Compat') {
            windowHeight = document.documentElement.clientHeight;
        }
        else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    };

    let getScrollHeight = function () {
        let scrollHeight = 0;
        let bodyScrollHeight = 0;
        let documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    };

    let getTopData = function (topIndex, pageData) {
        let pageSize = pageData.pageSize;
        let lastIndex = pageData.lastIndex;
        let data = pageData.data;
        let topData;
        let topDom = document.getElementById('topDom');

        if (topIndex >= 0) {
            let appendData = data.slice((topIndex - 1) * pageSize, (topIndex) * pageSize);
            topData = appendData.concat(pageData.curData);
            topData.splice(-(pageSize), pageSize);
        }
        pageData.lastIndex = pageData.lastIndex - 1;
        let newPaddingTop = pageData.paddingTop - pageSize * pageData.clientHeight;
        pageData.updataFn(topData || pageData.curData);
        topDom.style.paddingTop = newPaddingTop + 'px';
        pageData.paddingTop = newPaddingTop;
        pageData.curData = topData || pageData.curData;
    };

    let getEndData = function (lastIndex, pageData) {
        let pageSize = pageData.pageSize;
        let data = pageData.data;
        let totalPage = data.length / pageSize;
        let nextPage = lastIndex + 1;
        let prevPage = lastIndex - 1;
        let lastData;
        let spliceNum;
        let topDom = document.getElementById('topDom');
        if (totalPage >= nextPage && !pageData.end) {
            let appendData = data.slice(lastIndex * pageSize, nextPage * pageSize);
            lastData = pageData.curData.concat(appendData);
            console.log(lastData);
            let newPaddingTop = pageData.paddingTop + pageSize * pageData.clientHeight;
            topDom.style.paddingTop = newPaddingTop + 'px';
            pageData.paddingTop = newPaddingTop;
            pageData.end = false;
            pageData.lastIndex = lastIndex;
        }
        else if (totalPage > nextPage - 1 && !pageData.end) { // 处理数据最后的一部分
            let num = ((totalPage + '').split('.')[1] / 100) * pageSize;
            let appendData = data.slice(lastIndex * pageSize, num + lastIndex * pageSize);
            lastData = pageData.curData.concat(appendData);
            let newPaddingTop = pageData.paddingTop + pageSize * pageData.clientHeight;
            topDom.style.paddingTop = newPaddingTop + 'px';
            pageData.newPaddingTop = newPaddingTop;
            pageData.end = true;
        }

        if (prevPage > 3 && lastData) {
            lastData.splice(0, pageSize * 1);
            spliceNum = 3;
        }
        else {
            spliceNum = 0;
        }

        pageData.curData = lastData || pageData.curData;
        // state.lastIndex = lastIndex;
        pageData.spliceNum = spliceNum;
        pageData.updataFn(pageData.curData);
    };

    let makeDom = function (dom, pageData) {
        let topNode = document.createElement('div');
        topNode.style.paddingBottom = '300px';
        topNode.id = 'bottomDom';
        dom.appendChild(topNode);
        let bottomNode = document.createElement('div');
        bottomNode.style.paddingTop = '0px';
        bottomNode.id = 'topDom';
        dom.insertBefore(bottomNode, dom.firstChild);
    };

    return {
        init(options) {
            pageData = options.pageData;
            state = options.state;
            let scrollDom = pageData.rootDom || window;
            pageData.curData = pageData.data.slice(0, pageData.pageSize);
            pageData.paddingTop = 0;
            pageData.end = false;
            pageData.spliceNum = 0;
            pageData.updataFn = options.updataFn;
            makeDom(scrollDom);
            let topDom = document.getElementById('topDom');
            scrollDom.onscroll = function (e) {
                let lastIndex = pageData.lastIndex;
                let topIndex = pageData.topIndex;
                let scrollTop = getScrollTop();     
                console.log(e.srcElement.scrollTop);
                // if (scrollTop + getWindowHeight() > getScrollHeight() - 800) {
                if (e.srcElement.scrollTop - pageData.paddingTop > (pageData.paddingTop ? 1300 : 865)) {
                    console.log('in');
                    lastIndex++;
                    console.log(`lastIndex++ ${lastIndex}`);
                    getEndData(lastIndex, pageData);
                }
                // else if (getScrollTop() < state.paddingTop) {
                else if (e.srcElement.scrollTop < pageData.paddingTop) {
                    if (lastIndex > 4) {
                        getTopData(lastIndex - 4, pageData);
                    }
                    else {
                        topDom.style.paddingTop = '0px';
                        pageData.paddingTop = 0;
                    }
                }
            };
        }
    };
}));