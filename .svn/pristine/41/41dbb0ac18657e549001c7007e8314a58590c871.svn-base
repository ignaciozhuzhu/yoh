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
	PagingPN,
	LoadingBox
} from './components/Paging.js';

import {
	getUserInfo
} from './ajax/user.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import {
	docList
} from './ajax/listHosDoctor.js';

import {
	Tab_Right
} from './components/res/Registration.js';
import {
	Tab_Right_
} from './components/res/Registration_.js';
import {
	SelectClientBox
} from './components/res/SelectClient.js';
import {
	refleshSBData,
	dataList,
	sum,
	pageAllnum,
	subscribeList,
	Subscribe_det
} from './ajax/refleshSBData.js';

var startDate = ""; //startDate,默认值
var endDate = ""; //endDate,默认值
var confirmID = ""; //confirmID,默认值
var arriveID = ""; //arriveID,默认值
var searchText = ""; //searchText搜索的文本,默认值
var thatDate = new Date(); //代表相对的日期
var conditionState = 0; //0代表当前是查询所有，1代表当前是高级搜索查询，2代表当前是时间点的查询
var conditiontype = 0;
moment.locale('zh-cn');
//修改时间展示
function changeTimeShow(date) {
	var showStr = "";
	var dayNum = 0;
	var startTime = new Date(Date.parse((new Date()))).getTime();
	var endTime = new Date(Date.parse(date)).getTime();
	dayNum = Math.round(Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24));
	var week = "周日";
	switch (date.getDay()) {
		case 0:
			week = "周日";
			break;
		case 1:
			week = "周一";
			break;
		case 2:
			week = "周二";
			break;
		case 3:
			week = "周三";
			break;
		case 4:
			week = "周四";
			break;
		case 5:
			week = "周五";
			break;
		case 6:
			week = "周六";
			break;
	}
	showStr = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日 " + week + " " + (dayNum == 0 ? "今天" : "相距" + dayNum + "天");
	$("#showTime").text(showStr);
	thatDate = date;
};

function refleshObject(currentPage, startDate, endDate, confirmID, arriveID, searchText) {
	this.currentPage = currentPage;
	this.startDate = startDate;
	this.endDate = endDate;
	this.confirmID = confirmID;
	this.arriveID = arriveID;
	this.searchText = searchText;
}
var refObj = new refleshObject(1, startDate, endDate, confirmID, arriveID, searchText);
$(document).ready(function() {
	leftBoxClick("subscribe", 0, "subscribe");
	//获取当前用户信息
	getUserInfo("subscribe_center.html");
	$("#loading").hide();
	$("#loading_end").show();

});

