'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	getLocalTime,
	leftBoxClick,
	request,
	re_str,
	isMockMobile
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
var date = "1"; //date查询日期
var status = "00"; //status搜索的状态, 00不限,11-已支付,10-未支付,20-已退款
var doctorID = ""; //doctorID选择的医生
//var searchText = ""; //searchText文本框的内容
var pageNum = 1; //当前页
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
$(document).ready(function() {
	//判断登陆与否
	testLogin("pay_order_list.html");
	leftBoxClick("collapsePay", 1, "pay");
});
//获取列表信息
var refleshData = function(currentPage) {
	var _params = {
		"currentPage": currentPage,
		"timeid": date,
		"orderstatus": status,
		"ordertime": "", //选择的日期
		"doctorid": doctorID,
		"patientname": $("#searchText").val()
	};
	$.ajax({
		url: serviceurl + "order/hosOrder",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				//隐藏loading
				$("#loading").hide();

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
			e.target.className = "filter-item active paybg-color";
			if (e.target.name == "condition_Date") {
				date = e.target.rel;
			} else if (e.target.name == "condition_Status") {
				status = e.target.rel;
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
							<a href="#" className="filter-item active paybg-color" name="condition_Date" rel="1" onClick={this.searchClick}>今天</a>
							
							<a href="#" className="filter-item" name="condition_Date" rel="3" onClick={this.searchClick}>本周</a>
							<a href="#" className="filter-item" name="condition_Date" rel="4" onClick={this.searchClick}>本月</a>
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">状态</div>
						<div className="filter-item-wrap">
							<a href="#" className="filter-item active paybg-color" name="condition_Status" rel="00" onClick={this.searchClick}>不限</a>
							<a href="#" className="filter-item" name="condition_Status" rel="11" onClick={this.searchClick}>已支付</a>
							<a href="#" className="filter-item" name="condition_Status" rel="10" onClick={this.searchClick}>未支付</a>
							<a href="#" className="filter-item" name="condition_Status" rel="20" onClick={this.searchClick}>已退款</a>
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">医生</div>
						<div className="filter-item-wrap" id="condition_Doctor" onClick={this.searchClick}>
							<a href="#" className="filter-item active paybg-color" name="condition_doc" rel="" onClick={this.searchClick}>不限</a>
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
	componentDidMount: function() {
		if (pageAllnum == 1) {
			$("#previousPage").addClass("hide");
			$("#nextPage").addClass("hide");
		} else {
			$("#previousPage").addClass("hide");
			$("#nextPage").removeClass("hide");
		}
	},
	searchTextClick: function() {
		refleshData(1);
		this.props.onCommentSubmit(dataList);
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
				var state = "";
				var operate = "";
				var createtimeD = getLocalTime(comment.createtime).split(" ")[0];
				var createtimeT = getLocalTime(comment.createtime).split(" ")[1];

				if (comment.hasrefund == "Y") {
					if (comment.canRefund == "0") {
						state = "已退全款";
						operate = "";
					} else if (comment.canRefund == "1") {
						state = "已退部分";
						operate = "退款";
					}
				} else if (comment.hasrefund == "M") {
					state = "退款中";
					if (comment.canRefund == "0") {
						operate = "";
					} else if (comment.canRefund == "1") {
						operate = "退款";
					}
				} else if (comment.hasrefund == "N") {
					if (comment.state == "1") {
						state = "未付款";
						operate = "修改";
					} else {
						state = "已付款";
						if (comment.canRefund == "0") {
							operate = "";
						} else if (comment.canRefund == "1") {
							operate = "退款";
						}
					}
				}
				return (
					<Comment 
		          	key={comment.orderid}
		          	id={comment.orderid}
		          	patientname={comment.patientname}
		          	patientmobile={isMockMobile(comment.patientmobile)}
		          	ordernumber={comment.ordernumber}
		          	doctorname={comment.doctorname}
		          	createtimeD={createtimeD}
		          	createtimeT={createtimeT}
		          	state={state}
		          	operate={operate}
		          >
		          </Comment>
				);
			});
			return (
				<div>
					<div className="panel panel-primary no-border">
						<div className="panel-heading w-bg pay-head-border">
							<div className="row">
								<div className="col-sm-8">
									<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>条记录</div>
								</div>
								<div className="col-sm-4">
									<div className="input-group input-group-sm">
										<input type="text" className="form-control" id="searchText" ref="searchText" placeholder="病人/电话"/>
										<span className="input-group-btn">
											<button className="btn btn-default" type="button" onClick={this.searchTextClick}>搜索</button>
										</span>
									</div>
								</div>
							</div>
						</div>

						<table className="table table-hover bmargin0 pointer" id="pay-order-list">
							<tbody>
								<tr>
									<td>患者</td>
									<td>订单信息</td>
									<td>创建时间</td>
									<td>支付</td>
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
				<div>
					<div className="panel panel-primary no-border">
						<div className="panel-heading w-bg pay-head-border">
							<div className="row">
								<div className="col-sm-8">
									<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>条记录</div>
								</div>
								<div className="col-sm-4">
									<div className="input-group input-group-sm">
										<input type="text" className="form-control" id="searchText" ref="searchText" placeholder="病人/电话"/>
										<span className="input-group-btn">
											<button className="btn btn-default" type="button" onClick={this.searchTextClick}>搜索</button>
										</span>
									</div>
								</div>
							</div>
						</div>

						<table className="table table-hover bmargin0 pointer" id="pay-order-list">
							<tbody>
									<tr>
										<td>患者</td>
										<td>订单信息</td>
										<td>创建时间</td>
										<td>支付</td>
									</tr>
							</tbody>
						</table>
						<table className="table table-hover bmargin0 pointer">
							<tbody>
									<tr>
										<td className="text-center">暂无订单</td>
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
	goDetail: function() {
		var orderid = this.props.id;
		window.open("pay_last.html" +
			re_str("hname", request("hname"), 0) +
			re_str("orderID", orderid, 1) +
			re_str("opType", "list", 1) +
			re_str("gobackURL", "pay_order_list.html", 1));
	},
	goOperate: function(e) {
		var orderid = this.props.id;
		//setCookie("orderID", orderid, 30);
		//setCookie("gobackURL", "pay_order_list.html", 30);
		if (e.target.textContent == "修改") {
			window.open("pay_start.html" +
				re_str("hname", request("hname"), 0) +
				re_str("opType", "list", 1) +
				re_str("orderID", orderid, 1) +
				re_str("gobackURL", "pay_order_list.html", 1));
		} else if (e.target.textContent == "退款") {
			window.open("pay_refund.html" +
				re_str("hname", request("hname"), 0) +
				re_str("orderID", orderid, 1) +
				re_str("gobackURL", "pay_order_list.html", 1));
		}
	},
	render: function() {
		return (
			<tr>
                <td onClick={this.goDetail} className="pointer">{this.props.patientname}<br />{this.props.patientmobile}</td>
                <td onClick={this.goDetail} className="pointer">订单号 {this.props.ordernumber}<br /> 医生 {this.props.doctorname}</td>
                <td onClick={this.goDetail} className="pointer">{this.props.createtimeD}<br />{this.props.createtimeT}</td>
                <td onClick={this.goOperate} className="pointer">{this.props.state}<br />
                	<span className="yayi-text-color">{this.props.operate}</span>
                </td>
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
      	<Top_Area titleName="订单列表"/>
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