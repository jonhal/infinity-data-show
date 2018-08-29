/**
 * @file inde.js 无线数据加载处理
 * @author simotophs@gmail.com
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DatePicker, Table, Divider, Tag } from 'antd';
import infinityLoad from './infinityLoad.js';


const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
}, {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
      </span>
    ),
}, {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="javascript:;">Invite {record.name}</a>
        <Divider type="vertical" />
        <a href="javascript:;">Delete</a>
      </span>
    ),
}];


let total = 5000;

let data = [];

for (let i = 0; i < total; i++) {
    data.push({
        key: i,
        name: 'John Brown',
        age: i,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer']
    });
}

class MyTable extends React.Component {
    constructor(props) {
        super(props);
        this.pageData = {
            pageSize: 25,
            lastIndex: 0,
            topIndex: 0,
            clientHeight: 56
        };
        this.state = {
            data,
            curData: data.slice(0, this.pageData.pageSize),
            spliceNum: 0,
            end: false,
            paddingTop: 0,
            paddingBottom: 300
        };
    }

    getScrollTop() {
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

    getScrollHeight() {
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

    getWindowHeight() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }

    componentDidMount() {
        infinityLoad.init({
            pageData: this.pageData,
            state: this.state,
            setState: data => {
                this.setState(data);
            }
        });
        // console.dir(a.run());
        // window.onscroll = function (e) {
        //     let lastIndex = this.pageData.lastIndex;
        //     let topIndex = this.pageData.topIndex;
        //     let scrollTop = this.getScrollTop()
        //     if (scrollTop + this.getWindowHeight() > this.getScrollHeight() - 500) {
        //         lastIndex++;
        //         this.getEndData(lastIndex, this.state.data);
        //         console.log(`lastIndex is ${lastIndex}`);
        //     } else if (this.getScrollTop() < this.state.paddingTop) {
        //         console.log(`this.getScrollTop() ${scrollTop}`)
        //         if (lastIndex > 4) {
        //             this.getTopData(lastIndex - 4, this.state.data);
        //         } else {
        //             this.setState({
        //                 paddingTop: 0
        //             });
        //         }
        //     }
        //     console.log(lastIndex);
        // }.bind(this);
    }

    getTopData(topIndex, data) {
      console.log(`topIndex ${topIndex}`);
      let pageSize = this.pageData.pageSize;
      let lastIndex = this.pageData.lastIndex;
      let topData;      
      if (topIndex > 0) {
        let appendData = data.slice((topIndex - 1) * pageSize, (topIndex) * pageSize);
        topData = appendData.concat(this.state.curData);
        topData.splice(-(pageSize), pageSize);
      }
      this.pageData.lastIndex = this.pageData.lastIndex - 1;
      this.setState({
          curData: topData || this.state.curData,
          paddingTop: this.state.paddingTop - pageSize * this.pageData.clientHeight
      });
    }

    getEndData(lastIndex, data) {
        let pageSize = this.pageData.pageSize;
        let totalPage = data.length / pageSize;
        let nextPage = lastIndex + 1;
        let prevPage = lastIndex - 1;
        let lastData;
        let spliceNum;
        if (totalPage >= nextPage && !this.state.end) {
            let appendData = data.slice(lastIndex * pageSize, nextPage * pageSize);
            lastData = this.state.curData.concat(appendData);
            console.log(lastData);
            this.setState({
                end: false,
                paddingTop: this.state.paddingTop + pageSize * this.pageData.clientHeight
            });
            this.pageData.lastIndex = lastIndex;
        } else if (totalPage > nextPage - 1 && !this.state.end) { // 处理数据最后的一部分
            let num = ((totalPage + '').split('.')[1] / 100) * pageSize;
            let appendData = data.slice(lastIndex * pageSize, num + lastIndex * pageSize);
            lastData = this.state.curData.concat(appendData);
            console.log(lastData);
            this.setState({
                end: true,
                paddingTop: this.state.paddingTop + num * this.pageData.clientHeight
            });
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


        this.setState({
            curData: lastData || this.state.curData,
            lastIndex,
            spliceNum
        });
    }

    render() {
        return (
            <div>
                <div style={{paddingTop: this.state.paddingTop}}></div>
                <Table columns={columns} dataSource={this.state.curData} pagination={false} />
                <div style={{paddingBottom: this.state.paddingBottom}}></div>
            </div>
        );
    }
}

ReactDOM.render(<MyTable />, document.getElementById('root'));
