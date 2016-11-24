'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	setCookie,
	leftBoxClick,
	re_str,
	request,
	isMockMobile
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import {
	testLogin
} from './ajax/user.js';
import {
	getlistHosDoctor,
	docList
} from './ajax/listHosDoctor.js';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import Top_Area from './components/Top_Area.js';

$(document).ready(function() {
	//判断登陆与否
	testLogin("pay_center.html");
	leftBoxClick("collapsePay", 0, "pay");
});
var dataList = [];
var sum = 0;
var date = "0"; //date查询日期
var status = "00"; //status搜索的状态
var doctorID = ""; //doctorID选择的医生
//var searchText = ""; //searchText文本框的内容
var pageNum = 1; //当前页
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页

//获取列表信息
var refleshData = function(currentPage) {
	var _params = {
		"currentPage": currentPage,
		"timeid": date,
		"querytime": "",
		"bookstatusid": status,
		"doctorid": doctorID,
		"patientname": $("#searchText").val()
	};
	$.ajax({
		url: serviceurl + "booking/chargeBooking",
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
		getlistHosDoctor();
	},
	searchClick: function(e) {
		if (e.target.tagName == "A") {
			$.each(e.target.parentElement.children, function(idx, item) {
				item.className = "filter-item";
			});
			e.target.className = "filter-item active paybg-color";
			if (e.target.text == "不限") {
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
						<div className="filter-label pull-left">医生</div>
						<div className="filter-item-wrap" id="condition_Doctor" onClick={this.searchClick}>
							<a href="#" className="filter-item active paybg-color" rel="" onClick={this.searchClick}>不限</a>
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
		if (this.props.data.length > 0) {
			var nodes = this.props.data.map(function(comment) {
				var status = "";
				var operat = "";
				if (comment.d == "1") {
					status = "已取消";
					operat = "";
				} else {
					if (comment.isorder == "0") {
						status = "未就诊";
						operat = "";
					} else {
						status = "已就诊";
						operat = "收费";
					}
				}
				var worktime = "";
				var stime = new Date((comment.starttime) * 1000);
				var etime = new Date((comment.endtime) * 1000);
				worktime = (stime.getHours() + ":" + (stime.getMinutes() < 10 ? "0" + stime.getMinutes() : stime.getMinutes())) + "~" + (etime.getHours() + ":" + (etime.getMinutes() < 10 ? "0" + etime.getMinutes() : etime.getMinutes()));
				var type = "";
				if (comment.isfirst) {
					type = "复诊";
				} else {
					type = "初诊";
				}
				return (
					<Comment 
		          	key={comment.bookingid}
		          	bookingid={comment.bookingid}
		          	clientid={comment.clientid}
		          	status={status}
		          	workdate={comment.workdate}
		          	worktime={worktime}
		          	doctorid={comment.doctorid}
		          	doctorname={comment.doctorname}
		          	type={type}
		          	patientid={comment.patientid}
		          	patientname={comment.patientname}
		          	patientmobile={isMockMobile(comment.patientmobile)}
		          	operat={operat}
		          >
		          </Comment>
				);
			});
			return (
				<div>
					<div className="panel panel-primary no-border">
						<div className="panel-heading pay-head-border">
							<div className="row">
								<div className="col-sm-8">
									<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>条记录</div>
								</div>
								<div className="col-sm-4">
									<div className="input-group input-group-sm">
										<input type="text" className="form-control" ref="searchText" id="searchText" placeholder="病人/电话"/>
										<span className="input-group-btn">
											<button className="btn btn-default" type="button" onClick={this.searchClick}>搜索</button>
										</span>
									</div>
								</div>
							</div>
						</div>

						<table className="table table-hover pointer">
							<tbody>
								<tr>
									<td>患者姓名</td>
									<td>联系电话</td>
									<td>挂号日期</td>
									<td>挂号时间</td>
									<td>挂号医生</td>
									<td>就诊类型</td>
									<td>操作</td>
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
						<div className="panel-heading pay-head-border">
							<div className="row">
								<div className="col-sm-8">
									<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>条记录</div>
								</div>
								<div className="col-sm-4">
									<div className="input-group input-group-sm">
										<input type="text" className="form-control" ref="searchText" id="searchText" placeholder="病人/电话"/>
										<span className="input-group-btn">
											<button className="btn btn-default" type="button" onClick={this.searchClick}>搜索</button>
										</span>
									</div>
								</div>
							</div>
						</div>
		
						<table className="table table-hover pointer">
							<tbody>
								<tr>
									<td>患者姓名</td>
									<td>联系电话</td>
									<td>挂号日期</td>
									<td>挂号时间</td>
									<td>挂号医生</td>
									<td>就诊类型</td>
									<td>操作</td>
								</tr>
							</tbody>
						</table>
						<table className="table table-hover pointer">
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
	goPay: function() {
		// setCookie("bookingID", this.props.bookingid, 30);
		// setCookie("doctorID", this.props.doctorid, 30);
		// setCookie("doctorname", this.props.doctorname, 30);
		// setCookie("patientID", this.props.patientid, 30);
		// setCookie("clientID", this.props.clientid, 30);
		// setCookie("patientname", this.props.patientname, 30);
		// setCookie("patientmobile", this.props.patientmobile, 30);
		// setCookie("gobackURL", "pay_center.html", 30);
		setCookie("servicesList", "", 30);
		window.open("pay_start.html" +
			re_str("hname", request("hname"), 0) +
			re_str("opType", "cent", 1) +
			re_str("bookingID", this.props.bookingid, 1) +
			re_str("doctorID", this.props.doctorid, 1) +
			re_str("doctorname", this.props.doctorname, 1) +
			re_str("patientID", this.props.patientid, 1) +
			re_str("clientID", this.props.clientid, 1) +
			re_str("patientname", this.props.patientname, 1) +
			re_str("patientmobile", this.props.patientmobile, 1) +
			re_str("gobackURL", "pay_center.html", 1));
	},
	render: function() {
		return (
			<tr>
				<td>{this.props.patientname}</td>
				<td>{this.props.patientmobile}</td>
				<td>{this.props.workdate}</td>
				<td>{this.props.worktime}</td>
				<td>{this.props.doctorname}</td>
				<td>{this.props.type}</td>
				<td className="yayi-text-color pointer" onClick={this.goPay}>收费</td>
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
			    <Top_Area titleName="收费列表" />
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