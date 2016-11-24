'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	getMobilTime,
	leftBoxClick
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

var docList = [];
var doctorID = "";
var workTimeList = [];
var workdayid = "";
var noon = "1";
var dateNumIni = 0;
var doctorNamePub = "";
$(document).ready(function() {
	//判断登陆与否
	testLogin("reservation_add.html");
	leftBoxClick("collapseRes", 1, "res");

	$("#saveBtn").click(function() {
		$("#saveBtn").attr("disabled", "disabled");
		var name = $("#inputName").val();
		var mobile = $("#inputMobile").val();
		var wtime = $("#selectWorkTime").val();
		var isfirst = $('input:radio[name=inlineRadioOptions]:checked').val();
		var msg = $("#remarks").val();

		if (Vld.isNull(name.trim())) {
			toast.show("请输入姓名！");
			$("#saveBtn").attr("disabled", false);
			return;
		}
		/*		if (Vld.isMobilePhone(mobile, 'zh-CN') === false) {
					toast.show('请输入11位手机号');
					$("#saveBtn").attr("disabled", false);
					return;
				}*/
		if (Vld.isNull(wtime.trim()) || Vld.equals(wtime, "-请选择时间段-")) {
			toast.show("请选择时间段！");
			$("#saveBtn").attr("disabled", false);
			return;
		}
		var _params = {
			"worktimeid": wtime,
			"mobile": mobile,
			"name": name,
			"isfirst": isfirst,
			"msg": msg,
			sectiontime: $("#selectWorkTime").find("option:selected").text()
		};
		$.ajax({
			url: serviceurl + "hospital/submitBooking",
			type: "post",
			dataType: "json",
			data: JSON.stringify(_params),
			contentType: "application/json",
			cache: false,

			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					toast.show("挂号成功,查看请前往“挂号列表”");
					$("#myModal").modal("hide");
					$("#saveBtn").attr("disabled", false);
				} else {
					toast.show(dt.message);
					$("#saveBtn").attr("disabled", false);
					return;
				}
			},

			error: function(XMLHttpRequest) {
				if (XMLHttpRequest.status == "500") {
					toast.show("该用户在该时间段内已挂号！");
					$("#saveBtn").attr("disabled", false);
					return;
				} else {
					toast.show(XMLHttpRequest.responseJSON.message);
					$("#saveBtn").attr("disabled", false);
					return;
				}
			}
		});
	});
});

