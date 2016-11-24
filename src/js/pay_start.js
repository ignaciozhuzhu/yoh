'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	setCookie,
	getCookie,
	checknull,
	MoneyConversion,
	leftBoxClick,
	re_str,
	request,
	MoneyValue
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import {
	testLogin
} from './ajax/user.js';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import {
	CarListBox
} from './components/PayListSpinner.js';
var uniqueness = []; //唯一性数组
var arr = [];
const opType = (request("opType") == "cent") ? 0 : 1; //从center进来是0,从list进来是1
//var dataList = []; //挂号的用户
if (opType) {
	var ObjectQuery = function(patientname, patientmobile, doctorname, bookingID, doctorID, patientID, orderID, orderNum) {
		this.patientname = patientname;
		this.patientmobile = patientmobile;
		this.doctorname = doctorname;
		this.bookingID = bookingID;
		this.doctorID = doctorID;
		this.patientID = patientID;
		this.orderID = orderID;
		this.orderNum = orderNum;
		return this;
	}
	var objectQuery = {};
}
$(document).ready(function() {
	//判断登陆与否
	testLogin("pay_center.html");
	leftBoxClick("collapsePay", 0, "pay");

	if (!opType) {
		if (checknull(getCookie("servicesList")) != "") {
			var arrList = getCookie("servicesList").substr(1).split(",");
			$.each(arrList, function(index, item) {
				var id = item.split(" ")[0];
				//var num = item.split(" ")[1];
				var title = item.split(" ")[2];
				var price = item.split(" ")[3];
				var unit = item.split(" ")[4];
				let disMoney = item.split(" ")[5];
				// var thisSum = parseInt(num)*(parseFloat(price).toFixed(2));
				// var sum = parseFloat(sum) + thisSum;
				if ($.inArray(id, uniqueness) == -1) {
					uniqueness.push(id);
					addService(id, title, price, unit, disMoney);
				}
			});
		}
	} else {
		//获取订单信息
		$.ajax({
			url: serviceurl + "order/clinicOrderInfo",
			type: "get",
			dataType: "json",
			data: {
				orderid: request("orderID")
			},
			contentType: "application/json",
			cache: false,
			async: false,

			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					//隐藏loading
					$("#loading").hide();
					$("#loading_end").show();
					$.each(dt.map.order, function(index, item) {
						objectQuery = new ObjectQuery(item.patientname, item.patientMobile, item.doctorname, item.bookingid, item.doctorid, item.patientid, item.id, item.ordernumber, item.reduce)
					});
					$.each(dt.map.oderServices, function(index, item) {
						addService(item.serviceid,
							checknull(item.servicename),
							checknull(MoneyConversion(item.price)),
							checknull(item.unit),
							checknull(item.amount),
							checknull(item.reduce));
						uniqueness.push(item.serviceid + "");
					});
				}
			},

			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				return;
			}
		});
	}
});

//添加按钮事件
$("#pay-car").click(function() {
	$(".gouwuche .panel-heading").stop().slideToggle();
	$(".gouwuche .list-group").stop().slideToggle();
	// $(".gouwuche .panel-heading").removeClass("hide");
	// $(".gouwuche .list-group").removeClass("hide");
});
$("#clearAllBtn").click(function() {
	uniqueness = [];
	$("#serviceList").html("");
	$("#sum").text(0);
	if (!opType) {
		setCookie("servicesList", "", 30);
	}
	arr = [];
});
$("#subBtn").click(function() {
	if (parseInt($("#sum")[0].textContent) < 1) {
		toast.show("请添加服务项目");
		return;
	} else {
		var paramStr = "";
		$.each($(".service_id"), function(index, item) {
			if (!opType) {
				paramStr += "," + item.value + " " + $("#input_" + item.value)[0].value + " " + $("#title_" + item.value)[0].textContent + " " + $("#price_" + item.value)[0].value + " " + $("#unit_" + item.value).text().split("/")[1];
			} else {
				paramStr += "," + item.value + " " + $("#input_" + item.value)[0].value + " " + $("#title_" + item.value)[0].textContent + " " + $("#price_" + item.value)[0].value + " " + $("#unit_" + item.value).text().split("/")[1] + " " + MoneyValue($("#disMoney_" + item.value)[0].innerText) + " ";
			}
		});
		setCookie("serviceIDs", paramStr, 30);

		if (!opType) {
			location.href = "pay_second.html" +
				re_str("hname", request("hname"), 0) +
				re_str("gobackURL", "pay_start.html", 1) +
				re_str("bookingID", request('bookingID'), 1) +
				re_str("doctorID", request('doctorID'), 1) +
				re_str("doctorname", request('doctorname'), 1) +
				re_str("patientID", request('patientID'), 1) +
				re_str("clientID", request('clientID'), 1) +
				re_str("patientname", request('patientname'), 1) +
				re_str("patientmobile", request('patientmobile'), 1) +
				re_str("opType", "init", 1);
		} else {
			location.href = "pay_second.html" +
				re_str("hname", request("hname"), 0) +
				re_str("gobackURL", "pay_start.html", 1) +
				re_str("patientname", objectQuery.patientname, 1) +
				re_str("patientmobile", objectQuery.patientmobile, 1) +
				re_str("doctorname", objectQuery.doctorname, 1) +
				re_str("orderID", objectQuery.orderID, 1) +
				re_str("orderNum", objectQuery.orderNum, 1) +
				re_str("opType", "4Up", 1);
		}
	}
});


