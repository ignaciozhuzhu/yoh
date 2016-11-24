'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	request,
	re_str,
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
var doctorid = "";
var mobile = "";
var password = "";
var fullname = "";
var title = "";
var diseaseids = "";
var brief = "";
$(document).ready(function() {
	//判断登陆与否
	testLogin("manage_doctor.html");
	leftBoxClick("collapseMan", 1, "manage");
})
$("#file").change(function() {
		console.log("图像路径：  " + $("#file").val());
		$("#avatar").attr("src", $("#file").val());
	})
	//医生职称列表
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
			var titleList = dt.map;
			$.each(titleList, function(idx, item) {
				$("#selectTitle").append(
					"<option id='" + idx + "-title' value='" + idx + "'>" + item + "</option>"
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
					"<div class='checkbox' style='width: 50%; display: inline-block;'>" +
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
//医生详情
$.ajax({
	url: serviceurl + "doctor/clinicDoctorInfo",
	type: "get",
	dataType: "json",
	data: {
		"doctorid": request("doctorID")
	},
	contentType: "application/json",
	cache: false,
	async: false,

	success: function(dt) {
		console.log("doctorDet:  " + JSON.stringify(dt));
		if (dt.status == "success") {
			//隐藏loading
			$("#loading").hide();
			$("#loading_end").show();

			var detList = dt.data;
			$("#fullname").val(detList.fullname);
			$("#doctorid").val(request("doctorID"));
			$("#selectTitle").val(detList.title);
			$("#avatar").attr("src", serviceurl + detList.avatar);
			$("#mobile").val(detList.mobile);
			$("#bookingCount").text(detList.bookingCount);
			$("#queryCount").text(detList.queryCount);
			$("#v").text(detList.v == 0 ? "未认证" : "已认证");
			$("#brief").text(detList.brief);
			//医生擅长
			var skillList = (detList.skill).split(",");
			$("input[name='diseaseList']").each(function(index, item) {
				// if($.inArray(item.value, skillList)){
				// 	$(this).attr("checked",true)
				// }
				if (skillList.indexOf(item.value) != -1) {
					$(this).attr("checked", true)
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
//医生修改
$("#updateDoctor").click(function() {
	mobile = $("#mobile").val();
	fullname = $("#fullname").val();
	title = $("#selectTitle").val();
	brief = $("#brief").val();
	if (Vld.isNull(fullname.trim())) {
		toast.show("姓名没有填写！");
		return;
	}
	if (Vld.isMobilePhone(mobile, 'zh-CN') === false) {
		toast.show('请输入11位手机号');
		return;
	}
	if (Vld.isNull(title.trim())) {
		toast.show("职称没有填写！");
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
	if (Vld.isNull(diseaseids.trim())) {
		toast.show("擅长项目没有选！");
		return;
	}
	if (Vld.isLength(brief.trim(), {
			min: 1,
			max: 200
		}) === false) {
		toast.show("简介可填写1~200个字符！");
		return;
	}
	var _params = {
		"mobile": mobile,
		"fullname": fullname,
		"title": title,
		"diseaseids": diseaseids,
		"brief": brief,
		"doctorid": request("doctorID")
	};
	$.ajax({
		url: serviceurl + "doctor/clinicEditDoctor",
		type: "post",
		dataType: "json",
		data: JSON.stringify(_params),
		contentType: "application/json",
		cache: false,

		success: function(dt) {
			console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				//编辑成功
				//setCookie("gobackURL", "manage_doctor_det.html", 30);
				location.href = "manage_doctor.html" +
					re_str("hname", request("hname"), 0) +
					re_str("gobackURL", "manage_doctor_det.html", 1);
			} else {
				toast.show(dt.message);
				return;
			}
		},

		error: function(XMLHttpRequest) {
			var text = XMLHttpRequest.responseText;
			toast.show(text);
			return;
		}
	});
});

$("#file").change(function() {
	var fileText = $("#file").val();
	$("#doctorid").val(request("doctorID"));
	if (fileText == "") {
		toast.show("请选中文件！");
		return;
	} else {
		var form = $("#formid");
		var options = {
			url: serviceurl + "doctor/clinicUploadAvatar",
			type: 'post',
			success: function(dt) {
				console.log("addDoctor: " + JSON.stringify(dt));
				if (dt.status == "success") {
					//修改头像成功
					toast.show("修改头像成功!");
					return;
				} else {
					toast.show("头像修改失败!");
					return;
				}
			},
			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				return;
			}
		};
		form.ajaxSubmit(options);
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