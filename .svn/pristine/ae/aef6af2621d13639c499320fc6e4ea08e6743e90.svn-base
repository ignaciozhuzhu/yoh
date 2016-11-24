'use strict';

import {
	toast
} from './toast.js';

import {
	getResLen
} from '../ajax/getResCount.js';

export var serviceurl = process.env.API_URL;
export var ipurl = process.env.IP_URL;
export var sohu = process.env.SUHU_URL;

//写cookies
export var setCookie = function(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

//读取cookies
export var getCookie = function(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	/*eslint no-cond-assign: 0 */
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return "";
};
//清空所有cookie
export var clearCookies = function() {

};
//检测""、undefined、null""
export var checknull = function(value) {
	if (value == "" || value == null || value == "undefined") {
		return "";
	} else {
		return value;
	}
};
//检测""、undefined、null"" -->0
export var checknullto0 = function(value) {
	if (value == "" || value == null || value == "undefined") {
		return 0.00;
	} else {
		return value;
	}
};

//时间戳转换成（yyyy/mm/dd hh/mm/ss）
export var getLocalTime = function(nS) {
	return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "/").replace(/日/g, " ");
};
export var getMobilTime = function(nS) {
	var time = new Date(nS);
	return time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日 " + plusZero(time.getHours()) + ":" + plusZero(time.getMinutes()) + ":" + plusZero(time.getSeconds());
};
//时间戳转换成（hh/mm/ss）
export var getTimeShort = function(nS) {
	var time = new Date(nS);
	return plusZero(time.getHours()) + ":" + plusZero(time.getMinutes()) + ":" + plusZero(time.getSeconds());
};

function plusZero(ns) {
	if ((ns + "").length > 1) {
		return ns;
	} else {
		return "0" + ns;
	}
};
//价格换算 （后台所有价格都是以 分 为单位 这里转换成 元 ）
export var MoneyConversion = function(money, toFixed) {
	money = money / 100;
	if (typeof toFixed == "number")
		return money.toFixed(toFixed);
	return money;
};
//价格换算 （后台所有价格都是以 分 为单位 这里元转换成分的单位 ）
export var MoneyValue = function(money) {
	money = money * 100;
	return money;
};
//返回当前日期mm/dd/yyyy
export var getThatday = function(myDate) {
	return (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
};
//校验手机号
export var checkMobile = function(account) {
	if (account.length == 0) {
		toast.show("请输入手机号");
		return false;
	} else if (!account.match(/^[0-9]*$/) || account.length != 11) {
		toast.show("请输入正确的手机号");
		return false;
	}
	return true;
};
//数字精确到小数后两位
export var toDecimal = function(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return;
	}
	f = Math.round(x * 100) / 100;
	return f;
};

//_indexp:父级位置;_index:子位置   起点为0
export var leftBoxClick = function(boxid, _index, activename, _indexp) {
	//挂号订单数量提醒,如果是当前页面,则使用其自身的刷新函数
	if (activename == "res" && _index == 0) {} else {
		setInterval(
			function() {
				getResLen();
			}, 5e3);
	}


	boxid = ["collapseRes", "collapsePay", "collapseSch", "collapseCount", "collapseMan", "collapseDD", "subscribe"];
	switch (activename) {
		case "res":
			_indexp = 0;
			break;
		case "pay":
			_indexp = 1;
			break;
		case "sch":
			_indexp = 2;
			break;
		case "count":
			_indexp = 3;
			break;
		case "manage":
			_indexp = 4;
			break;
		case "dd":
			_indexp = 5;
			break;
		case "subscribe":
			_indexp = 6;
			break;
		default:
			_indexp = -1;
			break;
	}
	//关闭前热击
	$("#leftBoxDIV a").removeClass(function() {
		var thisClassName = this.className;
		if (thisClassName.indexOf("active") > -1) {
			let src = this.children[1].src;
			let newsrc = src.substring(0, src.indexOf("-")) + '.png';
			this.children[1].src = newsrc;
			return thisClassName.substring(thisClassName.indexOf("active"));
		}
	});
	$(".list-group.collapse.in").removeClass("in");
	//开启热击效果
	let thisClick = $("#" + boxid[_indexp]).children().eq(_index);
	thisClick.addClass("active " + activename + "-active");
	var oldsrc = "";
	try {
		oldsrc = thisClick.find("img")[0].src;
	} catch (e) {
		oldsrc = "http://127.0.0.1/img/1.png";
	}
	let oldsrcnum = oldsrc.substring(oldsrc.lastIndexOf("/") + 1, oldsrc.lastIndexOf("."))
	let newsrc = oldsrc.substring(0, oldsrc.lastIndexOf(".")) + "-" + oldsrcnum + ".png";
	thisClick.find("img").attr("src", newsrc);

	for (let i = 0; i < boxid.length; i++) {
		$("#" + boxid[i]).addClass("in");
	}
};

