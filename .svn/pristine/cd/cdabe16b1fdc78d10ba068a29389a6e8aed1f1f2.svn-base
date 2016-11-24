'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	getLocalTime,
	request,
	leftBoxClick
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import Top_Area from './components/Top_Area.js';

var startdate = "2016-04-19";
var enddate = "2016-06-21";
var doctorid = "";
var date = "1"; //date查询日期
var dataList = [];
var sum = 0;
var doctorname = "";
$(document).ready(function() {
	leftBoxClick("collapseCount", 1, "count");
});
var refleshData = function(currentPage) {
	doctorid = request("doctorID");
	//医生绩效详情
	$.ajax({
		url: serviceurl + "statistic/performanceDetail",
		type: "get",
		dataType: "json",
		data: {
			"startDate": startdate,
			"endDate": enddate,
			"doctorid": doctorid
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log("doctorcount" + JSON.stringify(dt));
			if (dt.status == "success") {
				dataList = dt.data;
				$.each(dt.map, function(index, item) {
					sum = item.totalCount;
				});
			} else {
				toast.show(dt.message);
				return;
			}
		},

		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
};

var Condition_Area = React.createClass({
	getInitialState: function() {
		refleshData(1);
		return {
			data: dataList
		};
	},
	searchClick: function(e) {
		$.each(e.target.parentElement.children, function(idx, item) {
			item.className = "filter-item";
		});
		e.target.className = "filter-item active";
		if (e.target.name == "condition_Date") {
			date = e.target.rel;
		}
		refleshData(1);
		this.props.onCommentSubmit(dataList);
	},
	render: function() {
		return (
			<div className="list-group">
				<div className="list-group-item">
					<div className="filter">
						<div className="filter-label pull-left">日期</div>
						<div className="filter-item-wrap">
							<a className="filter-item" name="condition_Date" rel="0" onClick={this.searchClick}>不限</a>
							<a className="filter-item active" name="condition_Date" rel="1" onClick={this.searchClick}>今天</a>
							<a className="filter-item" name="condition_Date" rel="3" onClick={this.searchClick}>本周</a>
							<a className="filter-item" name="condition_Date" rel="4" onClick={this.searchClick}>本月</a>
							<a className="filter-item" onClick={this.chooseData}>选择日期</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var List_Area = React.createClass({
	getInitialState: function() {
		doctorname = request("doctorname");
		return {
			data: []
		};
	},
	render: function() {
		var nodes = this.props.data.map(function(comment) {
			return (
				<Comment 
	          	key={comment.orderid}
	          	createtime={getLocalTime(comment.createtime).split(" ")[0]}
	          	orderid={comment.orderid}
	          	servicename={comment.servicename}
	          	amount={comment.amount}
	          	handlerid={comment.handlerid}
	          	reduce={comment.reduce}
	          	allprice={comment.allprice}
	          >
	          </Comment>
			);
		});
		return (
			<div className="panel panel-default no-border">
                <div className="panel-heading bg-blue">
                    <div className="row">
                        <div className="col-sm-4 color-blue ">
                            <span>医生：</span>
                            <span>{doctorname}</span>
                        </div>
                        <div className="col-sm-8">
                            <div className="color-blue text-right">
                                <span>共有</span>
                                <span id="listSum">{sum}</span>
                                <span>条记录</span>
                            </div>
                        </div>
                    </div>
                </div>
				<table className="table table-striped">
					<tbody>
						<tr>
							<td>日期</td>
							<td>订单编号</td>
							<td>服务项目</td>
							<td>数量</td>
							<td>处理人员</td>
							<td>优惠</td>
							<td>总价格</td>
						</tr>
						{nodes}
					</tbody>
				</table>
            </div>
		);
	}
});

var Comment = React.createClass({
	render: function() {
		return (
			<tr>
                <td>{this.props.createtime}</td>
                <td>{this.props.orderid}</td>
                <td>{this.props.servicename}</td>
                <td>{this.props.amount}</td>
                <td>{this.props.handlerid}</td>
                <td>{this.props.reduce}</td>
                <td>{this.props.allprice}</td>
            </tr>
		);
	}
});

var MainBox = React.createClass({
	getInitialState: function() {
		refleshData(1);
		return {
			data: dataList
		};
	},
	componentDidMount: function() {
		this.setState({
			data: dataList
		});
	},
	handleCommentSubmit: function(comment) {
		this.setState({
			data: comment
		});
	},
	render: function() {
		return (
			<div>
      	<Top_Area titleName="医生绩效详情" />
        <Condition_Area onCommentSubmit={this.handleCommentSubmit}/>
        <List_Area onCommentSubmit={this.handleCommentSubmit} data={this.state.data} />
        <Hidden_Area />
      </div>
		);
	}
});

var Hidden_Area = React.createClass({
	render: function() {
		return (
			<div>

			</div>
		);
	}
});

ReactDOM.render(
	<MainBox  data={dataList} />,
	document.getElementById('content')
);

ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);