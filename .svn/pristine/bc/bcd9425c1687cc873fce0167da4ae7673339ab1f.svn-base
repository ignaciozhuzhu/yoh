'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	request,
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
var doctorid = request("dd_doctorid");
console.log(request("dd_doctorid"))
console.log(request("hname"))
var key = "";
var fullname = "";
var mobile = "";
$(document).ready(function() {
	//判断登陆与否
	testLogin("dd_doctor.html");
	leftBoxClick("collapseDD", 0, "dd");
});

//医生简历信息
$.ajax({
	url: serviceurl + "doctor/clinicResumeInfo",
	type: "get",
	dataType: "json",
	data: {
		"doctorid": doctorid
	},
	contentType: "application/json",
	cache: false,
	async: false,

	success: function(dt) {
		console.log(doctorid + "||" + JSON.stringify(dt));
		if (dt.status == "success") {
			//隐藏loading
			$("#loading").hide();
			$("#loading_end").show();

			var userInfo = dt.data;

			var fullname = userInfo.fullname;
			var mobile = userInfo.mobile;
			var place = userInfo.defaulthosname;
			var title = userInfo.title;
			var workyears = userInfo.workyears;
			var education = userInfo.education;
			var work = userInfo.work;
			var dd_doctor_v = userInfo.v;
			var verifyreason = userInfo.verifyreason;
			var certificate = userInfo.certificateUrl;

			if (Vld.isNull(fullname + "") || Vld.equals(fullname + "", "null")) {
				$("#fullname").text("");
			} else {
				$("#fullname").text(fullname);
			}
			if (Vld.isNull(mobile + "") || Vld.equals(mobile + "", "null")) {
				$("#mobile").text("");
			} else {
				$("#mobile").text(mobile);
			}
			if (Vld.isNull(place + "") || Vld.equals(place + "", "null")) {
				$("#place").text("");
			} else {
				$("#place").text(place);
			}
			if (Vld.isNull(title + "") || Vld.equals(title + "", "null")) {
				$("#title").text("");
			} else {
				$("#title").text(title);
			}
			if (Vld.isNull(workyears + "") || Vld.equals(workyears + "", "null")) {
				$("#workyears").text("");
			} else {
				$("#workyears").text(workyears + "年");
			}
			if (Vld.isNull(education + "") || Vld.equals(education + "", "null")) {
				$("#education").text("");
			} else {
				$("#education").text(education);
			}

			if (Vld.isNull(dd_doctor_v + "") || Vld.equals(dd_doctor_v + "", "null")) {
				$("#dd_doctor_v").text("");
			} else if (Vld.equals(dd_doctor_v + "", "0")) {
				$("#dd_doctor_v").text("审核中");
			} else if (Vld.equals(dd_doctor_v + "", "1")) {
				$("#dd_doctor_v").text("通过审核");
			} else if (Vld.equals(dd_doctor_v + "", "2")) {
				$("#dd_doctor_v").text("审核失败");
				$("#verifyreason_hide").removeClass("hide");
				$("#verifyreason").text(verifyreason);
			} else {
				$("#dd_doctor_v").text("审核中");
			}

			if (Vld.isNull(work + "") || Vld.equals(work + "", "null")) {
				$("#work").text("");
			} else {
				$("#work").text(work);
			}

			$("#avatar").attr("src", serviceurl + userInfo.avatar);

			$.each(certificate, function(idx, item) {
				$("#certificate").append(
					"<div class='bmargin'>" +
					"<img src='" + serviceurl + item + "' />" +
					"</div>"
				)
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

ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);