var Condition_Area = React.createClass({
	getInitialState: function() {
		return {
			startDate: moment(),
			endDate: moment()
		};
	},
	searchClick: function() {
		conditionState = 1;
		refObj.currentPage = 1;
		refObj.startDate = $("#startDate").val();
		refObj.endDate = $("#endDate").val();
		refObj.confirmID = $("#confirmSelect").val();
		refObj.arriveID = $("#arriveSelect").val();
		refObj.searchText = $("#searchText").val();
		refleshSBData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	handleChangeStart: function(date) {
		this.setState({
			startDate: date
		});
	},
	handleChangeEnd: function(date) {
		this.setState({
			endDate: date
		});
	},
	render: function() {
		return (
			<div>
            	<div className="list-group bmargin0">
                    <div className="list-group-item no-border sub_center_toolbox">
                        <div className='row'>
                            <div className='col-xs-5'>
                                <DatePicker ref="startDate" id="startDate"
				                    selected={this.state.startDate}
				                    onChange={this.handleChangeStart}
				                    onCommentSubmit={this.handleCommentSubmit}
									selectsStart  startDate={this.state.startDate}
									endDate={this.state.endDate}
				                    className='form-control sub_date '
				                />~
				                <DatePicker ref="endDate" id="endDate"
				                    selected={this.state.endDate}
				                    onChange={this.handleChangeEnd}
				                    onCommentSubmit={this.handleCommentSubmit}
									selectsEnd  startDate={this.state.startDate}
									endDate={this.state.endDate}
				                    className='form-control sub_date'
				                />
                            </div>
                            <div className='col-xs-4'>
                                <span className="sub_select_box">
                                	<select ref="confirmSelect" className="form-control sub_select" id="confirmSelect">
					                    <option value = "">全部状态</option>
					                    <option value = "0">未确认</option>
					                    <option value = "1">已确认</option>
					                    <option value = "2">已失约</option>
					                </select>
					            </span>
					            <span className="sub_select_box lmargin">
					                <select ref="arriveSelect" className="form-control sub_select" id="arriveSelect">
					                    <option value = "">全部状态</option>
					                    <option value = "0">未到达</option>
					                    <option value = "1">已到达</option>
										<option value = "2">已过期</option>
					                </select>
				                </span>
                            </div>
                            <div className="col-xs-3">
                                <div className="input-group">
			                        <input type="text" className="form-control sub_date_input" ref="searchText" id="searchText" placeholder="姓名/手机查询"/>
			                        <span className="input-group-btn">
			                            <button className="btn btn-default" type="button" onClick={this.searchClick}>搜索</button>
			                        </span>
			                    </div>	
                            </div>
                        </div>
                    </div>
                </div>
            </div>

		);
	}
});

var List_Area = React.createClass({
	componentDidMount: function() {
		changeTimeShow(new Date());
		this.searchallClick();
	},
	getInitialState: function() {
		return {
			orderid: null,
			//pageData : [pageAllnum,refObj.currentPage]
		}
	},
	comMitorderid: function(item) {
		this.props.comMitorderid(item)
	},
	searchallClick: function() {
		refObj.currentPage = 1;
		refObj.startDate = "";
		refObj.endDate = "";
		refObj.confirmID = "";
		refObj.arriveID = "";
		refObj.searchText = "";
		refleshSBData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	nextClick: function() {
		if (conditiontype == conditionState) {
			refObj.currentPage++;
		} else {
			refObj.currentPage = 1;
		}
		refleshSBData(refObj);
		conditiontype = conditionState;
		this.props.onCommentSubmit(dataList);
		if (pageAllnum == 1) {
			$("#sub_center").find("#previousPage").addClass("hidden");
			$("#sub_center").find("#nextPage").addClass("hidden");
		} else if (refObj.currentPage == pageAllnum) {
			$("#sub_center").find("#previousPage").removeClass("hidden");
			$("#sub_center").find("#nextPage").addClass("hidden");
		} else if (refObj.currentPage == 1) {
			$("#sub_center").find("#previousPage").addClass("hidden");
			$("#sub_center").find("#nextPage").removeClass("hidden");
		} else {
			$("#sub_center").find("#previousPage").removeClass("hidden");
			$("#sub_center").find("#nextPage").removeClass("hidden");
		}
	},
	prevClick: function() {
		if (conditiontype == conditionState) {
			refObj.currentPage--;
		} else {
			refObj.currentPage = 1;
		}
		refObj.currentPage = refObj.currentPage < 1 ? 1 : refObj.currentPage;
		refleshSBData(refObj);
		conditiontype = conditionState;
		this.props.onCommentSubmit(dataList);
		if (pageAllnum == 1) {
			$("#sub_center").find("#previousPage").addClass("hidden");
			$("#sub_center").find("#nextPage").addClass("hidden");
		} else if (refObj.currentPage == pageAllnum) {
			$("#sub_center").find("#previousPage").removeClass("hidden");
			$("#sub_center").find("#nextPage").addClass("hidden");
		} else if (refObj.currentPage == 1) {
			$("#sub_center").find("#previousPage").addClass("hidden");
			$("#sub_center").find("#nextPage").removeClass("hidden");
		} else {
			$("#sub_center").find("#previousPage").removeClass("hidden");
			$("#sub_center").find("#nextPage").removeClass("hidden");
		}
	},
	toToday: function(e) {
		conditionState = 2;
		refObj.currentPage = 1;
		var date = new Date();
		changeTimeShow(date);
		var thisdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
		refObj.startDate = thisdate;
		refObj.endDate = thisdate;
		refleshSBData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	addOneDay: function() {
		conditionState = 2;
		changeTimeShow(new Date((thatDate / 1000 + 1 * 24 * 60 * 60) * 1000));
		refObj.currentPage = 1;
		refObj.startDate = thatDate.getFullYear() + "-" + (thatDate.getMonth() + 1) + "-" + thatDate.getDate();
		refObj.endDate = thatDate.getFullYear() + "-" + (thatDate.getMonth() + 1) + "-" + thatDate.getDate();
		refObj.confirmID = "";
		refObj.arriveID = "";
		refObj.searchText = "";
		refleshSBData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	subtractOneDay: function() {
		conditionState = 2;
		changeTimeShow(new Date((thatDate / 1000 - 1 * 24 * 60 * 60) * 1000));
		refObj.currentPage = 1;
		refObj.startDate = thatDate.getFullYear() + "-" + (thatDate.getMonth() + 1) + "-" + thatDate.getDate();
		refObj.endDate = thatDate.getFullYear() + "-" + (thatDate.getMonth() + 1) + "-" + thatDate.getDate();
		refObj.confirmID = "";
		refObj.arriveID = "";
		refObj.searchText = "";
		refleshSBData(refObj);
		this.props.onCommentSubmit(dataList);
	},
	render: function() {
		var o = this;
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
				display: "table"
			};
		}
		var nodes = this.props.data.map(function(comment) {
			var status = "";
			var important = "";
			var reserved_timerange = "";
			var reserved_Time = "";

			if (comment.confirm == 0) {

				if (comment.arrive == 2) {
					status = "已过期";
				} else {
					status = "未确认";
				}
			} else if (comment.confirm == 2) {
				status = "已失约";
			} else if (comment.confirm == 1) {
				if (comment.arrive == 0) {
					status = "未到达";
				} else if (comment.arrive == 1) {
					status = "已到达";
				} else if (comment.arrive == 2) {
					status = "已过期";
				}
			}

			if (comment.reserved_timerange != "") {
				var reserved_Time_ = comment.reserved_timerange.split("-");
				var reserved_Time_1 = reserved_Time_[0].split(":");
				var reserved_Time_2 = reserved_Time_[1].split(":");
				reserved_timerange = reserved_Time_1[0] + ":" + reserved_Time_1[1] + "-" + reserved_Time_2[0] + ":" + reserved_Time_2[1];
			}

			if (comment.important == "1") {
				important = "★";
			}

			return (
				<Comment 
                    key={comment.id}
                    id={comment.id}
                    status={status}
                    reserved_date={comment.reserved_date}
                    reserved_timerange={reserved_timerange}
                    doctor_name={comment.doctor_name}
                    patient_name={comment.patient_name}
                    patient_mobile={comment.patient_mobile}
                    items={comment.items}
                    remark={comment.remark}
                    important={important}
                    comMitorderid={o.comMitorderid}
                >
                </Comment>
			);
		});
		return (
			<div>
				<div className="panel panel-default">
					<div className="panel-heading">
	                    <span>
	                        <div className="btn-group">
	                            <button type="button" className="btn btn-default" onClick={this.toToday}>今天</button>
	                            <button type="button" className="btn btn-default" onClick={this.subtractOneDay}><i className="glyphicon glyphicon-chevron-left"></i></button>
	                            <button type="button" className="btn btn-default" onClick={this.addOneDay}><i className="glyphicon glyphicon-chevron-right"></i></button>
	                        </div>
	                    </span>
	                    <span id="showTime" className="lmargin"></span>
	                    <span><button type="button" className="btn btn-default pull-right hide">新增预约</button></span>
	                </div>
	                <table className="table table-hover table-striped" id="table-show">
	                	<tbody>
		                    <tr>
		                        <td>患者姓名</td>
		                        <td>电话</td>
		                        <td>预约医生</td>
		                        <td>预约日期</td>
		                        <td>预约时段</td>
		                        <td>预约事项</td>
		                        <td>状态</td>
		                        <td>预约备注</td>
		                    </tr>
		                    {nodes}
	                    </tbody>
	                </table>
	                <table className="table table-striped table-hover table-bordered" style={style_contentnone}>
						<tbody>
							<tr>
								<td className="text-center">暂无数据</td>
							</tr>
						</tbody>
					</table>
				</div>
				<nav style={style_node} id="sub_center">
					<PagingPN prevClick={this.prevClick} nextClick={this.nextClick}  />
				</nav>
			</div>
		);
	}
});

var Comment = React.createClass({
	gosub_det: function(e) {
		this.props.comMitorderid(e);
		$("#sub_detBox").css({
			"right": "0"
		});
		$(".mask-div").css({
			"height": $("html")[0].scrollHeight,
			"width": $("html")[0].scrollWidth
		})
		$(".mask-div").show();
	},
	render: function() {
		var o = this;
		return (
			<tr onClick={o.gosub_det.bind(null, this.props.id)} ref={this.props.id} id={this.props.id} className="pointer">
                <td><span className="sub_det_important">{this.props.important}</span>{this.props.patient_name}</td>
				<td>{this.props.patient_mobile}</td>
				<td>{this.props.doctor_name}</td>
                <td>{this.props.reserved_date}</td>
				<td>{this.props.reserved_timerange}</td>
				<td>{this.props.items}</td>
				<td>{this.props.status}</td>
				<td>{this.props.remark}</td>
			</tr>
		);
	}
});


//主box
var MainBox = React.createClass({
	getInitialState: function() {
		//refleshSBData(refObj);
		return {
			data: dataList,
			orderid: null
		};
	},
	comMitorderid: function(item) {
		this.props.comMitorderid(item)
	},
	componentDidMount: function() {
		this.setState({
			data: dataList
		});
	},
	clearsbid: function(item) {
		this.props.clearsbid(item)
	},
	handleCommentSubmit: function(comment) {
		this.props.refleshstate(comment)
	},
	render: function() {
		return (
			<div>
                <Top_Area titleName="预约中心" btnDisplay="block" btnText="新增预约" btnColor="resbg-color" sideFrame="Right" clearsbid={this.clearsbid} />
                <a className="new-message" href="#">
                    <div id="newmessage" onClick={this.dj}></div>
                </a>
                <Condition_Area onCommentSubmit={this.handleCommentSubmit}/>
                <List_Area comMitorderid={this.comMitorderid} onCommentSubmit={this.handleCommentSubmit} data={this.props.data} sumtotal={sum} />
	        </div>
		);
	},
	dj: function() {
		$(".new-message").css("display", "none");
		$(".bottom20").css("margin-bottom", "20px");
		$("#ResNum")[0].innerText = "";
		refleshSBData(refObj);
		this.setState({
			data: dataList
		});
	}
});


var App = React.createClass({
	getInitialState: function() {
		return {
			orderid: "",
			nextorderid: "",
			confirm: "",
			arrive: "",
			data: dataList
		}
	},
	comMitorderid: function(item) {
		this.setState({
			orderid: item
		})
	},
	getprops: function(sbid, confirm, arrive) {
		this.setState({
			nextorderid: sbid,
			confirm: confirm,
			arrive: arrive
		});
	},
	clearsbid: function(sbid) {
		this.setState({
			nextorderid: sbid
		});
	},
	refleshTable: function() {
		refObj.currentPage = 1;
		refObj.startDate = "";
		refObj.endDate = ""
		refObj.confirmID = ""
		refObj.arriveID = ""
		refObj.searchText = ""
		refleshSBData(refObj);
		this.refleshstate(dataList);
	},
	refleshstate: function(comment) {
		this.setState({
			data: comment
		});
	},
	render: function() {
		return (
			<div>
				<Tab_Right_ Title="挂号" Medicalnum="block" getsbid_={this.state.nextorderid} refleshTable={this.refleshTable}/>
				<Tab_Right Title="预约" refleshTable={this.refleshTable} Medicalnum="none" getsbid={this.state.nextorderid}  getconfirm={this.state.confirm} getarrive={this.state.arrive} />
		    	<SelectClientBox />
	            <div className="mask-div" ></div>
                <nav className="navbar navbar-inverse navbar-fixed-top" id="topMainBox">
                    <TopBox />
                </nav>
                <div className="container content-middle">
                    <div className="row">
                        <div className="col-sm-3" id="leftMainBox">
                            <LeftBox />
                        </div>
                        <div className="col-sm-9">
                            <MainBox comMitorderid={this.comMitorderid} data={this.state.data} clearsbid={this.clearsbid} refleshstate={this.refleshstate} />
                        </div>
                    </div>
                </div>
                <Subscribe_det refleshTable={this.refleshTable} getsbid={this.state.orderid} id="subscribe_det_box" className="subscribe_det_box" getprops={this.getprops} />
                <LoadingBox />
		    </div>
		)
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