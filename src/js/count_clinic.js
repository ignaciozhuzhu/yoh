'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	MoneyConversion,
	MoneyValue,
	toDecimal,
	leftBoxClick,
	getCurrentMonthFirst,
	getCurrentMonthLast
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import {
	testLogin
} from './ajax/user.js';

import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import Top_Area from './components/Top_Area.js';

var startdate = "";
var enddate = "";
var type = "D";
var pageNum = 1; //当前页
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
var dataList = [];
var sum = 0;
var date = "0";
var section = "D";

$(document).ready(function() {
	//判断登陆与否
	testLogin("count_clinic.html");
	leftBoxClick("collapseCount", 0, "count");
});

var countclinicAll = function(startdate, enddate, type) {
	$.ajax({
		url: serviceurl + "statistic/totalNum",
		type: "get",
		dataType: "json",
		data: {
			"timeid": date,
			"type": type
		},
		contentType: "application/json",
		cache: false,
		async: false,
		success: function(dt) {
			console.log("all" + JSON.stringify(dt));
			if (dt.status == "success") {
				var Countclinic = dt.data;
				var totalResult = "<td>总和</td>" +
					"<td>" + Countclinic.totalnum + "</td>" +
					"<td>" + "￥ " + toDecimal(MoneyConversion(Countclinic.totalmoney)).toFixed(2) + "</td>" +
					"<td>" + Countclinic.twonum + "</td>" +
					"<td>" + Countclinic.firstnum + "</td>" +
					"<td>" + MoneyValue(Countclinic.rate).toFixed(2) + "%</td>";
				$("#CountClinicAll").html("");
				$("#CountClinicAll").append(totalResult);
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

var refleshData = function(pageNum) {
	var dt = new Date();
	if (date == "0") {
		startdate = '2000-01-01';
		enddate = '2020-01-01';
	} else if (date == "1") {
		startdate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
		enddate = startdate;
	} else if (date == "2") {
		dt = new Date(dt.getTime() + 1 * 24 * 60 * 60 * 1000);
		startdate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
		enddate = startdate;
	} else if (date == "3") {
		dt = new Date(dt.getTime() - ((dt.getDay() - 1) * 24 * 60 * 60 * 1000));
		startdate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
		dt = new Date(dt.getTime() + 6 * 24 * 60 * 60 * 1000);
		enddate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
	} else if (date == "4") {
		dt = getCurrentMonthFirst();
		startdate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
		dt = getCurrentMonthLast();
		enddate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
	}

	var type = section;
	$.ajax({
		url: serviceurl + "statistic/listHosStatistic",
		type: "get",
		dataType: "json",
		data: {
			"timeid": date,
			"type": type,
			"currentPage": pageNum
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log("count" + JSON.stringify(dt));
			if (dt.status == "success") {
				//隐藏loading
				$("#loading").hide();

				dataList = dt.data;
				sum = dt.map.page.totalCount;
				$("#listSum").html(sum);
				//计算总和
				if (sum != 0) {
					countclinicAll(startdate, enddate, type);
				}
				if (sum % pageContent == 0) {
					pageAllnum = parseInt(sum / pageContent);
				} else {
					pageAllnum = parseInt(sum / pageContent) + 1;
				}
				var timerProcess = setTimeout(function() {
					if ($("#previousPage")[0] != undefined && $("#nextPage")[0] != undefined) {
						//分页显示判断
						if (pageAllnum == 1) {
							$("#previousPage").addClass("hide");
							$("#nextPage").addClass("hide");
							$("#CountClinicAll").show();
						} else if (pageNum == pageAllnum) {
							$("#previousPage").removeClass("hide");
							$("#nextPage").addClass("hide");
							$("#CountClinicAll").show();
						} else if (pageNum == 1) {
							$("#previousPage").addClass("hide");
							$("#nextPage").removeClass("hide");
							$("#CountClinicAll").hide();
						} else {
							$("#previousPage").removeClass("hide");
							$("#nextPage").removeClass("hide");
							$("#CountClinicAll").hide();
						}
						clearTimeout(timerProcess);
					}
				}, 10);
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
	searchClick: function(e) {
		$.each(e.target.parentElement.children, function(idx, item) {
			item.className = "filter-item";
		});
		e.target.className = "filter-item active countbg-color";
		if (e.target.name == "condition_Date") {
			date = e.target.rel;
		} else if (e.target.name == "condition_Section") {
			section = e.target.rel;
		}
		refleshData(pageNum);
		this.props.onCommentSubmit(dataList);
	},

	render: function() {
		return (
			<div className="list-group">
				<div className="list-group-item">
					<div className="filter">
						<div className="filter-label pull-left">日期</div>
						<div className="filter-item-wrap">
							<a href="#" name="condition_Date" className="filter-item active countbg-color" rel="0" onClick={this.searchClick}>不限</a>
							<a href="#" name="condition_Date" className="filter-item" rel="1" onClick={this.searchClick}>今天</a>
							<a href="#" name="condition_Date" className="filter-item" rel="3" onClick={this.searchClick}>本周</a>
							<a href="#" name="condition_Date" className="filter-item" rel="4" onClick={this.searchClick}>本月</a>
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">时间单位</div>
						<div className="filter-item-wrap">
							<a href="#" name="condition_Section" rel="D" className="filter-item active countbg-color" onClick={this.searchClick}>按日</a>
							<a href="#" name="condition_Section" rel="M" className="filter-item" onClick={this.searchClick}>按月</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var List_Area = React.createClass({
	componentDidMount: function() {
		if (pageAllnum == 1) {
			$("#previousPage").addClass("hide");
			$("#nextPage").addClass("hide");
		} else {
			$("#previousPage").addClass("hide");
			$("#nextPage").removeClass("hide");
		}
		if (sum != 0) {
			countclinicAll(startdate, enddate, type);
		}
	},
	nextClick: function() {
		pageNum = pageNum + 1;
		refleshData(pageNum);
		this.props.onCommentSubmit(dataList);
	},
	prevClick: function() {
		pageNum = pageNum - 1;
		pageNum = pageNum < 1 ? 1 : pageNum;
		refleshData(pageNum);
		this.props.onCommentSubmit(dataList);
	},
	render: function() {
		if (this.props.data.length > 0) {
			var nodes = this.props.data.map(function(comment) {
				return (
					<Comment 
		          	key={comment.date_id}
		          	date_id={comment.date_id}
		          	totalnum={comment.totalnum}
		          	totalmoney={"￥ "+toDecimal(MoneyConversion(comment.totalmoney)).toFixed(2)}
		          	twonum={comment.twonum}
		          	firstnum={comment.firstnum}
		          	rate={MoneyValue(comment.rate)}
		          >
		          </Comment>
				);
			});
			return (
				<div>
					<div className="panel panel-primary no-border">
						<div className="panel-heading count-head-border">
							<div className="row">
								<div className="col-sm-8">
									<div className="color-black line-height-30">
										<span>共有</span>
										<span id="listSum">{sum}</span>
										<span>条记录</span>
									</div>
								</div>
								<div className="col-sm-4">
									<div className="input-group input-group-sm">
										
									</div>
								</div>
							</div>
						</div>
						<table className="table table-hover table-striped bmargin0 pointer" id="CountClinicList">
							<tbody>
								<tr>
									<td>日期</td>
									<td>总人数</td>
									<td>总收入</td>
									<td>复诊人数</td>
									<td>初诊人数</td>
									<td>新诊占比</td>
								</tr>
								{nodes}
								<tr id="CountClinicAll">
								</tr>
							</tbody>
						</table>
					</div>
					<nav>
						<ul className="pager">
							<li className="previous" id="previousPage"><a href="#" onClick={this.prevClick}>上一页</a></li>
							<li className="next" id="nextPage"><a href="#" onClick={this.nextClick}>下一页</a></li>
						</ul>
					</nav>
				</div>
			);
		} else {
			return (
				<div>
					<div className="panel panel-primary no-border">
						<div className="panel-heading count-head-border">
							<div className="row">
								<div className="col-sm-8">
									<div className="color-black line-height-30">
										<span>共有</span>
										<span id="listSum">{sum}</span>
										<span>条记录</span>
									</div>
								</div>
								<div className="col-sm-4">
									<div className="input-group input-group-sm">
										
									</div>
								</div>
							</div>
						</div>

						<table className="table table-hover table-striped bmargin0 pointer" id="CountClinicList">
							<tbody>
								<tr>
									<td>日期</td>
									<td>总人数</td>
									<td>总收入</td>
									<td>复诊人数</td>
									<td>初诊人数</td>
									<td>新诊占比</td>
								</tr>
							</tbody>
						</table>
						<table className="table table-hover table-striped bmargin0 pointer">
							<tbody>
								<tr>
									<td className="text-center">暂无数据</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			);
		}
	}
});
var Comment = React.createClass({
	render: function() {
		return (
			<tr>
				<td>{this.props.date_id}</td>
				<td>{this.props.totalnum}</td>
				<td>{this.props.totalmoney}</td>
				<td>{this.props.twonum}</td>
				<td>{this.props.firstnum}</td>
				<td>{this.props.rate}%</td>
			</tr>
		);
	}
});


var MainBox = React.createClass({
	getInitialState: function() {
		refleshData(pageNum);
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
	      	<Top_Area titleName="诊间统计" btnDisplay="none" btnText="导出excel" btnColor="border-ddd hide" link="reservation_add" />
	        <Condition_Area onCommentSubmit={this.handleCommentSubmit}/>
	        <List_Area onCommentSubmit={this.handleCommentSubmit} data={this.state.data} />
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