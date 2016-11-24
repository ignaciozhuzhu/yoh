'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	leftBoxClick,
	request,
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
$(document).ready(function() {
	//判断登陆与否
	testLogin("reservation_center.html");
	leftBoxClick("collapseRes", 0, "res");
});
var reservationList = [];
//获取挂号信息
var getReservationData = function() {
	var _params = {
		"bookingid": request("bookingID")
	};
	$.ajax({
		url: serviceurl + "booking/hosBookingDetail",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,
		beforeSend: function() {},
		success: function(dt) {
			//隐藏loading
			$("#loading").hide();

			console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				reservationList = dt.data;
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

var RevervationBox = React.createClass({
	getInitialState: function() {
		getReservationData();
		return {
			data: reservationList
		};
	},
	cancelRes: function() {
		$("#cancelResBtn").attr("disabled", "disabled");
		var _params = {
			"bookingid": request("bookingID")
		};
		$.ajax({
			url: serviceurl + "booking/hosCancelBooking",
			type: "post",
			dataType: "json",
			data: JSON.stringify(_params),
			contentType: "application/json",
			cache: false,
			async: false,
			beforeSend: function() {},
			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					toast.show("取消成功");
					$("#cancelResBtn").addClass("hide");
					$("#cancle-text").text("已取消");
				} else {
					toast.show(dt.message);
					$("#cancelResBtn").attr("disabled", false);
					return;
				}
			},
			complete: function() {},
			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				$("#cancelResBtn").attr("disabled", false);
				return;
			}
		});
	},
	componentDidMount: function() {
		if (reservationList.d == 1 || reservationList.isorder == 1 || reservationList.timestatus == 1) {
			$("#cancelResBtn").addClass("hide");
		}
	},
	render: function() {
		var id = reservationList.id;
		var patientName = reservationList.patientName;
		var mobile = isMockMobile(reservationList.mobile);
		var hospitalname = reservationList.hospitalname;
		var time = new Date(reservationList.starttime * 1000);
		var startDate = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日";

		var startTime = time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
		var timeLong = new Date((reservationList.starttime + reservationList.timelong) * 1000);
		var endTime = timeLong.getHours() + ":" + (timeLong.getMinutes() < 10 ? "0" + timeLong.getMinutes() : timeLong.getMinutes());

		var state = reservationList.d == 1 ? "已取消" : (reservationList.isorder == 1 ? "已就诊" : (reservationList.timestatus == 0 ? "未就诊" : "已过期"));
		var doctorname = reservationList.doctorname;
		var title = reservationList.title;


		return (
			<div>
				<div className="bmargin1">
					<div className="row">
						<div className="col-sm-6">
							<div className="panel panel-default no-border res-det-list">
								<div className="panel-heading w-bg">
									<h3>患者详情</h3>
								</div>
								<div className="list-group">
									<a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">病历号</h4>
										<p className="list-group-item-text">{id}</p>
									</a>
									<a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">患者姓名</h4>
										<p className="list-group-item-text">{patientName}</p>
									</a>
									<a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">手机号</h4>
										<p className="list-group-item-text">{mobile}</p>
									</a>
									<a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">就诊医院</h4>
										<p className="list-group-item-text">{hospitalname}</p>
									</a>
								</div>
							</div>
						</div>

						<div className="col-sm-6">
							<div className="panel panel-default no-border res-det-list">
								<div className="panel-heading w-bg">
									<h3>挂号详情</h3>
								</div>
								<div className="list-group">
									<a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">医生职称</h4>
										<p className="list-group-item-text">{title}</p>
									</a>
									<a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">挂号医生</h4>
										<p className="list-group-item-text">{doctorname}</p>
									</a>
									<a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">挂号状态</h4>
										<p className="list-group-item-text" id="cancle-text">{state}</p>
									</a>
								   <a href="#" className="list-group-item">
										<h4 className="list-group-item-heading">挂号时间</h4>
										<p className="list-group-item-text">{startDate} {startTime}~{endTime}</p>
									</a>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
});

ReactDOM.render(
	<RevervationBox data={reservationList} />,
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