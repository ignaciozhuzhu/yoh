'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	leftBoxClick,
	request,
	re_str,
	ws
} from './lib/common.js';
import {
	testLogin
} from './ajax/user.js';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import {
	LoadingBox
} from './components/Paging.js';

var MyForm = require('./components/drag/myForm.js');

$(document).ready(function() {
	//判断登陆与否
	testLogin("console.html");
	leftBoxClick("subscribe", 0, "subscribe");

});
var jsq = 0,
	jsq2 = 0,
	jsq3 = 0;
//var ws = new WebSocket("ws://192.168.2.135:8181");

var App = React.createClass({

	getInitialState: function() {
		return {
			arr: []
		}
	},
	swichRender: function(arr, func) {
		$("#dragboxes").empty();
		for (var i = 0, index = "", j = -1, k = -1, l = -1, c = 0; i < arr.length; i++) {
			if (arr[i].rank === 0) {
				index = "f";
				j++;
				c = j;
			} else if (arr[i].rank === 1) {
				index = "s";
				k++;
				c = k;
			} else if (arr[i].rank === 2) {
				index = "t";
				l++;
				c = l;
			}
			$("#dragboxes").append("<div id='box" + index + c + "'></div>")
			if (func)
				ReactDOM.render(
					<MyForm
				  id={i}
		          col="3"
		          name={arr[i].name}
		          mobile={arr[i].mobile}
		          doc={arr[i].doc}
		          time={arr[i].time}
		          project={arr[i].project}
		          pass={this.pass}
		          rank={arr[i].rank}  />,
					document.getElementById('box' + index + c)
				);
			else ReactDOM.render(
				<MyForm
				  id={i}
		          col="3"
		          name={arr[i].name}
		          mobile={arr[i].mobile}
		          doc={arr[i].doc}
		          time={arr[i].time}
		          project={arr[i].project}
		          rank={arr[i].rank}  />,
				document.getElementById('box' + index + c)
			);
		}
	},
	render2DidMount: function(arr) {
		this.swichRender(arr, 1);
	},
	pass: function(myarr) {
		//由于websocket与重复渲染造成次数增加,渲染页面会卡顿,所以这里设计了一个去重算法排除重复的render
		let len = myarr.length;
		jsq = jsq + 1;
		if (jsq % len === 0 && (jsq3 === 0 || jsq == jsq3)) {
			if (jsq3 == 0) jsq3 = len;
			jsq2 += 1;
			jsq3 += len * jsq2;
			this.swichRender(myarr, 0);
		}
	},
	componentDidMount: function() {
		$("#loading").hide();
		$("#loading_end").show();
		var o = this;

		getInitial();

		function getInitial() {
			var arr = [{
				"col": 3,
				"name": "小A",
				"mobile": "18550000005",
				"doc": "法医生",
				"time": "6:00-8:30",
				"project": "洗牙",
				"rank": 0
			}, {
				"col": 3,
				"name": "小B",
				"mobile": "18550000005",
				"doc": "赌医生",
				"time": "6:00-8:30",
				"project": "打牙",
				"rank": 0
			}, {
				"col": 3,
				"name": "小C",
				"mobile": "18550000005",
				"doc": "黑医生",
				"time": "6:00-8:30",
				"project": "刷牙",
				"rank": 0
			}, {
				"col": 3,
				"name": "小D",
				"mobile": "18550000005",
				"doc": "蓝医生",
				"time": "6:00-8:30",
				"project": "磨牙",
				"rank": 0
			}, {
				"col": 3,
				"name": "小E",
				"mobile": "18550000005",
				"doc": "白医生",
				"time": "6:00-8:30",
				"project": "磨牙",
				"rank": 0
			}]
			o.render2DidMount(arr);
		}

		//收到消息处理 开始
		ws.onmessage = function(e) {
			var data = JSON.parse(e.data);
			var message = data.message;
			o.pass(JSON.parse(message));
		}

		//收到消息处理 结束

	},
	render: function() {
		return (
			<div className="controlDiv"> <nav className="navbar navbar-inverse navbar-fixed-top" id="topMainBox">
				<TopBox />
				  </nav>
				    <div className="container content-middle">
				        <div className="row">
				            <div className="col-sm-3" id="leftMainBox">
				            <LeftBox />
				            </div>

				            <div className="col-sm-9" id="loading_end">
				                <div className="bmargin1">
				                    <div>
				                        <div className="page-title">前台工作台</div>
				                    </div>
				                </div>
				                <div id="content">
									<div className="container-fluid">
										<div className="bs-docs-grid">
											<div className="row show-grid">
											  <div className="col-md-9">
												  <div className="col-md-4 text-center myborder" id="iclick">今日预约</div>
												  <div className="col-md-4 text-center myborder" id="iclick2">今日就诊</div>
												  <div className="col-md-4 text-center myborder" id="iclick3">今日回访</div>
												  <div id ="dragboxes"></div>
											  </div>
											  <div className="col-md-3 text-center myborder" style={{backgroundColor:"#ccc"}}>快捷面板</div>

											</div>
										</div>
									</div>
				                </div>
				        	</div>
				    	</div>
				 			<LoadingBox />
					</div>
			</div>)
	}
});



ReactDOM.render(
	<App/>,
	document.getElementById('app')
);