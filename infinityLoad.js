
/**
 * infinityLoad.js
 * 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
        module.exports = factory();
    } else {
		// Browser globals (root is window)
        root.infinityLoad = factory();
    }
}(this, function () {
    var pageData = {
        pageSize: 25,
        lastIndex: 0,
        topIndex: 0,
        clientHeight: 56
    };

    var state = {

    };
    
    var setState = function() {

    };

    var getScrollTop = function () {
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
	}

	var getWindowHeight = function () {
		var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
	}

	var getScrollHeight = function () {
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
	}

	var getTopData = function(topIndex, data) {
        console.log(`topIndex ${topIndex}`);
        let pageSize = pageData.pageSize;
        let lastIndex = pageData.lastIndex;
        let topData;      
        if (topIndex >= 0) {
            let appendData = data.slice((topIndex - 1) * pageSize, (topIndex) * pageSize);
            topData = appendData.concat(state.curData);
            topData.splice(-(pageSize), pageSize);
        }
        pageData.lastIndex = pageData.lastIndex - 1;
        let newPaddingTop = state.paddingTop - pageSize * pageData.clientHeight;
        setState({
            curData: topData || state.curData,
            paddingTop: newPaddingTop
        });
        state.paddingTop = newPaddingTop;
        state.curData = topData || state.curData;
	}

    var getEndData =function (lastIndex, data) {
        let pageSize = pageData.pageSize;
        let totalPage = data.length / pageSize;
        let nextPage = lastIndex + 1;
        let prevPage = lastIndex - 1;
        let lastData;
        let spliceNum;
        if (totalPage >= nextPage && !state.end) {
            let appendData = data.slice(lastIndex * pageSize, nextPage * pageSize);
            lastData = state.curData.concat(appendData);
            console.log(lastData);
            let newPaddingTop = state.paddingTop + pageSize * pageData.clientHeight
            setState({
                end: false,
                paddingTop: newPaddingTop
            });
            state.paddingTop = newPaddingTop;
            state.end = false;
            pageData.lastIndex = lastIndex;
        } else if (totalPage > nextPage - 1 && !state.end) { // 处理数据最后的一部分
            let num = ((totalPage + '').split('.')[1] / 100) * pageSize;
            let appendData = data.slice(lastIndex * pageSize, num + lastIndex * pageSize);
            lastData = state.curData.concat(appendData);
            console.log(lastData);
            let newPaddingTop = state.paddingTop + pageSize * pageData.clientHeight;
            setState({
                end: true,
                paddingTop: newPaddingTop
            });
            state.newPaddingTop = newPaddingTop;
            state.end = true;
        }

        if (prevPage > 3 && lastData) {
            console.log('in');
            console.dir(prevPage * pageSize)
            console.log(pageSize * 2)
            console.log('before');
            console.log(lastData);
            debugger;
            lastData.splice(0, pageSize * 1);
            console.log('after');
            console.log(lastData);
            spliceNum = 3;
        } else {
            spliceNum = 0;
        }

        state.curData = lastData || state.curData;
        state.lastIndex = lastIndex;
        state.spliceNum = spliceNum;
        setState({
            curData: state.curData,
            lastIndex,
            spliceNum
        });
    };

    return {
        init: function (options) {
            pageData = options.pageData;
            state = options.state;
            setState = options.setState;
            window.onscroll = function (e) {
                var lastIndex = pageData.lastIndex;
				var topIndex = pageData.topIndex;
                var scrollTop = getScrollTop();
                console.log(`this.getScrollTop() ${scrollTop}`);
                if (scrollTop + getWindowHeight() > getScrollHeight() - 800) {
                    lastIndex++;
                    getEndData(lastIndex, state.data);
                    console.log(`lastIndex is ${lastIndex}`);
                } else if (getScrollTop() < state.paddingTop) {
                    if (lastIndex > 4) {
                        getTopData(lastIndex - 4, state.data);
					} else {
                        setState({
                            paddingTop: 0
                        });
                        state.paddingTop = 0;
                    }
                }
                console.log(lastIndex);
            };
        }
    };

}));