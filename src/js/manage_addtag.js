'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	MoneyConversion,
	MoneyValue,
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
var clinicTagid = "";
var name = "";
var title = "";
var price = "";
//var reduce = "";
var detail = "";
var tagid = "";
var unit = "";
var serviceid = "";
var id = "";
var key = "";

//标签查询
$.ajax({
	url: serviceurl + "serve/clinicTag",
	type: "get",
	dataType: "json",
	data: {},
	contentType: "application/json",
	cache: false,
	async: false,

	success: function(dt) {
		console.log("标签" + JSON.stringify(dt));
		if (dt.status == "success") {
			//隐藏loading
			$("#loading").hide();
			$("#loading_end").show();

			var dataList = dt.data;
			$("#addtag-list").text("");
			if (dataList.length == 0) {
				$("#addtag-list" + id).append("<button type='button' class='list-group-item'><span class='panel-title'>暂无分组</span></button>");
			}
			$.each(dataList, function(index, content) {
				$("#addtag-list").append(
					"<div class='panel panel-default bmargin0 box-" + content.id + "'>" +
					"<div class='panel-body pointer tag_box dropdown'>" +
					"<div class='col-xs-10 col-sm-11 tag-list collapsed' data-toggle='collapse' href='#taglistname-" + content.id + "' aria-expanded='false' aria-controls='taglistname-" + content.id + "'>" +
					"<div class='add-clinicTag-div'>" +
					"<b class='panel-title tag-fontsize'>" + content.name + "</b>" +
					"</div>" +
					"</div>" +
					"<div class='col-xs-2 col-sm-1 text-right  dropdown-toggle tag_menu_box' id='dropdownMenu1' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>" +
					"<i class='glyphicon glyphicon-menu-hamburger tpadding05'></i>" +
					"</div>" +
					"<ul class='dropdown-menu tag_menu' aria-labelledby='dropdownMenu1'>" +
					"<li class='addSec-tag' id='addSec-tag-" + content.id + "' data-toggle='modal' data-target='#addSecTag'><a href='#'><i class='glyphicon glyphicon-plus'></i>添加项目</a></li>" +
					"<li class='det-clinicTag' id='det-clinicTag-" + content.id + "'><a href='#'><i class='glyphicon glyphicon-trash'></i>删除此分组</a></li>" +
					"</ul>" +
					"</div>" +
					"<div class='list-group collapse tag-body' id='taglistname-" + content.id + "'>" +
					"</div>" +
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

//子标签查询
$(".tag-list").click(function() {
	id = $(this).attr("href").split("-")[1];
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
			console.log("sha" + JSON.stringify(dt));
			if (dt.status == "success") {
				var clinicServerList = dt.data;
				$("#taglistname-" + id).text("");
				if (clinicServerList.length == 0) {
					$("#taglistname-" + id).append("<a href='#' class='list-group-item text-center' name='no-content' >该分组暂无项目</a>");
				} else {
					$.each(clinicServerList, function(index, content) {
						$("#taglistname-" + id).append(
							"<a href='#' class='list-group-item a-" + content.id + " '>" +
							"<div class='row'>" +
							"<span class='col-xs-10 col-sm-11 sectag_update'  id='Sectag-update-" + content.id + "-" + id + "' data-toggle='modal' data-target='#SecTagUpdate'>" +
							"<span class='col-sm-4'>" +
							"<span class='Sec-title'>" + content.title + "</span>" +
							"</span>" +
							"<span class='col-sm-4'>价格：￥" + MoneyConversion(content.price).toFixed(2) + "</span>" +
							"<span class='col-sm-4'>单位：" + content.unit + "</span>" +
							"</span>" +
							"<span class='col-xs-2 col-sm-1 det-clinicServer text-right' id='det-clinicServer-" + content.id + "'><i class='glyphicon glyphicon-trash tpadding05 text-right'></i></span>" +
							"</div>" +
							"</a>"
						);
					});
				}
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

// 删除项目
$("ul").on("click", ".det-clinicTag", function() {
	if (window.confirm('是否删除该项目？')) {
		clinicTagid = $(this).attr("id").split("-")[2];
		$.ajax({
			url: serviceurl + "serve/clinicDelTag",
			type: "post",
			dataType: "json",
			data: JSON.stringify({
				"id": clinicTagid
			}),
			contentType: "application/json",
			cache: false,
			async: false,
			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					toast.show("删除成功");
					$(".box-" + clinicTagid).slideUp();
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
	} else {
		return
	}
});

//删除子项目
$(".tag-body").on("click", ".det-clinicServer", function() {
	if (window.confirm('是否删除该项目？')) {
		serviceid = $(this).attr("id").split("-")[2];
		$.ajax({
			url: serviceurl + "serve/clinicDelServer",
			type: "post",
			dataType: "json",
			data: JSON.stringify({
				"serviceid": serviceid
			}),
			contentType: "application/json",
			cache: false,
			async: false,
			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					toast.show("删除成功");
					$(".a-" + serviceid).slideUp();
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
	} else {
		return
	}
});

//添加分组
$("#addFirst-tag").click(function() {
	$("#addFirst-tag").attr("disabled", "disabled");
	name = $("#FirstTag").val();
	if (Vld.isLength(name.trim(), {
			min: 1,
			max: 15
		}) === false) {
		toast.show("请输入标签名(15字以内)");
		$("#addFirst-tag").attr("disabled", false);
		return;
	} else {
		$.ajax({
			url: serviceurl + "serve/clinicInsertTag",
			type: "post",
			dataType: "json",
			data: JSON.stringify({
				"name": name
			}),
			contentType: "application/json",
			cache: false,
			async: false,
			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					console.log("添加项目成功");
					$('#addFirstTag').modal('hide');
					$("#addFirst-tag").attr("disabled", false);
					$("#FirstTag").val("");
					location.href = "manage_addtag.html" +
						re_str("hname", request("hname"), 0);
				} else {
					toast.show(dt.message);
					$("#addFirst-tag").attr("disabled", false);
					return;
				}
			},
			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				$("#addFirst-tag").attr("disabled", false);
				return;
			}
		});
	}
})

//添加项目
$(".addSec-tag").click(function() {
	tagid = $(this).attr("id").split("-")[2];
});

//修改项目
$(".tag-body").on("click", ".sectag_update", function() {
	tagid = $(this).attr("id").split("-")[3];
	serviceid = $(this).attr("id").split("-")[2];
	//搜索标签
	$.ajax({
		url: serviceurl + "serve/clinicTag",
		type: "get",
		dataType: "json",
		data: {},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log("标签" + JSON.stringify(dt));
			if (dt.status == "success") {
				var dataList = dt.data;
				$("#selectFirstTag").html("");
				$.each(dataList, function(index, content) {
					if (tagid == content.id) {
						$("#selectFirstTag").append(
							"<option value='" + content.id + "' selected='selected' id='updatefirsttag-" + content.id + "'>" + content.name + "</option>"
						);
					} else {
						$("#selectFirstTag").append(
							"<option value='" + content.id + "' id='updatefirsttag-" + content.id + "'>" + content.name + "</option>"
						);
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


	$.ajax({
		url: serviceurl + "serve/detail",
		type: "get",
		dataType: "json",
		data: {
			"serviceid": serviceid
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log(tagid + JSON.stringify(dt));
			if (dt.status == "success") {
				var queryServerDet = dt.data;
				$("#UpdateSecTag_title").val(queryServerDet.title);
				$("#UpdateSecTag_price").val(MoneyConversion(queryServerDet.price).toFixed(2));
				$("#UpdateSecTag_unit").val(queryServerDet.unit);
				$("#UpdateSecTag_detail").val(queryServerDet.detail);
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


$(document).ready(function() {
	//判断登陆与否
	testLogin("manage_addtag.html");
	leftBoxClick("collapseMan", 2, "manage");

	$("#UpdateSecond-tag").click(function() {
		$("#UpdateSecond-tag").attr("disabled", "disabled");
		if (Vld.isLength($("#UpdateSecTag_title").val().trim(), {
				min: 1,
				max: 15
			}) === false) {
			toast.show("请输入正确标签名(15字以内)");
			$("#UpdateSecond-tag").attr("disabled", false);
			return;
		}
		if (Vld.isNull($("#UpdateSecTag_price").val().trim())) {
			toast.show("请输入金额");
			$("#UpdateSecond-tag").attr("disabled", false);
			return;
		}
		/*if (Vld.equals($("#UpdateSecTag_price").val() + "", "0")) {
			toast.show("金额必须大于0！");
			$("#UpdateSecond-tag").attr("disabled", false);
			return;
		}*/
		if (!isNaN($("#UpdateSecTag_price").val())) {
			/*			if ($("#UpdateSecTag_price").val().indexOf("-") != -1) {
							toast.show("金额必须大于0！");
							$("#UpdateSecond-tag").attr("disabled", false);
							return;
						}*/
		} else {
			toast.show("金额必须为数字！");
			$("#UpdateSecond-tag").attr("disabled", false);
			return;
		}
		if (Vld.isLength($("#UpdateSecTag_unit").val().trim(), {
				min: 1,
				max: 5
			}) === false) {
			toast.show("请输入正确单位名称(5个字以内)");
			$("#UpdateSecond-tag").attr("disabled", false);
			return;
		}
		if (!Vld.isNull($("#UpdateSecTag_detail").val().trim()) && Vld.isLength($("#UpdateSecTag_detail").val().trim(), {
				min: 1,
				max: 500
			}) === false) {
			toast.show("请输入正确简介(500字以内)");
			$("#UpdateSecond-tag").attr("disabled", false);
			return;
		}
		var clinicEditServer = {
			serviceid: serviceid,
			title: $("#UpdateSecTag_title").val(),
			price: MoneyValue($("#UpdateSecTag_price").val()),
			detail: $("#UpdateSecTag_detail").val(),
			oldTagid: tagid,
			newTagid: $("#selectFirstTag").val(),
			unit: $("#UpdateSecTag_unit").val()
		}
		$.ajax({
			url: serviceurl + "serve/clinicEditServer",
			type: "post",
			dataType: "json",
			data: JSON.stringify(clinicEditServer),
			contentType: "application/json",
			cache: false,
			async: false,

			success: function(dt) {
				console.log(tagid + JSON.stringify(dt));
				if (dt.status == "success") {
					toast.show("修改成功");
					$("#SecTagUpdate").modal('hide');
					$("#UpdateSecond-tag").attr("disabled", false);
					location.reload();
				} else {
					toast.show(dt.message);
					$("#UpdateSecond-tag").attr("disabled", false);
					return;
				}
			},

			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				$("#UpdateSecond-tag").attr("disabled", false);
				return;
			}
		});
	});


	$("#addSecond-tag").click(function() {
		$("#addSecond-tag").attr("disabled", "disabled");
		title = $("#SecTag_title").val();
		price = $("#SecTag_price").val();
		detail = $("#SecTag_detail").val();
		unit = $("#SecTag_unit").val();

		if (Vld.isLength(title.trim(), {
				min: 1,
				max: 15
			}) === false) {
			toast.show("请输入正确标签名(15字以内)");
			$("#addSecond-tag").attr("disabled", false);
			return;
		}
		if (Vld.isNull(price)) {
			toast.show("请输入金额");
			$("#addSecond-tag").attr("disabled", false);
			return;
		}
		/*if (Vld.equals(price + "", "0")) {
			toast.show("金额必须大于0！");
			$("#addSecond-tag").attr("disabled", false);
			return;
		}*/
		if (!isNaN(price)) {
			/*if (price.indexOf("-") != -1) {
				toast.show("金额必须大于0！");
				$("#addSecond-tag").attr("disabled", false);
				return;
			}*/
		} else {
			toast.show("金额必须为数字！");
			$("#addSecond-tag").attr("disabled", false);
			return;
		}
		if (Vld.isLength(unit.trim(), {
				min: 1,
				max: 5
			}) === false) {
			toast.show("请输入正确单位名称(5个字以内)");
			$("#addSecond-tag").attr("disabled", false);
			return;
		}
		if (!Vld.isNull(detail.trim()) && Vld.isLength(detail.trim(), {
				min: 1,
				max: 500
			}) === false) {
			toast.show("请输入正确简介(500字以内)");
			$("#addSecond-tag").attr("disabled", false);
			return;
		}
		$.ajax({
			url: serviceurl + "serve/clinicInsertServer",
			type: "post",
			dataType: "json",
			data: JSON.stringify({
				"title": title,
				"price": MoneyValue(price),
				"detail": detail,
				"tagid": tagid,
				"unit": unit
			}),
			contentType: "application/json",
			cache: false,
			async: false,
			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					$('#addSecTag').modal('hide');
					$("#SecTag_title").val("");
					$("#SecTag_price").val("");
					$("#SecTag_detail").val("");
					$("#SecTag_unit").val("");
					toast.show("添加成功");
					location.href = "manage_addtag.html" +
						re_str("hname", request("hname"), 0);
				} else {
					toast.show(dt.message);
					$("#addSecond-tag").attr("disabled", false);
					return;
				}
			},
			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				$("#addSecond-tag").attr("disabled", false);
				return;
			}
		});
	});
});

ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);

ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);