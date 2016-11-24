'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	checknull,
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
var mobile = "";
var password = "";
var fullname = "";
var title = "";
var diseaseids = "";
var brief = "";
$(document).ready(function() {
	//判断登陆与否
	testLogin("manage_doctor_check.html");
	leftBoxClick("collapseMan", 1, "manage");
	//医生详情
	$.ajax({
		url: serviceurl + "doctor/clinicDoctorTitle",
		type: "get",
		dataType: "json",
		data: {},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log("titlelist" + JSON.stringify(dt));
			if (dt.status == "success") {
				//隐藏loading
				$("#loading").hide();
				$("#loading_end").show();
				$("#docmobile").val(checknull(request("doctormobile")));
				var titleList = dt.map;
				$.each(titleList, function(idx, item) {
					$("#selectTitle").append(
						"<option value='" + idx + "'>" + item + "</option>"
					);
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

	//医生擅长
	$.ajax({
		url: serviceurl + "disease/list",
		type: "get",
		dataType: "json",
		data: {},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log("titlelist" + JSON.stringify(dt));
			if (dt.status == "success") {
				var diseaseList = dt.data;
				$.each(diseaseList, function(idx, item) {
					$("#diseaseList").append(
						"<div class='checkbox'>" +
						"<label>" +
						"<input type='checkbox' name='diseaseList' value='" + item.diseaseid + "'>" + item.name +
						"</label>" +
						"</div>"
					);
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

	//医生添加
	$("#addDoctor").click(function() {
		$("#addDoctor").attr("disabled", "disabled");
		mobile = $("#docmobile").val();
		password = $("#docpassword").val();
		fullname = $("#fullname").val();
		title = $("#selectTitle").val();
		brief = $("#brief").val();

		if (Vld.isNull((fullname + "").trim())) {
			toast.show("姓名没有填写！");
			$("#addDoctor").attr("disabled", false);
			return;
		}
		if (Vld.isMobilePhone(mobile, 'zh-CN') === false) {
			toast.show('请输入11位手机号');
			$("#addDoctor").attr("disabled", false);
			return;
		}
		if (Vld.isNull(password + "")) {
			toast.show("密码没有填写！");
			$("#addDoctor").attr("disabled", false);
			return;
		}
		if (Vld.isLength((password + ""), {
				min: 6,
				max: 16
			}) === false) {
			toast.show("密码长度为6~16位");
			$("#addDoctor").attr("disabled", false);
			return;
		}
		if (Vld.isNull((title + "").trim())) {
			toast.show("职称没有选择！");
			$("#addDoctor").attr("disabled", false);
			return;
		}
		//获取擅长项目
		var array = [];
		$("input[name='diseaseList']").each(function(index, item) {
			if (item.checked) {
				array.push(item.value);
			}
			diseaseids = array.join(',');
		});
		$("#diseaseids").val(diseaseids);
		if (Vld.isNull(diseaseids + "")) {
			toast.show("擅长项目没有选！");
			$("#addDoctor").attr("disabled", false);
			return;
		}
		if (Vld.isNull((brief + "").trim())) {
			toast.show("简介没有填写！");
			$("#addDoctor").attr("disabled", false);
			return;
		}
		var form = $("#formid");
		var options = {
			url: serviceurl + "doctor/clinicInsertDoctor",
			type: 'post',
			success: function(dt) {
				console.log("addDoctor: " + JSON.stringify(dt));
				if (dt.status == "success") {
					//添加成功
					toast.show("添加成功");
					//setCookie("gobackURL", "manage_doctor_add.html", 30);
					setTimeout(function() {
						location.href = "manage_doctor.html" +
							re_str("hname", request("hname"), 0) +
							re_str("gobackURL", "manage_doctor_add.html", 1)
					}, 3000);
				} else {
					toast.show("添加失败");
					$("#addDoctor").attr("disabled", false);
					return;
				}
			},
			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				$("#addDoctor").attr("disabled", false);
				return;
			}
		};
		form.ajaxSubmit(options);
	});

});
ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);