'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	request
} from '../lib/common.js';
import {
	toast
} from '../lib/toast.js';

var sum = 0;
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
var dataList = [];

var subscribe = 1;
var subscribeList = [];
var detNum = 0;

var thisConfirm, thisArrive;
//获取(刷新)列表信息
var refleshSBData = function(refObj) {
	var _params = {
		"currentPage": refObj.currentPage,
		"keywords": refObj.searchText,
		"starttime": refObj.startDate,
		"endtime": refObj.endDate,
		"confirm": refObj.confirmID,
		"arrive": refObj.arriveID
	};
	$.ajax({
		url: serviceurl + "reservation/list",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log("预约中心" + JSON.stringify(dt));
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
					if ($("#sub_center #previousPage")[0] != undefined && $("#sub_center #nextPage")[0] != undefined) {
						//分页显示判断
						if (pageAllnum == 1) {
							$("#sub_center #previousPage").addClass("hide");
							$("#sub_center #nextPage").addClass("hide");
						} else if (refObj.currentPage == pageAllnum) {
							$("#sub_center #previousPage").removeClass("hide");
							$("#sub_center #nextPage").addClass("hide");
						} else if (refObj.currentPage == 1) {
							$("#sub_center #previousPage").addClass("hide");
							$("#sub_center #nextPage").removeClass("hide");
						} else {
							$("#sub_center #previousPage").removeClass("hide");
							$("#sub_center #nextPage").removeClass("hide");
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


//获取预约详情
var getSubscribeData = function(id) {
	if (id == "") {
		return;
	}
	var _params = {
		"id": id
	};
	$.ajax({
		url: serviceurl + "reservation/detail",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,
		beforeSend: function() {},
		success: function(dt) {
			console.log("获取预约详情" + JSON.stringify(dt));
			if (dt.status == "success") {
				subscribeList = dt.data;
				var patient_name = "";
				var age = "";
				var important = "";
				var patient_mobile = "";
				var arrive = "未到达";
				var doctor_name = "";
				var isfirst = "";
				var reserved_date = "";
				var reserved_timerange = "";
				var items = "";
				var remark = "";
				var confirm = "未预约";
				var btnText = "";
				var gender = "";
				patient_name = subscribeList.patient_name;
				if (subscribeList.age != "" && subscribeList.age != null) {
					age = subscribeList.age + "岁";
				}

				patient_mobile = subscribeList.patient_mobile;
				thisConfirm = subscribeList.confirm;
				if (thisConfirm == 0) {
					if (thisArrive == 2) {
						arrive = "已过期";
						btnText = "到达";
					} else {
						arrive = "未确认";
						btnText = "确认";
					}
					$("#sub_det_function").show();
					$("#sub_det_btn").show();
				} else if (thisConfirm == 2) {
					arrive = "已失约";
					//按钮不显示
					$("#sub_det_function").hide();
					$("#sub_det_btn").hide();
				} else if (thisConfirm == 1) {
					thisArrive = subscribeList.arrive;
					if (thisArrive == 0) {
						arrive = "未到达";
						btnText = "到达";
						$("#sub_det_function").show();
						$("#sub_det_btn").show();
					} else if (thisArrive == 1) {
						arrive = "已到达";
						//按钮不显示
						$("#sub_det_function").hide();
						$("#sub_det_btn").hide();
					} else if (thisArrive == 2) {
						arrive = "已过期";
						btnText = "到达";
						$("#sub_det_function").show();
						$("#sub_det_btn").show();
					}
				}
				doctor_name = subscribeList.doctor_name;
				if (subscribeList.isfirst == 0) {
					isfirst = "初诊";
					$("#sub_det_isfirst").addClass("res-center-newly");
				} else if (subscribeList.isfirst == 1) {
					isfirst = "复诊";
					$("#sub_det_isfirst").addClass("res-center-referral");
				}
				if (subscribeList.gender == 1) {
					gender = "男";
				} else if (subscribeList.gender == -1) {
					gender = "女";
				}
				if (subscribeList.important == "1") {
					important = "★";
				}
				reserved_date = subscribeList.reserved_date;
				reserved_timerange = subscribeList.reserved_timerange;
				items = subscribeList.items;
				remark = subscribeList.remark;
				$(".sub_det_patient_name").text(patient_name);
				$(".sub_det_gender").text(gender);
				$(".sub_det_age").text(age);
				$("#sub_det_important").text(important);
				$(".sub_det_patient_mobile").text(patient_mobile);
				$(".sub_det_arrive").text(arrive);
				$(".sub_det_doctor_name").text(doctor_name);
				$("#sub_det_isfirst").text(isfirst);
				$(".sub_det_reserved_date").text(reserved_date);
				$(".sub_det_reserved_timerange").text(reserved_timerange);
				$(".sub_det_items").text(items);
				$(".sub_det_btn").text(btnText);
			} else {
				toast.show(dt.message);
				return;
			}
		},
		complete: function() {},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
};

var Subscribe_det = React.createClass({
	componentDidMount: function() {
		var subArrive = $("#sub_det_arrive").text();
		var subIsfirst = $("#sub_det_isfirst").text();

		if (subIsfirst == "初诊") {
			$("#sub_det_isfirst").addClass("res-center-newly");
		} else if (subIsfirst == "复诊") {
			$("#sub_det_isfirst").addClass("res-center-referral");
		}

		if (subArrive == "已失约") {
			$("#sub_det_function").hide();
		}
	},
	detBtn: function() {
		var textBtn = $("#sub_det_btn").text();
		if (textBtn == "确认") {
			getAffirm(this.props.getsbid, 1);
			getArrive(this.props.getsbid, 0);
			$("#sub_detBox").css({
				"right": "-100%"
			});
			$("#tabright_").css({
				"right": "-100%"
			});
			$(".mask-div").hide();
			this.props.refleshTable();
		} else if (textBtn == "到达") {
			//打开新增挂号，关闭本窗口
			this.props.getprops(this.props.getsbid);
			$("#sub_detBox").css({
				"right": "-100%"
			});
			$("#tabright_").css({
				"right": "0"
			});
		}
	},
	cancel: function() {
		getAffirm(this.props.getsbid, 2);
		this.props.refleshTable();
	},
	update: function() {
		this.props.getprops(this.props.getsbid, thisConfirm, thisArrive);

		$("#sub_detBox").css({
			"right": "-100%"
		});

		$("#tabright").css({
			"right": "0"
		});
		$(".mask-div").css({
			"height": $("html")[0].scrollHeight,
			"width": $("html")[0].scrollWidth
		})
		$(".mask-div").show();


	},
	sub_det_close: function() {
		$("#sub_detBox").css({
			"right": "-100%"
		});
		$(".mask-div").hide();
	},
	componentDidUpdate: function() {
		getSubscribeData(this.props.getsbid);
	},
	render: function() {
		return (
			<div id="sub_detBox" className="panel panel-default no-border">
				<div className="panel-heading sub_det_heading">
					<span className="sub_det_title">详细信息</span>
					<span className="sub_det_close" onClick={this.sub_det_close}>×</span>
				</div>
				<div className="panel-body sub_det_panel_body">
					<ul className="list-group sub_det_list_group">
						<li className="list-group-item no-border">
							<span className="sub_det_img"><img src="../img/det_1.png" className="det_img"/></span>
							<span className="sub_det_patient_name"></span>
							<span className="smarginleft sub_det_gender"></span>
							<span className="smarginleft sub_det_age"></span>
							<span className="smarginleft sub_det_important" id="sub_det_important"></span>
						</li>
						<li className="list-group-item no-border">
							<span className="sub_det_project">手机号码:</span>
							<span className="smarginleft sub_det_patient_mobile"></span>
						</li>
						<li className="list-group-item no-border">
							<span className="sub_det_project">家庭住址:</span>
							<span className="smarginleft"></span>
						</li>
					</ul>
				</div>
				<div className="panel-body sub_det_panel_body">
					<ul className="list-group sub_det_list_group">
						<li className="list-group-item no-border">
							<span className="sub_det_img"><img src="../img/det_2.png" className="det_img"/></span>
							<span className="sub_det_det">预约详情:</span>
							<span className="smarginleft sub_det_arrive" id="sub_det_arrive"></span>
							<span className="sub_det_btn_box">
								<button type="button" className="btn btn-primary sub_det_btn" id="sub_det_btn" onClick={this.detBtn}></button>
							</span>
						</li>
						<li className="list-group-item no-border">
							<span className="sub_det_project">预约医生:</span>
							<span className="smarginleft sub_det_doctor_name"></span>
						</li>
						<li className="list-group-item no-border">
							<span className="sub_det_project">预约类型:</span>
							<span className="smarginleft" id="sub_det_isfirst"></span>
						</li>
						<li className="list-group-item no-border">
							<span className="sub_det_project">预约时间:</span>
							<span className="smarginleft sub_det_reserved_date"></span>
							<span className="smarginleft sub_det_reserved_timerange"></span>
						</li>
						<li className="list-group-item no-border">
							<span className="sub_det_project">预约事项:</span>
							<span className="smarginleft sub_det_items"></span>
						</li>
						<li className="list-group-item no-border">
							<span className="sub_det_project">预约备注:</span>
							<span className="smarginleft sub_det_remark"></span>
						</li>
						<li className="list-group-item no-border" id="sub_det_function">
							<span className="pull-right text-center"><button type="button" className="btn btn-default sub_det_cancelBtn" onClick={this.cancel}>取消预约</button></span>
							<span className="pull-right text-center rmargin"><button type="button" className="btn btn-default sub_det_updateBtn" onClick={this.update}>修改预约</button></span>
						</li>
					</ul>
				</div>
			</div>
		)
	}
})

//预约确认、取消
var getAffirm = function(ids, confirm) {
	var _params = {
		"id": ids,
		"confirm": confirm
	};
	$.ajax({
		url: serviceurl + "reservation/editAffirm",
		type: "POST",
		dataType: "json",
		data: JSON.stringify(_params),
		contentType: "application/json",
		cache: false,
		async: false,
		beforeSend: function() {},
		success: function(dt) {
			console.log("预约确认" + JSON.stringify(dt));
			if (dt.status == "success") {
				getAffirm = dt.data;
				if (confirm == 1) {
					toast.show(dt.message);
					$("#sub_det_arrive").text("已确认");
				} else if (confirm == 2) {
					toast.show(dt.message);
					$("#sub_detBox").css({
						"right": "-100%"
					});
					$(".mask-div").hide();
				}

			} else {
				toast.show(dt.message);
				return;
			}
		},
		complete: function() {},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
};

//预约到达
var getArrive = function(ids, arrive) {
	var _params = {
		"id": ids,
		"arrive": arrive
	};
	$.ajax({
		url: serviceurl + "reservation/editArrive",
		type: "POST",
		dataType: "json",
		data: JSON.stringify(_params),
		contentType: "application/json",
		cache: false,
		async: false,
		beforeSend: function() {},
		success: function(dt) {
			console.log("预约到达" + JSON.stringify(dt));
			if (dt.status == "success") {
				getAffirm = dt.data;
			} else {
				toast.show(dt.message);
				return;
			}
		},
		complete: function() {},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
};

export {
	dataList,
	refleshSBData,
	sum,
	pageAllnum,
	getArrive,
	Subscribe_det
}