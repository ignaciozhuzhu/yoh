'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	leftBoxClick,
	re_str,
	request,
	serviceurl,
	toast,
	isMockMobile
} from './lib/common.js';

import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import Top_Area from './components/Top_Area.js';
import {
	PagingSearch,
	PagingPN,
	LoadingBox
} from './components/Paging.js';
import {
	SearchParBox
} from './components/SearchParBox.js';

import {
	getUserInfo
} from './ajax/user.js';
import {
	getlistHosDoctor,
	docList
} from './ajax/listHosDoctor.js';

import {
	refleshData,
	dataList,
	sum,
	pageAllnum
} from './ajax/refleshData.js';

var date = "0"; //date查询日期,默认值
var status = "00"; //status搜索的状态,默认值
var doctorID = ""; //doctorID选择的医生,默认值

function refleshObject(currentPage, timeid, querytime, bookstatusid, doctorid, patientname) {
	this.currentPage = currentPage;
	this.timeid = timeid;
	this.querytime = querytime;
	this.bookstatusid = bookstatusid;
	this.doctorid = doctorid;
	this.patientname = patientname;
}
var refObj = new refleshObject(1, date, "", status, doctorID, "");
$(document).ready(function() {
	leftBoxClick("collapseRes", 0, "res");
	//获取当前用户信息
	getUserInfo("reservation_center.html");
})

