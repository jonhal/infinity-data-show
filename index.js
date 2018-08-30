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
            clientHeight: 56,
            data: data
        };
        this.state = {
            data,
            curData: data.slice(0, this.pageData.pageSize)
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
        var rootDom = document.querySelector('.root');
        this.pageData.rootDom = rootDom;
        infinityLoad.init({
            pageData: this.pageData,
            updataFn: data => this.setState({
                curData: data
            })
        });
    }

    render() {
        return (
            <div className="root" style={{'overflow': 'scroll', 'height': 650}}>
                <Table columns={columns} dataSource={this.state.curData} pagination={false} />
            </div>
        );
    }
}

ReactDOM.render(<MyTable />, document.getElementById('root'));
