'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	leftBoxClick,
	request,
	re_str
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

var App = React.createClass({

	getInitialState: function() {
		return {
			ff: 0
		}
	},
	render2DidMount: function(arr) {
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
			$(".col-md-9").append("<div id='box" + index + c + "'></div>")
			ReactDOM.render(
				<MyForm
		          col="3"
		          name={arr[i].name}
		          mobile={arr[i].mobile}
		          doc={arr[i].doc}
		          time={arr[i].time}
		          project={arr[i].project}
		          rank={arr[i].rank} />,
				document.getElementById('box' + index + c)
			);
		}
	},
	componentDidMount: function() {
		$("#loading").hide();
		$("#loading_end").show();

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
			"rank": 1
		}, {
			"col": 3,
			"name": "小C",
			"mobile": "18550000005",
			"doc": "黑医生",
			"time": "6:00-8:30",
			"project": "刷牙",
			"rank": 1
		}, {
			"col": 3,
			"name": "小D",
			"mobile": "18550000005",
			"doc": "蓝医生",
			"time": "6:00-8:30",
			"project": "磨牙",
			"rank": 2
		}, {
			"col": 3,
			"name": "小E",
			"mobile": "18550000005",
			"doc": "白医生",
			"time": "6:00-8:30",
			"project": "磨牙",
			"rank": 0
		}]

		this.render2DidMount(arr);

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
												  <div className="col-md-4 text-center myborder">今日预约</div>
												  <div className="col-md-4 text-center myborder">今日就诊</div>
												  <div className="col-md-4 text-center myborder">今日回访</div>
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