var Condition_Area = React.createClass({
	getInitialState: function() {
		refleshData(refObj);
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
			e.target.className = "filter-item active resbg-color";
			if (e.target.name == "condition_Date") {
				date = e.target.rel;
			} else if (e.target.name == "condition_Status") {
				status = e.target.rel;
			}
			if (e.target.name == "condition_doc") {
				doctorID = "";
			}
			refObj.currentPage = 1;
			refObj.timeid = date;
			refObj.bookstatusid = status;
			refObj.doctorid = doctorID;
			refObj.patientname = $("#searchText").val();
			refleshData(refObj);
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
			<SearchParBox searchClick={this.searchClick} docNodes={docNodes} module="res" />
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
		//分页显示判断
		if (pageAllnum == 1) {
			$("#previousPage").addClass("hide");
			$("#nextPage").addClass("hide");
		} else if (refObj.currentPage == pageAllnum) {
			$("#previousPage").removeClass("hide");
			$("#nextPage").addClass("hide");
		} else if (refObj.currentPage == 1) {
			$("#previousPage").addClass("hide");
			$("#nextPage").removeClass("hide");
		} else {
			$("#previousPage").removeClass("hide");
			$("#nextPage").removeClass("hide");
		}
	},
	searchClick: function() {
		refObj.currentPage = 1;
		refObj.patientname = $("#searchText").val();
		refleshData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	nextClick: function() {
		refObj.currentPage++;
		refleshData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	prevClick: function() {
		refObj.currentPage--;
		refObj.currentPage = refObj.currentPage < 1 ? 1 : refObj.currentPage;
		refleshData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	render: function() {
		if (this.props.data.length > 0) {
			var style_node = {
				display: "block"
			};
			var style_contentnone = {
				display: "none"
			};
		} else {
			style_node = {
				display: "none"
			};
			style_contentnone = {
				display: "block"
			};
		}
		var nodes = this.props.data.map(function(comment) {
			var status = "";
			if (comment.d == "1") {
				status = "已取消";
			} else {
				if (comment.isorder == "1") {
					status = "已就诊";
				} else if (comment.timestatus == "1") {
					status = "已过期";
				} else if (comment.timestatus == "0") {
					status = "未就诊";
				}
			}
			var worktime = "";
			var stime = new Date((comment.starttime) * 1000);
			var etime = new Date((comment.endtime) * 1000);
			worktime = (stime.getHours() + ":" + (stime.getMinutes() < 10 ? "0" + stime.getMinutes() : stime.getMinutes())) + "~" + (etime.getHours() + ":" + (etime.getMinutes() < 10 ? "0" + etime.getMinutes() : etime.getMinutes()));

			var type = "";
			var typeCss = "";
			if (comment.isfirst == 0) {
				type = "初诊";
				typeCss = "res-center-newly";
			} else {
				type = "复诊";
				typeCss = "res-center-referral";
			}

			var gender = "";
			var genderCss = "";
			if (comment.gender == "1") {
				gender = "男";
				genderCss = "res-center-man";
			} else if (comment.gender == "-1") {
				gender = "女";
				genderCss = "res-center-woman";
			} else {
				gender = "未知";
				genderCss = "res-center-unknowsex";
			}
			//var patientmobile = "";
			return (
				<Comment 
		          	key={comment.bookingid}
		          	bookingid={comment.bookingid}
		          	status={status}
		          	workdate={comment.workdate}

		          	worktime={worktime}
		          	doctorname={comment.doctorname}
		          	type={type}
		          	typeCss={typeCss}
		          	patientname={comment.patientname}
		          	patientmobile={isMockMobile(comment.patientmobile)}
		          	gender={gender}
		          	genderCss={genderCss}
		          	msg={comment.msg}
		          >
		          </Comment>
			);
		});
		return (
			<div>
				<div className="panel panel-primary no-border">
					<PagingSearch sumtotal={this.props.sumtotal} searchClick={this.searchClick} />
					<div className="list-group">
						<div style={style_node}>
							{nodes}
						</div>
						<div className="list-group" style={style_contentnone}>
							<a href="#" className="list-group-item res-center-list paddingtop">
							<div className="text-center">
								<span className="res-center-username">暂无数据</span>
							</div>
							</a>
						</div>
					</div>
				</div>
				<nav style={style_node}>
					<PagingPN prevClick={this.prevClick} nextClick={this.nextClick} />
				</nav>
			</div>
		);
	}
});

var Comment = React.createClass({
	goDetail: function() {
		//setCookie("bookingID", this.props.bookingid, 30);
		//setCookie("gobackURL", "reservation_center.html", 30);
		window.open("reservation_det.html" +
			re_str("hname", request("hname"), 0) +
			re_str("bookingID", this.props.bookingid, 1) +
			re_str("gobackURL", "reservation_center.html", 1));
	},
	render: function() {
		return (
			<a href="#" className="list-group-item res-center-list paddingtop" onClick={this.goDetail}>
				<div className="list-group-item-heading">
					<span className="res-center-username">{this.props.patientname}</span>
					<span className={this.props.typeCss}>{this.props.type}</span>
					<span className={this.props.typeCss}>{this.props.status}</span>
					<span className={this.props.genderCss}>{this.props.gender}</span>
				</div>
				<div className="list-group-item-text">
					<span className="res-center-doctor">挂号医生：{this.props.doctorname}</span>
					<span className="res-center-datetime pull-right">{this.props.workdate}</span>
				</div>
				<p className="list-group-item-text res-center-text">电话号码：{this.props.patientmobile}</p>
				<p className="list-group-item-text res-center-text">挂号备注：{this.props.msg}</p>
			</a>

		);
	}
});


var MainBox = React.createClass({
	getInitialState: function() {
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
	      	<Top_Area titleName="挂号中心" btnDisplay="block" btnText="新增挂号" btnColor="resbg-color" link="reservation_add"  />
	        <Condition_Area onCommentSubmit={this.handleCommentSubmit}/>
	        <a className="new-message" href="#"><div id="newmessage" onClick={this.dj}></div></a>
	        <List_Area onCommentSubmit={this.handleCommentSubmit} data={this.state.data} sumtotal={sum} />
	        </div>
		);
	},
	dj: function() {
		$(".new-message").css("display", "none");
		$(".bottom20").css("margin-bottom", "20px");
		$("#ResNum")[0].innerText = "";
		refleshData(refObj);
		this.setState({
			data: dataList
		});
	}
});

setInterval(
	function() {
		getNeworderlen(refObj);
	}, 5e3);
// 获取(刷新)列表信息
var neworderlen = 0;

function getNeworderlen(refObj) {
	var _params = {
		"currentPage": refObj.currentPage,
		"timeid": refObj.timeid,
		"querytime": refObj.querytime,
		"bookstatusid": refObj.bookstatusid,
		"doctorid": refObj.doctorid,
		"patientname": refObj.patientname
	};
	$.ajax({
		url: serviceurl + "booking/hosBooking",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,
		success: function(dt) {
			if (dt.status == "success") {
				var sumnow = dt.map.page.totalCount;
				neworderlen = sumnow - sum;
				console.log(neworderlen);
				if (neworderlen > 0) {
					$(".new-message").css("display", "block");
					$(".bottom20").css("margin-bottom", "0");
					$("#newmessage")[0].innerText = "您有" + neworderlen + "条新的挂号，点击查看";
					$("#ResNum")[0].innerText = neworderlen;
				}
			}
		},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
};

var App = React.createClass({
	render: function() {
		return (
			<div>
			<nav className="navbar navbar-inverse navbar-fixed-top" id="topMainBox">
				<TopBox />
		    </nav>
		    <div className="container content-middle">
		        <div className="row">
		            <div className="col-sm-3" id="leftMainBox">
		            	<LeftBox />
		            </div>
		            <div className="col-sm-9">
		                <MainBox data={dataList} />
		            </div>
		        </div>
		    </div>
		    <LoadingBox />
		    </div>)
	}
})

ReactDOM.render(
	<App />,
	document.getElementById('app')
);

export default React.createClass({
	render: function() {
		return (
			<App />)
	}
})