//获取指定的URL参数值
export var request = function(paramName) {
	let paramValue = "",
		isFound = !1;
	if (location.search.indexOf("?") == 0 && location.search.indexOf("=") > 1) {
		let arrSource = decodeURI(location.search).substring(1, location.search.length).split("&"),
			i = 0;
		while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
	}
	return paramValue == "" && (paramValue = null), paramValue
}
export var re_str = function(qs, qsv, type) {
	if (type == 0)
		return "?" + qs + "=" + qsv;
	else if (type == 1)
		return "&" + qs + "=" + qsv;
}

/**
 * 获取当前月的第一天
 */
export var getCurrentMonthFirst = function() {
	var date = new Date();
	date.setDate(1);
	return date;
};
/**
 * 获取当前月的最后一天
 */
export var getCurrentMonthLast = function() {
	var date = new Date();
	var currentMonth = date.getMonth();
	var nextMonth = ++currentMonth;
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
	var oneDay = 1000 * 60 * 60 * 24;
	return new Date(nextMonthFirstDay - oneDay);
};
/**
 * 通过ID获取支付渠道名称
 */
export var getChannelNameByID = function(channelId) {
	let channelName = "";
	if (channelId == 1) {
		channelName = "支付宝";
	} else if (channelId == 2) {
		channelName = "微信";
	} else if (channelId == 3) {
		channelName = "银联";
	} else if (channelId == 4) {
		channelName = "银行卡";
	} else if (channelId == 5) {
		channelName = "现金";
	}
	return channelName;
}

// 判断各种浏览器，找到正确的方法
function launchFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}
/**
 * 启动全屏!
 * 调用方式:
 *launchFullscreen(document.documentElement); //  整个网页
 */

// 如果是后台添加的默认手机号,就显示无
export var isMockMobile = function(mock_mobile) {
	return mock_mobile == "17757149705" ? "无" : mock_mobile;
}

export var calculateInputNum = function(idname) {
	let sumtotal = 0;
	$('input').each(function() {
		var classStr = $(this).attr('id');
		try {
			if (classStr.indexOf(idname) > -1) {
				sumtotal += parseFloat($("#" + classStr).val());
			}
		} catch (e) {}
	});
	return toDecimal(sumtotal).toFixed(2);
}

export var getreduceSum = function(oderServices) {
	let reducesum = 0;
	$.each(oderServices, function(idx, item) {
		reducesum += item.reduce;
	})
	return MoneyConversion(reducesum).toFixed(2);
}

//出生年月日获取年龄
export var getage = function(data) {
	var YearBorn = data;
	var myDate = new Date();
	var YearNow = myDate.getFullYear();
	return YearNow - YearBorn;
}

//数组去重
export var unique4 = function(arr) {
	arr.sort();
	var re = [arr[0]];
	for (var i = 1; i < arr.length; i++) {
		if (arr[i] !== re[re.length - 1]) {
			re.push(arr[i]);
		}
	}
	if (re[0] === undefined && re.length === 1)
		re = []
	return re;
}