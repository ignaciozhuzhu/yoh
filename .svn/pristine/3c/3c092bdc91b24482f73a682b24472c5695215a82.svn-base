import {
	serviceurl
} from '../lib/common.js';
import {
	toast
} from '../lib/toast.js';

//获取当前用户信息
var getUserInfo = function(backurl) {
	$.ajax({
		url: serviceurl + "site/getUserInfo",
		type: "get",
		dataType: "json",
		data: {},
		contentType: "application/json",
		cache: true,
		async: false,

		success: function(dt) {
			//console.log("获取当前用户信息"+JSON.stringify(dt));
			if (dt.status == "success") {
				var UserInfo = dt.map.staff;
				$("#hospitalname").text(UserInfo.hospitalname);
			} else if (dt.status == "redirect") {
				//表示未登录
				location.href = "login.html?backurl=" + backurl;
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
}

//判断登陆与否
var testLogin = function(backurl) {
	$.ajax({
		url: serviceurl + "site/getUserInfo",
		type: "get",
		dataType: "json",
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			if (dt.status == "redirect") {
				//表示未登录
				location.href = "login.html?backurl=" + backurl;
			}
		},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
}

function isCloseWindow() {
	var flag = true;
	var message = "该操作将会导致非正常退出系统(正确退出系统方式：点击退出系统按钮)，您是否确认?";
	window.onbeforeunload = function() {
		if (flag) {
			var evt = window.event || arguments[0];
			var userAgent = navigator.userAgent;
			if (userAgent.indexOf("MSIE") > 0) {
				var n = window.event.screenX - window.screenLeft;
				var b = n > document.documentElement.scrollWidth - 20;
				if (b && window.event.clientY < 0 || window.event.altKey) {
					window.event.returnValue = (message);
				} else {
					return (message);
				}
			} else if (userAgent.indexOf("Firefox") > 0) {
				return (message);
			} else if (userAgent.indexOf("Chrome") > -1 || userAgent.indexOf("Mozilla") > -1) {
				return (message);
			}
		}
	}
}

export {
	getUserInfo,
	testLogin,
	isCloseWindow
}