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
var dataList = [];
var sum = 0;
var mode = ""; //mode搜索的状态
var status = "0"; //status搜索的状态
var pageNum = 1; //当前页
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
var title = ""; //职位名称
$(document).ready(function() {
	//判断登陆与否
	testLogin("dd_doctor.html");
	leftBoxClick("collapseDD", 1, "dd");

});
//获取列表信息
var refleshData = function(currentPage) {
	var jobid = request("jobID");
	var _params = {
		"currentPage": currentPage,
		"jobid": jobid
	};
	$.ajax({
		url: serviceurl + "doctor/selectHosSendResume",
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
				title = checknull(request("title"));
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
			var style_node = {
				display: "table-row-group"
			};
			var style_contentnone = {
				display: "none"
			};
			var style_page = {
				display: "inline"
			};
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

		var nodes = this.props.data.map(function(comment) {
			return (
				<Comment 
		          	key={comment.sendid}
		          	resumeid={comment.resumeid}
		          	doctorname={comment.doctorname}
		          	doctorid={comment.doctorid}
		          	doctormobile={comment.doctormobile}
		          	defaulthosname={comment.defaulthosname}
		          	workyears={comment.workyears}
					createtime={comment.createtime}
		          >
		          </Comment>
			);
		});

		return (
			<div className="panel panel-primary no-border">
					<div className="panel-heading dd-head-border">
						<div className="row">
							<div className="col-sm-8">
								<div className="color-black line-height-30">共有<span id="listSum">{sum}</span>位医生投递简历</div>
							</div>
							<div className="col-sm-4">
								<div className="input-group input-group-sm color-black text-right">
									{title}
								</div>
							</div>
						</div>
					</div>
					<div id="dd-list">
						<table className="table table-hover table-striped bmargin0 pointer">
							<tbody style={style_node}>
								<tr>
									<td>医生姓名</td>
									<td>电话</td>
									<td>工作地点</td>
									<td>工作年限</td>
									<td>投递日期</td>
								</tr>
								{nodes}
							</tbody>
							<tbody style={style_contentnone}>
								<tr>
									<td className="text-center">暂无人投递简历</td>
								</tr>
							</tbody>
						</table>
					</div>
					<nav style={style_page}>
						<PagingPN prevClick={this.prevClick} nextClick={this.nextClick} />
					</nav>
				</div>
		);
	}
});
var Comment = React.createClass({
	goDetail: function() {
		//setCookie("dd_doctorid", this.props.doctorid, 30)
		window.open("dd_doctor_det.html" +
			re_str("hname", request("hname"), 0) +
			re_str("dd_doctorid", this.props.doctorid, 1));
	},
	render: function() {
		return (
			<tr id={this.props.jobid}>
				<td onClick={this.goDetail}>{this.props.doctorname}</td>
				<td onClick={this.goDetail}>{this.props.doctormobile}</td>
				<td onClick={this.goDetail}>{this.props.defaulthosname}</td>
				<td onClick={this.goDetail}>{this.props.workyears}</td>
				<td onClick={this.goDetail}>{this.props.createtime}</td>
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
		//leftBoxClick("collapseDD", 1, "dd");
		$("#loading").hide();
		$("#loading_end").show();
		return (
			<div>
			<List_Area onCommentSubmit={this.handleCommentSubmit} data={this.state.data} />
      </div>
		);
	}
});

var App = React.createClass({
	render: function() {
		return (
			<div> <nav className="navbar navbar-inverse navbar-fixed-top" id="topMainBox">
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
                        <div className="page-title">投递列表</div>
                    </div>
                </div>
                <div id="content"><MainBox /></div>
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

export default React.createClass({
	render: function() {
		return (<div>
			<App /></div>)
	}
})