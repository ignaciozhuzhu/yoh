'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	getLocalTime,
	MoneyConversion,
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
$(document).ready(function() {
	//判断登陆与否
	testLogin("count_pay.html");
	leftBoxClick("collapseCount", 2, "count");
});
var dataList = [];
var docList = [];
var sum = 0;
var startdate = "";
var enddate = "";
var date = "1"; //date查询日期
var status = "0"; //status搜索的状态, 00不限,11-已支付,10-未支付,20-已退款
var doctorID = ""; //doctorID选择的医生
//var searchText = ""; //searchText文本框的内容
var pageNum = 1; //当前页
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
var payment = 0; //支付方式 0：不限  1：支付宝  2：微信
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
	} else {
		startdate = "";
		enddate = "";
	}
	if (doctorID == "") {
		var _params = {
			"currentPage": currentPage,
			"startDate": startdate,
			"endDate": enddate,
			"state": status,
			"keyvalue": $("#searchText").val(),
			"channel": payment
		};
	} else {
		_params = {
			"currentPage": currentPage,
			"startDate": startdate,
			"endDate": enddate,
			"doctorid": doctorID,
			"state": status,
			"keyvalue": $("#searchText").val(),
			"channel": payment
		};
	}
	$.ajax({
		url: serviceurl + "statistic/income",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,
		success: function(dt) {
			console.log("xxxxx++++++" + JSON.stringify(dt));
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
			e.target.className = "filter-item active countbg-color";
			if (e.target.name == "condition_Date") {
				date = e.target.rel;
			} else if (e.target.name == "condition_Status") {
				status = e.target.rel;
			} else if (e.target.name == "condition_Doctor") {
				doctorID = e.target.rel;
			} else if (e.target.name == "condition_Payment") {
				payment = e.target.rel;
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
						<div className="filter-label pull-left">状态</div>
						<div className="filter-item-wrap">
							<a href="#" className="filter-item active countbg-color" name="condition_Status" rel="0" onClick={this.searchClick}>不限</a>
							<a href="#" className="filter-item" name="condition_Status" rel="1" onClick={this.searchClick}>未支付</a>
							<a href="#" className="filter-item" name="condition_Status" rel="2" onClick={this.searchClick}>已支付</a>
							<a href="#" className="filter-item" name="condition_Status" rel="3" onClick={this.searchClick}>已退款</a>
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">医生</div>
						<div className="filter-item-wrap" id="condition_Doctor" onClick={this.searchClick}>
							<a href="#" className="filter-item active countbg-color" name="condition_Doctor" rel="" onClick={this.searchClick}>不限</a>
							{docNodes}
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">支付方式</div>
						<div className="filter-item-wrap">
							<a href="#" className="filter-item active countbg-color" name="condition_Payment" rel="0" onClick={this.searchClick}>不限</a>
							<a href="#" className="filter-item" name="condition_Payment" rel="1" onClick={this.searchClick}>支付宝</a>
							<a href="#" className="filter-item" name="condition_Payment" rel="2" onClick={this.searchClick}>微信</a>
							<a href="#" className="filter-item" name="condition_Payment" rel="4" onClick={this.searchClick}>银行卡</a>
							<a href="#" className="filter-item" name="condition_Payment" rel="5" onClick={this.searchClick}>现金</a>
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
	searchClick: function() {
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
		var nodes;
		if (this.props.data.length > 0) {
			var style_node = {
				display: "table-row-group"
			};
			var style_contentnone = {
				display: "none"
			};
			var style_page = {
				display: "block"
			};
			nodes = this.props.data.map(function(comment) {
				var channel = "";
				if (comment.channel == 1) {
					channel = "支付宝支付";
				} else if (comment.channel == 2) {
					channel = "微信支付";
				} else if (comment.channel == 4) {
					channel = "银行卡支付";
				} else if (comment.channel == 5) {
					channel = "现金支付";
				} else {
					channel = "";
				}
				return (
					<Comment 
					key={comment.orderid}
					doctorname={comment.doctorname}
					title={comment.title}
					ordernumber={comment.ordernumber}
					pay={"￥ "+ toDecimal(MoneyConversion(comment.pay)).toFixed(2)}
					reduce={"￥ "+toDecimal(MoneyConversion(comment.reduce)).toFixed(2)}
					refund={toDecimal(MoneyConversion(comment.refund))?"￥ "+toDecimal(MoneyConversion(comment.refund)).toFixed(2):"￥ "+(0).toFixed(2)}
					ispay={comment.ispay == 0?"未支付" : (comment.refundstate == 0?"已支付" : "已退款")}
					patientname={comment.patientname}
					createtime={getLocalTime(comment.createtime).split(" ")[0]}
					channel={channel}
				>
				</Comment>
				);
			});
		} else {
			style_node = {
				display: "none"
			};
			style_contentnone = {
				display: "table-row-group"
			};
			style_page = {
				display: "none"
			};
		}
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
					<table className="table table-striped table-hover pointer" >
						<tbody style={style_node}>
							<tr>
								<td>医生信息</td>
								<td>订单信息</td>
								<td>支付款项</td>
								<td>支付方式</td>
							</tr>
						{nodes}
						</tbody>

						<tbody style={style_contentnone}>
							<tr>
								<td className="text-center">暂无数据</td>
							</tr>
						</tbody>
					</table>
					<nav style={style_page}>
						<ul className="pager">
							<li className="previous" id="previousPage"><a href="#" onClick={this.prevClick}>上一页</a></li>
							<li className="next" id="nextPage"><a href="#" onClick={this.nextClick}>下一页</a></li>
						</ul>
					</nav>
				</div>
		);

	}
});

var Comment = React.createClass({
	render: function() {
		return (
			<tr>
                <td>
					<div>{this.props.doctorname}</div>
					<div className='gray-light'>{this.props.title}</div>
				</td>
                <td>
					<div>订单号 {this.props.ordernumber}</div>
					<div className='gray-light'>{this.props.patientname}</div>
					<div className='gray-light'>{this.props.createtime}</div>
				</td>
                <td>
					<div>实付 <b className='brand-danger'>{this.props.pay}</b> </div> 
					<div className='gray-light'>优惠 {this.props.reduce} </div>
					<div className='gray-light'>退款 {this.props.refund} </div>
				</td>
                <td>
					<div>{this.props.channel}</div>
					<div className='gray-light'>{this.props.ispay}</div>
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
      	<Top_Area titleName="收费统计" />
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