var prepareData = function(workdayid, noon) {
	$("#inputName").val("");
	$("#inputMobile").val("");
	$("#remarks").val("");
	$.ajax({
		url: serviceurl + "workDay/bookingQueryTime",
		type: "get",
		dataType: "json",
		data: {
			workdayid: workdayid,
			noon: noon
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				$("#selectWorkTime").html("");
				var options = "<option>-请选择时间段-</option>";
				$.each(dt.data, function(idx, item) {
					// var stime = "";
					// var etime = "";
					// stime = getMobilTime((item.starttime) * 1000);
					// stime.substring(stime.indexOf("午") + 1, stime.length - 3);
					// etime = getMobilTime((item.starttime + item.timelong) * 1000);
					// etime.substring(etime.indexOf("午") + 1, etime.length - 3);
					// options += "<option value='" + item.id + "'>" + stime.substring(5, stime.length - 3) + "~" + etime.split(" ")[1].substring(0, etime.split(" ")[1].length - 3) + "</<option>";
					options += "<option value=" + item.worktimeid + ">" + item.timeSection + "</option>";
				});
				$("#selectWorkTime").append(options);
				if(dt.data==null){
					toast.show("目前没有时间段可选择！");
					return;
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

function createDateBox() {
	for (var dateNum = dateNumIni; dateNum < dateNumIni + 7; dateNum++) {
		var thisDate = new Date(((new Date()) / 1000 + dateNum * 24 * 60 * 60) * 1000);
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
			"<li class='pointer' id='" + timedate1 + "-" + timedate2 + "-date'>" + timedate1 + "-" + timedate2 + "<br />" + Day + "</li>"
		);
		var dstr = "<ul class=\"date\" >" +
			"<li class='nodate pointer' id='" + timedate1 + "-" + timedate2 + "-morning'>上午</li>" +
			"<li class='nodate pointer' id='" + timedate1 + "-" + timedate2 + "-afternoon'>下午</li>" +
			"</ul>";
		if (dateNum == dateNumIni) {
			$("#docWorkTime").append("<ul class=\"name\" id=\"doc_name\"><li></li></ul>");
		}
		$("#docWorkTime").append(dstr);
	}
}
var refleshList = function(doctorid, doctorName) {
	$("#res-select-doctorname").text(doctorName);
	if (doctorName.length == 1) {
		$("#res-select-doctorname").css("line-height", "112px");
	} else if (doctorName.length == 2) {
		$("#res-select-doctorname").css("line-height", "56px");
	} else if (doctorName.length == 3) {
		$("#res-select-doctorname").css("line-height", "37px");
	} else {
		$("#res-select-doctorname").css("line-height", "28px");
	}

	$("#doc_name").html("<li>" + doctorName + "</li>");
	for (var dateNum = dateNumIni; dateNum < dateNumIni + 7; dateNum++) {
		var thisDate = new Date(((new Date()) / 1000 + dateNum * 24 * 60 * 60) * 1000);
		var timedate1 = thisDate.getMonth() + 1;
		var timedate2 = thisDate.getDate();
		// $("#"+timedate1+"-"+timedate2+"-morning").attr("data-target","");
		$("#" + timedate1 + "-" + timedate2 + "-morning").removeClass("resbg-table-color");
		$("#" + timedate1 + "-" + timedate2 + "-morning").attr({
			"data-target": "",
			"data-toggle": ""
		});
		// $("#"+timedate1+"-"+timedate2+"-afternoon").attr("data-target","");
		$("#" + timedate1 + "-" + timedate2 + "-afternoon").removeClass("resbg-table-color");
		$("#" + timedate1 + "-" + timedate2 + "-afternoon").attr({
			"data-target": "",
			"data-toggle": ""
		});
	}
	$.ajax({
		url: serviceurl + "doctor/listDocWorktime",
		type: "get",
		dataType: "json",
		data: {
			doctorid: doctorid
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log(JSON.stringify(dt));
			if (dt.status == "success") {

				workTimeList = dt.data;
				$.each(workTimeList, function(idx, item) {
					var time = new Date(item.workdate);
					if (time != "undefine") {
						var worktimedate1 = time.getMonth() + 1;
						var worktimedate2 = time.getDate();
						//上午
						if (item.morning == 0) {
							let thisElement = $("#" + worktimedate1 + "-" + worktimedate2 + "-morning");
							thisElement.addClass("backgroundgray");
							thisElement.click(function() {
								toast.show("该时间段已无号可挂！")
							})
						}
						if (item.morning == 1) {
							let thisElement = $("#" + worktimedate1 + "-" + worktimedate2 + "-morning");
							thisElement.addClass("resbg-table-color");
							thisElement.click(function() {
								thisElement.attr("data-target", "#myModal");
								thisElement.attr("data-toggle", "modal");
								workdayid = item.workdayid;
								noon = "1";
								prepareData(workdayid, noon);
							});
						}
						//下午
						if (item.afternoon == 0) {
							let thisElement = $("#" + worktimedate1 + "-" + worktimedate2 + "-afternoon");
							thisElement.addClass("backgroundgray");
							thisElement.click(function() {
								toast.show("该时间段已无号可挂！")
							})
						}
						if (item.afternoon == 1) {
							let thisElement = $("#" + worktimedate1 + "-" + worktimedate2 + "-afternoon");
							thisElement.addClass("resbg-table-color");
							thisElement.click(function() {
								thisElement.attr("data-target", "#myModal");
								thisElement.attr("data-toggle", "modal");
								workdayid = item.workdayid;
								noon = "0";
								prepareData(workdayid, noon);
							});
						}
					}
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

var PagesClick = React.createClass({
	render: function() {
		var displaynone = {
			"display": "none"
		}
		return (
			<div>
	            <nav>
					<ul className="pager">
					<li className="previous" id="previousPage" style={displaynone}><a href="#" onClick={this.prevClick}>上一页</a></li>
					<li className="next" id="nextPage"><a href="#" onClick={this.nextClick}>下一页</a></li>
					</ul>
				</nav>
         	</div>
		)
	},
	prevClick: function() {
		dateNumIni -= 7;
		if (dateNumIni == 0) {
			$("#previousPage").hide();
		}
		this.emptyfun();
	},
	nextClick: function() {
		$("#previousPage").show();
		dateNumIni += 7;
		this.emptyfun();
	},
	emptyfun: function() {
		$("#docWorkTime").empty();
		$("#ul").empty();
		$("#ul").append("<li>日期</li>");
		createDateBox();
		refleshList(doctorID, doctorNamePub);
		if (!doctorID) {
			$("#res-select-doctorname").append("选<br />择<br />医<br />生</li>");
		}
		$(".date").on("click", "li", function() {
			var thisClass = $(this).attr("class");
			if (thisClass == "pointer resbg-table-color") {

			} else if (thisClass == "nodate pointer") {
				toast.show("请选择医生");
			} else if (thisClass == "pointer") {
				toast.show("未排班");
			}
		});
	}
})

var Condition_Area = React.createClass({
	getInitialState: function() {
		createDateBox();
		$(".date").on("click", "li", function() {
			var thisClass = $(this).attr("class");
			if (thisClass == "pointer resbg-table-color") {

			} else if (thisClass == "nodate pointer") {
				toast.show("请选择医生");
			} else if (thisClass == "pointer") {
				toast.show("未排班");
			}
		});

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
					$("#loading_end").show();

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
		return {
			data: []
		};
	},
	componentDidMount: function() {

	},
	searchClick: function(e) {
		if (e.target.tagName == "A") {
			$(".date").children("li").removeClass("nodate");
			$.each(e.target.parentElement.children, function(idx, item) {
				item.className = "filter-item";
			});
			e.target.className = "filter-item active resbg-color";
			console.log("yishengtiao")
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
		//刷新该医生排班列表
		console.log("yishengmingz")
		var doctorName = this.props.doctorname;
		doctorNamePub = this.props.doctorname;
		refleshList(doctorID, doctorName);
	},
	render: function() {
		return (
			<a href="#" className="filter-item" name="condition_Doctor" rel={this.props.doctorid} onClick={this.docClick}>{this.props.doctorname}</a>
		);
	}
});

var MainBox = React.createClass({
	render: function() {
		return (
			<div>
	      	<Top_Area titleName="新增挂号" />
	        <Condition_Area/>
	      </div>
		);
	}
});



ReactDOM.render(
	<MainBox />,
	document.getElementById('content')
);
ReactDOM.render(
	<PagesClick />,
	document.getElementById('buttonBox')
);

ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);