function addService(id, title, price, unit, num, disMoney) {
	// $(".gouwuche .panel-heading").removeClass("hide");
	// $(".gouwuche .list-group").removeClass("hide");
	if (opType) $("#showList").removeClass("hide");
	$("#sum").text(parseInt($("#sum")[0].textContent) + (num || 1));

	function ObjectService(id, title, price, unit, num, disMoney) {
		this.id = id;
		this.title = title;
		this.price = price;
		this.unit = unit;
		this.num = num || 1;
		this.disMoney = disMoney || 0;
		return this;
	}
	var objectService = new ObjectService(id, title, price, unit, num, disMoney);
	arr.push(objectService);
	ReactDOM.render(
		<CarListBox arrLists={arr} />,
		document.getElementById('serviceList')
	);

	$("#plus_" + id).click(function() {
		var input = $("#input_" + id)[0];
		input.value = parseInt(input.value) + 1;
		$("#sum").text(parseInt($("#sum")[0].textContent) + 1);
		//arr;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id == id) {
				arr[i].num = input.value
			}
		}
	});
	$("#minus_" + id).click(function() {
		var input = $("#input_" + id)[0];
		if (parseInt(input.value) > 0) {
			input.value = parseInt(input.value) - 1;
			$("#sum").text(parseInt($("#sum")[0].textContent) - 1);
		}
		if (parseInt(input.value) == 0) {
			$(this).parents("li").remove();
			uniqueness.splice(jQuery.inArray($(this).attr("id").split("_")[1], uniqueness), 1);
			if (uniqueness.length == 0) {
				$("#sum").text(0);
			}
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].id == $(this).attr("id").split("_")[1]) {
					arr.splice(i, 1);
				}
			}
			ReactDOM.render(
				<CarListBox arrLists={arr} />,
				document.getElementById('serviceList')
			);
		}
	});
};

var clinicServerList = function(id, key) {
	$.ajax({
		url: serviceurl + "serve/clinicServer",
		type: "get",
		dataType: "json",
		data: {
			"tagid": id,
			"key": key
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			//console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				var clinicServerList = dt.data;
				$("#clinicServer-list").text("");
				if (clinicServerList.length == 0) {
					$("#clinicServer-list").append("<li class='list-group-item'><span>该项目暂无具体内容</span><span class='pull-right'></span></li>");
				}
				$.each(clinicServerList, function(index, content) {
					$("#clinicServer-list").append("<li class='list-group-item height45'><span class='col-sm-5 col-xs-3' >" + content.title +
						"</span><span class='col-sm-5 col-xs-3' >￥" +
						MoneyConversion(content.price).toFixed(2) + " /" +
						content.unit + "</span><a class='pull-right text-center link' href='#' ><i class='glyphicon glyphicon-shopping-cart' id=" + content.id + "  thistitle=" + content.title + " price=" + content.price + " unit=" + content.unit + "></i></a></li>");
					$(".glyphicon.glyphicon-shopping-cart").click(function() {
						var thisid = $(this).attr("id");
						if ($.inArray(thisid, uniqueness) == -1) {
							uniqueness.push(thisid);
							//插入服务项
							addService(
								$(this).attr("id"),
								checknull($(this).attr("thistitle")),
								checknull(MoneyConversion($(this).attr("price"))),
								checknull($(this).attr("unit")),
								checknull($(this).attr("num")));
							toast.show("成功加入购物车", 2000);
							return false;
						} else {
							toast.show("已加入购物车", 2000);
							return false;
						}
					});
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
};

$.ajax({
	url: serviceurl + "serve/clinicTag",
	type: "get",
	dataType: "json",
	// data : {"hospitalid" : "1"},
	contentType: "application/json",
	cache: false,
	async: false,

	success: function(dt) {
		//console.log("my!!!!" + JSON.stringify(dt));
		if (dt.status == "success") {
			//隐藏loading
			$("#loading").hide();
			$("#loading_end").show();

			var dataList = dt.data;
			$.each(dataList, function(index, content) {
				$("#pay-start-group").append(
					"<a href='#' class='filter-item' id='" + content.id + "' >" + content.name + "</a>"
				);
			});

			$("#pay-start-group a").click(function() {
				$("#pay-start-group a").removeClass("active paybg-color");
				$(this).addClass("active paybg-color");
				$(".panel-heading h4").text($(this).text());
				clinicServerList($(this).attr("id"));
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