'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	MoneyConversion,
	toDecimal,
	leftBoxClick,
	getCurrentMonthFirst,
	getCurrentMonthLast,
	request,
	re_str
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

var dataList = [];
var docList = [];
var sum = 0;
var startdate = "";
var enddate = "";
var date = "1"; //date查询日期
var doctorID = ""; //doctorID选择的医生
var searchText = ""; //searchText文本框的内容
var pageNum = 1; //当前页
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
$(document).ready(function() {
	//判断登陆与否
	testLogin("count_doctor.html");
	leftBoxClick("collapseCount", 1, "count");
});
//获取列表信息
var refleshData = function(currentPage) {
	var dt = new Date();
	if (date == "1") {
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

	var _params = {
		"startDate": startdate,
		"endDate": enddate,
		"doctorid": doctorID,
		"keyvalue": $("#searchText").val()
	};
	$.ajax({
		url: serviceurl + "statistic/performance",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				dataList = dt.data;
				sum = dt.map.page.totalCount;
				$("#listSum").html(sum);
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
						} else if (pageNum == pageAllnum) {
							$("#previousPage").removeClass("hide");
							$("#nextPage").addClass("hide");
						} else if (pageNum == 1) {
							$("#previousPage").addClass("hide");
							$("#nextPage").removeClass("hide");
						} else {
							$("#previousPage").removeClass("hide");
							$("#nextPage").removeClass("hide");
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
	getInitialState: function() {
		//refleshData(1);
		return {
			data: dataList
		};
	},
	componentDidMount: function() {
		$.ajax({
			url: serviceurl + "hospital/listHosDoctor",
			type: "get",
			dataType: "json",
			data: {},
			contentType: "application/json",
			cache: false,
			async: false,

			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					//隐藏loading
					$("#loading").hide();

					docList = dt.data;
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
	},
	searchClick: function(e) {
		if (e.target.tagName == "A") {
			$.each(e.target.parentElement.children, function(idx, item) {
				item.className = "filter-item";
			});
			e.target.className = "filter-item active countbg-color";
			if (e.target.name == "condition_Date") {
				date = e.target.rel;
				if (e.target.text == "不限") {
					startdate = "";
					enddate = "";
				}
			}
			if (e.target.name == "condition_doc") {
				doctorID = "";
			}
			$("#searchText").val("");
			pageNum = 1;
			refleshData(1);
			this.props.onCommentSubmit(dataList);
		}
	},
	render: function() {
		var docNodes = docList.map(function(comment) {
			return (
				<DocComment 
	          	key={comment.doctorid}
	          	doctorid={comment.doctorid}
	          	doctorname={comment.doctorname}
	          >
	          </DocComment>
			);
		});
		return (
			<div className="list-group">
				<div className="list-group-item">
					<div className="filter">
						<div className="filter-label pull-left">日期</div>
						<div className="filter-item-wrap">
							<a href="#" className="filter-item" name="condition_Date" rel="0" onClick={this.searchClick}>不限</a>
							<a href="#" className="filter-item active countbg-color" name="condition_Date" rel="1" onClick={this.searchClick}>今天</a>
							<a href="#" className="filter-item" name="condition_Date" rel="3" onClick={this.searchClick}>本周</a>
							<a href="#" className="filter-item" name="condition_Date" rel="4" onClick={this.searchClick}>本月</a>
						</div>
					</div>
					<div className="filter">
						<div href="#" className="filter-label pull-left">医生</div>
						<div href="#" className="filter-item-wrap" id="condition_Doctor" onClick={this.searchClick}>
							<a href="#" className="filter-item active countbg-color" name="condition_doc" rel="" onClick={this.searchClick}>不限</a>
							{docNodes}
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var DocComment = React.createClass({
	docClick: function() {
		doctorID = this.props.doctorid;
	},
	render: function() {
		return (
			<a href="#" className="filter-item" name="condition_Doctor" rel={this.props.doctorid} onClick={this.docClick}>{this.props.doctorname}</a>
		);
	}
});

var List_Area = React.createClass({
	searchClick: function() {
		refleshData(1);
		this.props.onCommentSubmit(dataList);
	},
	render: function() {
		if (this.props.data.length > 0) {
			var nodes = this.props.data.map(function(comment) {
				return (
					<Comment 
					key={comment.doctorid}
					doctorid={comment.doctorid}
					doctorname={comment.doctorname}
					title={comment.title}
					refundmoney={"￥ "+toDecimal(MoneyConversion(comment.refundmoney)).toFixed(2)}
					allprice={"￥ "+toDecimal(MoneyConversion(comment.allprice)).toFixed(2)}
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
								<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>条记录</div>
							</div>
							<div className="col-sm-4">
								<div className="input-group input-group-sm">
									<input type="text" className="form-control" ref="searchText" id="searchText" placeholder="医生/电话"/>
									<span className="input-group-btn">
										<button className="btn btn-default" type="button" onClick={this.searchClick}>搜索</button>
									</span>
								</div>
							</div>
						</div>
					</div>

					<table className="table table-striped table-hover pointer" id="CountDoctorList">
						<tbody>
								<tr>
								<td>姓名</td>
								<td>职称</td>
								<td>退款</td>
								<td>总绩效</td>
							</tr>
							{nodes}
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
				<div className="panel panel-primary no-border">
					<div className="panel-heading count-head-border">
						<div className="row">
							<div className="col-sm-8">
								<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>条记录</div>
							</div>
							<div className="col-sm-4">
								<div className="input-group input-group-sm">
									<input type="text" className="form-control" ref="searchText" id="searchText" placeholder="医生/电话"/>
									<span className="input-group-btn">
										<button className="btn btn-default" type="button" onClick={this.searchClick}>搜索</button>
									</span>
								</div>
							</div>
						</div>
					</div>

					<table className="table table-striped table-hover pointer" id="CountDoctorList">
						<tbody>
							<tr>
								<td>姓名</td>
								<td>职称</td>
								<td>退款</td>
								<td>总绩效</td>
							</tr>
						</tbody>
					</table>
					<table className="table table-striped table-hover pointer">
						<tbody>
							<tr>
								<td className="text-center">暂无数据</td>
							</tr>
						</tbody>
					</table>
				</div>
			);
		}

	}
});

var Comment = React.createClass({
	goDetail: function() {
		/*		setCookie("doctorID", this.props.doctorid, 30);
				setCookie("doctorname", this.props.doctorname, 30);
				setCookie("startdate", startdate, 30);
				setCookie("enddate", enddate, 30);
				setCookie("gobackURL", "count_doctor.html", 30);*/
		window.open("count_doctor_det.html" +
			re_str("hname", request("hname"), 0) +
			re_str("doctorID", this.props.doctorid, 1) +
			re_str("doctorname", this.props.doctorname, 1) +
			re_str("startdate", startdate, 1) +
			re_str("enddate", enddate, 1) +
			re_str("gobackURL", "count_doctor.html", 1));
	},
	render: function() {
		return (
			<tr>
                <td onClick={this.goDetail}>{this.props.doctorname}</td>
                <td onClick={this.goDetail}>{this.props.title}</td>
                <td onClick={this.goDetail}>{this.props.refundmoney}</td>
                <td onClick={this.goDetail}>{this.props.allprice}</td>
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
		    <Top_Area titleName="医生统计" />
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