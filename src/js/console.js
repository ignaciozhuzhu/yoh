'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	checknull,
	leftBoxClick,
	request,
	re_str
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import {
	testLogin
} from './ajax/user.js';
import Vld from 'validator';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import {
	PagingSearch,
	PagingPN,
	LoadingBox
} from './components/Paging.js';

var MyForm = require('./components/drag/myForm.js');
var MyForm2 = require('./components/drag/myForm.js');

$(document).ready(function() {
	//判断登陆与否
	testLogin("console.html");
	leftBoxClick("subscribe", 0, "subscribe");

});

var App = React.createClass({

	componentDidMount: function() {
		$("#loading").hide();
		$("#loading_end").show();

		ReactDOM.render(
			<MyForm
          col="3"
          name="陈永仁"
          mobile="18500000000"
          doc="黄警官"
          time="18:00-18:30"
          project="拔牙" />,
			document.getElementById('box')
		);

		ReactDOM.render(
			<MyForm2
          col="3"
          name="小王"
          mobile="18550000000"
          doc="张医生"
          time="19:00-18:30"
          project="拔牙" />,
			document.getElementById('box2')
		);
		ReactDOM.render(
			<MyForm
          col="3"
          name="小黑"
          mobile="18550000000"
          doc="马医生"
          time="19:00-18:30"
          project="注牙" />,
			document.getElementById('box3')
		);
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
												  <div id="box">
												  </div>
												  <div id="box2">
												  </div>
												  <div id="box3">
												  </div>
											  </div>
											  <div className="col-md-3 text-center myborder">快捷面板</div>

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