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
import Vld from 'validator';

import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';

var id = "";
var key = "";
var mobile = "";
var hospitalname = "";

$(document).ready(function() {
	leftBoxClick("collapseMan", 0, "manage");
});

//医院信息
$.ajax({
	url: serviceurl + "hospital/currentInfo",
	type: "get",
	dataType: "json",
	data: {},
	contentType: "application/json",
	cache: false,
	async: false,

	success: function(dt) {
		console.log("info" + JSON.stringify(dt));
		if (dt.status == "success") {
			//隐藏loading
			$("#loading").hide();
			$("#loading_end").show();
			var userInfo = dt.data;
			var zipcode = userInfo.zipcode;
			var name = userInfo.name;
			var telephone = userInfo.telephone;
			var address = userInfo.address;
			var brief = userInfo.brief;
			var worktime = userInfo.hostime;
			if (Vld.isNull(name + "") || Vld.equals(name + "", "null")) {
				$("#hospitalname").text("");
			} else {
				$("#hospitalname").text(name);
			}
			if (Vld.isNull(telephone + "") || Vld.equals(telephone + "", "null")) {
				$("#hospitalmobile").text("");
			} else {
				$("#hospitalmobile").text(telephone);
			}
			if (Vld.isNull(address + "") || Vld.equals(address + "", "null")) {
				$("#hospitaladdress").text("");
			} else {
				$("#hospitaladdress").text(address);
			}
			if (Vld.isNull(zipcode + "") || Vld.equals(zipcode + "", "null")) {
				$("#zipcode").text("");
			} else {
				$("#zipcode").text(zipcode);
			}
			if (Vld.isNull(brief + "") || Vld.equals(brief + "", "null")) {
				$("#brief").text("");
			} else {
				$("#brief").text(brief);
			}

			if (Vld.isNull(worktime + "") || Vld.equals(worktime + "", "null")) {
				$("#worktime").html("");
			} else {
				$("#worktime").html(worktime);
			}
			$("#V").text(userInfo.v == 1 ? "已认证" : "未认证");
			//$("#zipcode").text(userInfo.zipcode);
			if (userInfo.grade == 1) {
				$("#level").text("一级");
			} else if (userInfo.grade == 2) {
				$("#level").text("二级");
			} else if (userInfo.grade == 3) {
				$("#level").text("三级");
			}
			if (userInfo.level == 0) {
				$("#grade").text("特等");
			} else if (userInfo.level == 1) {
				$("#grade").text("甲等");
			} else if (userInfo.level == 2) {
				$("#grade").text("乙等");
			} else if (userInfo.level == 3) {
				$("#grade").text("丙等");
			}
		} else if (dt.status == "redirect") {
			//表示未登录
			location.href = "login.html?backurl=manage_clinic.html";
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

ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);