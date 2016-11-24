'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	leftBoxClick,
	re_str,
	request
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
import Top_Area from './components/Top_Area.js';
var dataList = [];
var sum = 0;
var mode = ""; //mode搜索的状态
var status = "0"; //status搜索的状态
var pageNum = 1; //当前页
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
$(document).ready(function() {
	//判断登陆与否
	testLogin("dd_doctor.html");
	leftBoxClick("collapseDD", 0, "dd");

	// $("#goAddjob").click(function() {
	// 	window.open("dd_addjob.html" +
	// 		re_str("hname", request("hname"), 0));
	// });
});

//获取列表信息
var refleshData = function(currentPage) {
	var _params = {
		"currentPage": currentPage,
		"d": status,
		"mode": mode
	};
	$.ajax({
		url: serviceurl + "hospital/listHosJob",
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
				$("#loading_end").show();
				$(".none-table").css("display", "none");

				dataList = dt.data;
				sum = dt.map.page.totalCount;
				$("#listSum").html(sum);
				//计算总和
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

				$(".jobs").css("display", "table-row");
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
		e.target.className = "filter-item active ddbg-color";
		if (e.target.name == "mode") {
			mode = e.target.rel;
		} else if (e.target.name == "d") {
			status = e.target.rel;
		}
		refleshData(1);
		this.props.onCommentSubmit(dataList);
	},
	render: function() {
		return (
			<div className="list-group">
				<div className="list-group-item">
					<div className="filter">
						<div className="filter-label pull-left">收费方式</div>
						<div className="filter-item-wrap">
							<a href="#" name="mode" className="filter-item active ddbg-color" rel="" onClick={this.searchClick} >全部</a>
							<a href="#" name="mode" className="filter-item " rel="1" onClick={this.searchClick} >日租</a>
							<a href="#" name="mode" className="filter-item " rel="2" onClick={this.searchClick} >分成</a>
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">状态</div>
						<div className="filter-item-wrap">
							<a href="#" name="d" className="filter-item active ddbg-color" rel="0" onClick={this.searchClick} >发布中</a>
							<a href="#" name="d" className="filter-item " rel="1" onClick={this.searchClick} >已关闭</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
$("#saveBtn").click(function() {
	var jobtitle = $("#jobname").val();
	if (Vld.isLength(jobtitle, {
			min: 2,
			max: 1000
		}) === false) {
		toast.show("请输入职位信息(2~1000个字)");
		return;
	}
	if (Vld.isNull(jobtitle.trim())) {
		toast.show("请输入职位信息不能为空");
		return;
	}
	$.ajax({
		url: serviceurl + "hospital/addJob",
		type: "post",
		dataType: "json",
		data: JSON.stringify({
			"jobtitle": jobtitle
		}),
		contentType: "application/json",
		success: function(dt) {
			console.log("doctorDet" + JSON.stringify(dt));
			if (dt.status == "success") {
				location.href = "dd_doctor.html";
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
				var mode = "";
				if (comment.mode == "1") {
					mode = "日租";
				} else if (comment.mode == "2") {
					mode = "分成";
				}
				return (
					<Comment 
		          	key={comment.jobid}
		          	jobid={comment.jobid}
		          	jobtitle={comment.jobtitle}
		          	title={comment.title}
		          	mode={mode}
		          	createtime={comment.createtime}
		          	d={comment.d}
					sendnum={comment.sendnum}
		          >
		          </Comment>
				);
			});
			return (
				<div className="panel panel-primary no-border">
					<div className="panel-heading dd-head-border">
						<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>条职位</div>
					</div>
					<div id="dd-list">
						<table className="table table-hover table-striped bmargin0 pointer">
							<tbody>
								<tr>
									<td>标题</td>
									<td>收费方式</td>
									<td>添加时间</td>
									<td>投递数量</td>
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
				<div className="panel panel-primary no-border">
					<div className="panel-heading dd-head-border">
						<div className="color-black line-height-30">共有<span id="listSum">0</span>条职位</div>
					</div>
					<div id="dd-list">
						<table className="table table-hover table-striped bmargin0 pointer">
							<tbody>
								<tr>
									<td>标题</td>
									<td>收费方式</td>
									<td>添加时间</td>
									<td>投递数量</td>
									<td>操作</td>
								</tr>
							</tbody>
						</table>
						<table className="table table-hover table-striped bmargin0 pointer">
							<tbody>
								<tr>
									<td className="text-center">暂无职位</td>
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
	openClick: function() {
		if (window.confirm('是否开启该职位？')) {
			var jobid = this.props.jobid;
			var _params = {
				"jobid": jobid,
				"d": "0"
			};
			$.ajax({
				url: serviceurl + "hospital/deleteJob",
				type: "post",
				dataType: "json",
				data: JSON.stringify(_params),
				contentType: "application/json",
				cache: false,
				async: false,
				success: function(dt) {
					console.log("titlelist" + JSON.stringify(dt));
					if (dt.status == "success") {
						// refleshData();
						// this.props.onCommentSubmit(dataList);
						toast.show("开启成功");
						$("#" + jobid).hide();
						$("#listSum").text($("#listSum").text() - 1);
						if ($("#listSum").text() == 0) {
							$("#dd-list").append(
								"<table class='table table-hover table-striped bmargin0 pointer none-table'>" +
								"<tbody>" +
								"<tr>" +
								"<td class='text-center'>暂无职位</td>" +
								"</tr>" +
								"</tbody>" +
								"</table>"
							);
						} else {
							$(".none-table").css("display", "none");
						}
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
		} else {
			return;
		}
	},
	deleteClick: function() {
		if (window.confirm('是否关闭该职位？')) {
			var jobid = this.props.jobid;
			var _params = {
				"jobid": jobid,
				"d": "1"
			};
			$.ajax({
				url: serviceurl + "hospital/deleteJob",
				type: "post",
				dataType: "json",
				data: JSON.stringify(_params),
				contentType: "application/json",
				cache: false,
				async: false,
				success: function(dt) {
					console.log("titlelist" + JSON.stringify(dt));
					if (dt.status == "success") {
						// refleshData();
						//this.props.onCommentSubmit(dataList);
						toast.show("关闭成功");
						$("#" + jobid).hide();
						$("#listSum").text($("#listSum").text() - 1);
						if ($("#listSum").text() == 0) {
							$("#dd-list").append(
								"<table class='table table-hover table-striped bmargin0 pointer none-table'>" +
								"<tbody>" +
								"<tr>" +
								"<td class='text-center'>暂无职位</td>" +
								"</tr>" +
								"</tbody>" +
								"</table>"
							);
						} else {
							$(".none-table").css("display", "none");
						}
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
		} else {
			return;
		}
	},
	goDetail: function() {
		/*setCookie("jobID", this.props.jobid, 30);
		setCookie("title", this.props.title, 30);
		setCookie("gobackURL", "dd_doctor.html", 30);*/
		window.open("dd_job.html" +
			re_str("hname", request("hname"), 0) +
			re_str("jobID", this.props.jobid, 1) +
			re_str("title", this.props.title, 1) +
			re_str("gobackURL", "dd_doctor.html", 1));
	},
	render: function() {
		if (this.props.d == 0) {
			return (
				<tr id={this.props.jobid} className="jobs">
					<td onClick={this.goDetail}>{this.props.title}</td>
					<td onClick={this.goDetail}>{this.props.mode}</td>
					<td onClick={this.goDetail}>{this.props.createtime}</td>
					<td onClick={this.goDetail}>{this.props.sendnum}</td>
					<td className="yayi-text-color" onClick={this.deleteClick}>关闭</td>
				</tr>
			);
		} else if (this.props.d == 1) {
			return (
				<tr id={this.props.jobid} className="jobs">
					<td onClick={this.goDetail}>{this.props.title}</td>
					<td onClick={this.goDetail}>{this.props.mode}</td>
					<td onClick={this.goDetail}>{this.props.createtime}</td>
					<td onClick={this.goDetail}>{this.props.sendnum}</td>
					<td className="yayi-text-color" onClick={this.openClick}>开启</td>
				</tr>
			);
		}
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
		      	<Top_Area titleName="职位列表" btnDisplay="block" btnText="添加" btnColor="ddbg-color" link="dd_addjob" />
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