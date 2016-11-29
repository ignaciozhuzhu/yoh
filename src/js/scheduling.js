'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	leftBoxClick
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import {
	testLogin
} from './ajax/user.js';

import Vld from 'validator';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import {
	SwitchBox
} from './components/SwitchBox.js'

$(document).ready(function() {
	//判断登陆与否
	testLogin("scheduling.html");
	leftBoxClick("collapseSch", 0, "sch", 2);
});
var startdate = "";
var enddate = "";
moment.locale('zh-cn');
var TimerProBtn = React.createClass({
	proClick: function() {
		this.props.onCommentSubmit("pro");
	},
	render: function() {
		return (
			<button className="btn btn-default sch-btn-y" type="submit" onClick={this.proClick}>
				<i className="glyphicon glyphicon-chevron-left"></i>
			</button>
		);
	}
});
var TimerNextoBtn = React.createClass({
	nextClick: function() {
		this.props.onCommentSubmit("next");
	},
	render: function() {
		return (
			<button className="btn btn-default sch-btn-y" type="submit" onClick={this.nextClick}>
				<i className="glyphicon glyphicon-chevron-right"></i>
			</button>
		);
	}
});

var TimerBox = React.createClass({
	displayName: 'Example',
	getInitialState: function() {
		reflesh(moment().toDate());
		$.ajax({
			url: serviceurl + "hospital/currentInfo",
			type: "get",
			dataType: "json",
			contentType: "application/json",
			cache: false,
			async: false,
			success: function(dt) {
				//console.log("诊所详细信息： " + JSON.stringify(dt));
				if (dt.status == "success") {
					var worktimeD = dt.data.hostime;
					$("#worktime-morning").html(worktimeD.split(",")[0]);
					$("#worktime-afternoon").html(worktimeD.split(",")[1]);
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
		return {
			startDate: moment()
		};
	},
	handleChange: function(date) {
		reflesh(date.toDate());
		this.setState({
			startDate: date
		});
	},
	handleCommentSubmit: function(comment) {
		var thisdate;
		if (comment == "pro") {
			thisdate = moment(this.state.startDate.toDate()).subtract('days', 7);
		} else if (comment == "next") {
			thisdate = moment(this.state.startDate.toDate()).add('days', 7);
		}
		this.setState({
			startDate: thisdate
		});
		reflesh(thisdate.toDate());
	},
	render: function() {
		return (
			<div>
			<DatePicker
				selected={this.state.startDate}
				onChange={this.handleChange}
				onCommentSubmit={this.handleCommentSubmit}
				startDate={this.state.startDate}
				className='form-control input-sm'
			/>

			<div className="btn-group lmargin" role="group" aria-label="...">
				<TimerProBtn onCommentSubmit={this.handleCommentSubmit} />
				<TimerNextoBtn onCommentSubmit={this.handleCommentSubmit} />
			</div>

		</div>
		);
	}
});

ReactDOM.render(
	<TimerBox  />,
	document.getElementById('startDate')
);

var hosAddWork = function(doctorid, workdate, type, status, element) {
	var arr = workdate.split("-");
	var thatDate = new Date(arr[0], arr[1] - 1, arr[2])
	var thisDate = new Date();
	var _params = {
		"doctorid": doctorid,
		"workdate": workdate,
		"type": type,
		"status": status
	};
	$.ajax({
		url: serviceurl + "hospital/addWorktime",
		type: "post",
		dataType: "json",
		data: JSON.stringify(_params),
		contentType: "application/json",
		cache: false,

		success: function(dt) {
			console.log(JSON.stringify(dt)+"新的排班增删");
			if (dt.status == "success") {
				//提示排班成功
				// toast.show("排班成功"); // 成功每次提示太干扰，不需提示，错误才提示，whg 2016.8.11
				if( status == 0 ){
					if (element != undefined) {
						element.addClass("schbg-table-color pointer");
					}
				}else if( status == 1 ){
					element.removeClass("schbg-table-color pointer");
					element.addClass("pointer");
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
};

var hosBeforeAdd = function(doctorid, workdate, type, element) {
	var arr = workdate.split("-");
	var thatDate = new Date(arr[0], arr[1] - 1, arr[2])
	var thisDate = new Date();
	/*$.ajax({
		url: serviceurl + "workDay/hosBeforeAdd",
		type: "get",
		dataType: "json",
		data: {
			doctorid: doctorid,
			workdate: workdate,
			type: type
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log(JSON.stringify(dt)+"是否听诊hosBeforeAdd");
			if (dt.status == "success") {
				if (dt.data > 0) {
					if (window.confirm('是否要停诊已经有挂号的排班？')) {
						hosAddWork(doctorid, workdate, type, "1");
					} else {
						return;
					}
				} else {
					hosAddWork(doctorid, workdate, type, "1");
				}
				element.removeClass("schbg-table-color pointer");
				element.addClass("pointer");
			} else {
				toast.show(dt.message);
				return;
			}
		},

		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});*/

	hosAddWork(doctorid, workdate, type, "1", element);
};

function reflesh(date) {
	$("#dataWorkTime").html("");
	$("#docWorkTime").html("");
	$("#ul").html("");
	$("#ul").append("<li class='date_name'>日期</li>");
	startdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	var lastdate = new Date((date / 1000 + 6 * 24 * 60 * 60) * 1000);
	enddate = lastdate.getFullYear() + "-" + (lastdate.getMonth() + 1) + "-" + lastdate.getDate();

	for (var dateNum = 0; dateNum < 7; dateNum++) {
		var thisDate = new Date((date / 1000 + dateNum * 24 * 60 * 60) * 1000);
		var NowTime = Date.parse(thisDate);
		var timedate3 = thisDate.getFullYear();
		var timedate1 = thisDate.getMonth() + 1;
		var timedate2 = thisDate.getDate();
		var Day = "";
		if (thisDate.getDay() == "1") {
			Day = "周一";
		} else if (thisDate.getDay() == "2") {
			Day = "周二";
		} else if (thisDate.getDay() == "3") {
			Day = "周三";
		} else if (thisDate.getDay() == "4") {
			Day = "周四";
		} else if (thisDate.getDay() == "5") {
			Day = "周五";
		} else if (thisDate.getDay() == "6") {
			Day = "周六";
		} else if (thisDate.getDay() == "0") {
			Day = "周日";
		}
		$("#ul").append(
			"<li>" + timedate1 + "-" + timedate2 + "<br>" + Day + "</li>"
		);
	}
	$.ajax({
		url: serviceurl + "workDay/listHosWorkTime",
		type: "get",
		dataType: "json",
		data: {
			"startdate": startdate,
			"enddate": enddate
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			if (dt.status == "success") {
				//隐藏loading
				$("#loading").hide();
				$("#loading_end").show();

				var HosWorkTimeList = dt.data;
				//console.log(JSON.stringify(dt));
				$.each(HosWorkTimeList, function(docIdx, docItem) {
					var hmtlStr = "";
					var doctorname = docItem.doctorname;
					hmtlStr += "<div class='scheduling-table-doctor'>" +
						"<ul class='name'><li class='doc_name_" + docItem.doctorid + "'>" +
						doctorname + "</li></ul>";

					var workdayList = docItem.workdayList;
					$.each(workdayList, function(dayIdx, dayItem) {
						var worktimeList = dayItem.worktimeList;
						var thisID = docItem.doctorid + "_" + dayItem.workdate;
						hmtlStr += "<ul class='date'>";
						if (worktimeList.length > 1) {
							$.each(worktimeList, function(timeIdx, timeItem) {
								if (timeItem.type == "morning") {
									if (timeItem.iscurrent == "Y") {
										hmtlStr += "<li class='schbg-table-color pointer' id='" + thisID + "_morning' >上午</li>";
									} else {
										hmtlStr += "<li class='yayi-grau-bg-color pointer' id='" + thisID + "_morning'>上午</li>";
									}
								}
								if (timeItem.type == "afternoon") {
									if (timeItem.iscurrent == "Y") {
										hmtlStr += "<li class='schbg-table-color pointer' id='" + thisID + "_afternoon' >下午</li>";
									} else {
										hmtlStr += "<li class='yayi-grau-bg-color pointer' id='" + thisID + "_afternoon'>下午</li>";
									}
								}
							});
						} else if (worktimeList.length == 1) {
							$.each(worktimeList, function(timeIdx, timeItem) {
								if (timeItem.type == "morning") {
									if (timeItem.iscurrent == "Y") {
										hmtlStr += "<li class='schbg-table-color pointer' id='" + thisID + "_morning' >上午</li>";
										hmtlStr += "<li id='" + thisID + "_afternoon' class='pointer'>下午</li>";
									} else {
										hmtlStr += "<li class='yayi-grau-bg-color pointer' id='" + thisID + "_morning'>上午</li>";
										hmtlStr += "<li id='" + thisID + "_afternoon' class='pointer'>下午</li>";
									}
								}
								if (timeItem.type == "afternoon") {
									if (timeItem.iscurrent == "Y") {
										hmtlStr += "<li id='" + thisID + "_morning' class='pointer'>上午</li>";
										hmtlStr += "<li class='schbg-table-color pointer' id='" + thisID + "_afternoon' >下午</li>";
									} else {
										hmtlStr += "<li id='" + thisID + "_morning' class='pointer'>上午</li>";
										hmtlStr += "<li class='yayi-grau-bg-color pointer' id='" + thisID + "_afternoon'>下午</li>";
									}
								}
							});
						} else {
							hmtlStr += "<li id='" + thisID + "_morning' class='pointer'>上午</li>" + "<li id='" + thisID + "_afternoon' class='pointer'>下午</li>";
						}
						hmtlStr += "</ul>";
					});

					hmtlStr += "</div> ";
					$("#docWorkTime").append(hmtlStr);

					$.each(workdayList, function(dayIdx, dayItem) {
						if (doctorname.length < 5) {
							$(".doc_name_" + docItem.doctorid).css("line-height", "90px");
						} else if (doctorname.length > 4 && doctorname.length < 9) {
							$(".doc_name_" + docItem.doctorid).css("line-height", "45px");
						}
					});


				});
				//添加事件
				$.each(HosWorkTimeList, function(docIdx, docItem) {
					var workdayList = docItem.workdayList;

					function arrange(dayItem, noon, that) {
						var temp = that.attr("id");
						var arr = temp.split("_");
						var docID = arr[0];
						var date = arr[1];

						//单元格日期
						date = dayItem.workdate; //yyyy-mm-dd
						var thatDate = new Date(date.split("-")[0], date.split("-")[1] - 1, date.split("-")[2]);
						var time = new Date();
						var thisDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
						if (thisDate.getTime() > thatDate.getTime()) {
							toast.show("该日期已过期！");
							return;
						} else {
							if (Vld.equals(that.attr("class"), "pointer")) {
								//可以排班
								hosAddWork(docID, date, noon, "0", that);
								return;
							} else if (Vld.equals(that.attr("class"), "yayi-grau-bg-color pointer")) {
								toast.show("该日期不可排班！");
								return;
							}
							hosBeforeAdd(docID, date, noon, that);
						}
					}
					$.each(workdayList, function(dayIdx, dayItem) {
						var thisID = docItem.doctorid + "_" + dayItem.workdate;
						$("#" + thisID + "_morning").on("click", function() {
							arrange(dayItem, "morning", $(this));
						});
						$("#" + thisID + "_afternoon").on("click", function() {
							arrange(dayItem, "afternoon", $(this));
						});
					});
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

ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);

ReactDOM.render(
	<SwitchBox />,
	document.getElementById('switchBoxDiv')
);