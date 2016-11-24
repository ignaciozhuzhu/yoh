'use strict';
import {
	serviceurl,
	ipurl,
	sohu,
	setCookie,
	getCookie,
	checknull,
	re_str
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import Vld from 'validator';
import {
	BASE64
} from './lib/encription/base64.js';

$("body").keydown(function() {
	if (event.keyCode == "13") { //keyCode=13是回车键
		$("#loginBtn").click();
	}
});

if (Vld.isMobilePhone(getCookie("userMobile"), 'zh-CN')) {
	$("#inputMobile").val(getCookie("userMobile"));
}

if (Vld.isLength(getCookie("userPWD"), {
		min: 6,
		max: 32
	})) {
	var pwdDecoder = "";
	for (let i = 0; i < BASE64.decoder(getCookie("userPWD")).length; i++) {
		pwdDecoder += String.fromCharCode(BASE64.decoder(getCookie("userPWD"))[i]);
	}
	// $("#inputPWD").val(pwdDecoder);
}

//header-nav
$("#h5-box").mouseenter(function() {
	$("#scan-box").stop().slideDown();
})
$("#h5-box").mouseleave(function() {
	$("#scan-box").stop().slideUp();
});

//检查当前用户信息 返回用户名
var userInfo = function(nextCallBack) {
	$.ajax({
		url: serviceurl + "site/getUserInfo",
		type: "get",
		dataType: "json",
		data: {},
		contentType: "application/json",
		cache: false,
		async: false,
		success: function(dt) {
			console.log("login2" + JSON.stringify(dt));
			if (dt.status == "success") {
				document.cookie = "userName=" + dt.map.staff.hospitalname + "; path=/html";
				console.log(getCookie("userName"));
				nextCallBack(dt.map.staff.hospitalname);
			} else if (dt.status == "error") {
				toast.show(dt.message);
				return "";
			}
		},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
};

$("#loginBtn").click(function() {
	var mobile = "";
	var password = "";
	mobile = $("#inputMobile").val();
	password = $("#inputPWD").val();

	if (Vld.isMobilePhone(mobile, 'zh-CN') === false) {
		toast.show('请输入11位手机号');
		return;
	}
	if (Vld.isLength(password, {
			min: 6,
			max: 16
		}) === false) {
		toast.show("请输入6-16位的密码");
		return;
	}

	var login = {
		"mobile": mobile,
		"password": password,
		"role": "3"
	};
	$.ajax({
		url: serviceurl + "site/userLogin",
		type: "post",
		dataType: "json",
		data: JSON.stringify(login),
		contentType: "application/json",
		cache: false,
		async: false,
		success: function(dt) {
			console.log("login" + JSON.stringify(dt));
			if (dt.status == "success") {
				userInfo(nextCallBack);

				function nextCallBack(hospitalname) {
					if (dt.map.url == "default") {
						setCookie("userMobile", $("#inputMobile").val(), 30);
						var passwordMD5 = $("#inputPWD").val();
						var base64 = BASE64.encoder(passwordMD5);
						setCookie("userPWD", base64, 30);
						location.href = ipurl + "reservation_center.html" +
							re_str("hname", hospitalname, 0);
					} else {
						var urlinfo = window.location.href; //获取当前页面的url 
						var len = urlinfo.length; //获取url的长度 
						var offset = urlinfo.indexOf("?"); //设置参数字符串开始的位置 
						var val = "";
						var newsidinfo = urlinfo.substr(offset, len) //取出参数字符串 这里会获得类似“id=1”这样的字符串 
						var newsids = newsidinfo.split("="); //对获得的参数字符串按照“=”进行分割 
						val = newsids[1];
						location.href = ipurl + "reservation_center.html" + "?hname=" + hospitalname;
						//location.href = ipurl + (checknull(val) == "" ? "reservation_center.html" + "?hname=" + hospitalname : val);
					}
				}

			} else if (dt.status == "error") {
				toast.show(dt.message);
				return;
			}
		},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
});


$("#saveBtn").click(function() {
	var name = $("#clinicName").val();
	var address = $("#clinicAddress").val();
	var telephone = $("#clinicTelephone").val();
	var fullname = $("#clinicFullname").val();
	var mobile = $("#clinicMobile").val();

	if (Vld.isLength(name, {
			min: 2,
			max: 50
		}) === false) {
		toast.show('请输入诊所名称，2~50字！');
		return;
	}
	if (Vld.isLength(address, {
			min: 2,
			max: 200
		}) === false) {
		toast.show("请输入诊所地址，2~200字！");
		return;
	}
	if (Vld.isLength(telephone, {
			min: 1,
			max: 30
		}) === false) {
		toast.show("请正确输入诊所电话！");
		return;
	}
	if (Vld.isLength(fullname, {
			min: 2,
			max: 20
		}) === false) {
		toast.show("请输入联系人姓名，2~20字！");
		return;
	}
	if (Vld.isMobilePhone(mobile, 'zh-CN') === false) {
		toast.show("请输入联系人11位手机号！");
		return;
	}

	var countycode = "";
	/*global returnCitySN*/
	$.getScript(sohu, function() {
		countycode = returnCitySN.cid;
		var _params = {
			"name": name,
			"countycode": countycode,
			"address": address,
			"telephone": telephone,
			"x": "",
			"y": "",
			"fullname": fullname,
			"mobile": mobile
		};
		console.log("params:    " + JSON.stringify(_params));
		$.ajax({
			url: serviceurl + "hospital/insert",
			type: "post",
			dataType: "json",
			data: JSON.stringify(_params),
			contentType: "application/json",
			cache: false,
			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					toast.show("注册成功");
					setTimeout(function() {
						location.href = ipurl + "login.html";
					}, 5000);
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
	});
});