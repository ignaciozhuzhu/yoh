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
import Top_Area from './components/Top_Area.js';
var jobtitle = "";
var title = "";
var mode = "";
var price = "";
//var d = "";
$(document).ready(function() {
	//判断登陆与否
	testLogin("dd_addjob.html");
	leftBoxClick("collapseDD", 0, "dd");
	//隐藏loading
	$("#loading").hide();
	$("#loading_end").show();

	//添加职位
	$("#addJob").click(function() {
		$("#addJob").attr("disabled", "disabled");
		title = $("#title").val();
		if (Vld.isLength(title, {
				min: 2,
				max: 20
			}) === false) {
			toast.show("职位标题请输入2-20个字符");
			$("#addJob").attr("disabled", false);
			return;
		}
		if ($("#formid")[0].ygMulFiles.files.length < 1) {
			toast.show("请选择诊所图片！");
			$("#addJob").attr("disabled", false);
			return;
		}
		if ($("#formid")[0].ygMulFiles.files.length > 5) {
			toast.show("选择的诊所图片必须小于5张！");
			$("#addJob").attr("disabled", false);
			return;
		}
		mode = $('input[name="mode"]:checked').val();
		price = checknull($("#price").val());
		if (mode == 1) {
			if (Vld.isNull(price)) {
				toast.show("请输入出租价格！");
				$("#addJob").attr("disabled", false);
				return;
			}
			if (!isNaN(price)) {
				if (price.indexOf("-") != -1) {
					toast.show("出租价格不能为负数！");
					$("#addJob").attr("disabled", false);
					return;
				}
			} else {
				toast.show("出租价格必须是数字！");
				$("#addJob").attr("disabled", false);
				return;
			}
		} else {
			if (Vld.isNull(price)) {
				toast.show("请输入收入提成！");
				$("#addJob").attr("disabled", false);
				return;
			}
			if (!isNaN(price)) {
				if (price.indexOf("-") != -1) {
					toast.show("收入提成不能为负数！");
					$("#addJob").attr("disabled", false);
					return;
				}
				price = parseInt(price);
				if (price <= 0 || price >= 100) {
					toast.show("收入提成输入为(0%~99%)");
					$("#addJob").attr("disabled", false);
					return;
				}
			} else {
				toast.show("收入提成必须为数字！");
				$("#addJob").attr("disabled", false);
				return;
			}
		}
		jobtitle = $("#jobtitle").val();
		if (Vld.isLength(jobtitle, {
				min: 1,
				max: 1000
			}) === false) {
			toast.show("招聘要求请输入1-1000个字符");
			$("#addJob").attr("disabled", false);
			return;
		}
		//d = $('input[name="d"]:checked').val();
		var form = $("#formid");
		var options = {
			url: serviceurl + "hospital/addJob",
			type: 'post',
			success: function(dt) {
				console.log("addDoctor: " + JSON.stringify(dt));
				if (dt.status == "success") {
					//添加成功
					$("#loading").hide();
					toast.show("添加成功");
					//setCookie("gobackURL", "dd_addjob.html", 30);
					setTimeout(function() {
						location.href = "dd_doctor.html" +
							re_str("hname", request("hname"), 0) +
							re_str("gobackURL", "dd_addjob.html", 1)
					}, 3000);
				} else {
					$("#loading").hide();
					toast.show("添加失败！");
					$("#addJob").attr("disabled", false);
					return;
				}
			},
			error: function(XMLHttpRequest) {
				$("#loading").hide();
				toast.show(XMLHttpRequest.responseJSON.message);
				$("#addJob").attr("disabled", false);
				return;
			}
		};
		$("#loading").show();
		form.ajaxSubmit(options);
	});
});


$('input[name="mode"]').change(function() {
	$("#price").val("");
});
$("#mode1").click(function() {
	$("#price").attr({
		"placeholder": "请输入出租价格(元)",
		"min": "0.01"
	});
});
$("#mode2").click(function() {
	$("#price").attr({
		"placeholder": "请输入收入提成输入为(0%~99%)",
		"min": "0",
		"max": "99"
	});
});

ReactDOM.render(
	<Top_Area titleName="添加职位" btnDisplay="block" btnText="确定" btnColor="ddbg-color border-ddd" btnId="addJob" />,
	document.getElementById('top_area')
);
ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);