'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	MoneyConversion,
	MoneyValue,
	request,
	re_str,
	setCookie,
	getCookie,
	leftBoxClick,
	isMockMobile,
	getreduceSum
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import Vld from 'validator';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import {
	PayText,
	ContainBox
} from './components/PayListSpinner.js';
var Login = "";


$(document).ready(function() {
	leftBoxClick("collapsePay", 1, "pay");
	//判断是否登录
	$.ajax({
		url: serviceurl + "order/refund",
		type: "get",
		dataType: "json",
		data: {
			"orderid": request("orderID")
		},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			console.log(JSON.stringify(dt));
			if (dt.status == "redirect") {
				//重定向到登录界面授权
				//location.href = "login.html?backurl=pay_refund.html";
				//$('#RedirectModal').modal('show');
				Login = "N";
				console.log("未登录");
			} else {
				Login = "Y";
				console.log("已登录");
			}
			$.ajax({
				url: serviceurl + "order/clinicOrderInfo",
				type: "get",
				dataType: "json",
				data: {
					"orderid": request("orderID")
				},
				contentType: "application/json",
				cache: false,
				async: false,

				success: function(dt) {
					//console.log("order_det+" + JSON.stringify(dt));
					if (dt.status == "success") {
						//隐藏loading
						$("#loading").hide();
						$("#loading_end").show();

						var OrderList = dt.map.order;
						var oderServices = dt.map.oderServices;
						let reducesum = getreduceSum(oderServices);
						ReactDOM.render(
							<ContainBox arrLists={oderServices}  />,
							document.getElementById('containBox')
						);
						var OrderRefund = dt.map.refund;
						var amount = 0;
						$.each(OrderList, function(idx, item) {

							amount = MoneyConversion(item.totalprice - item.reduce);
							$("#patientmobile").text(isMockMobile(item.userMobile));
							$("#doctorname").text(item.doctorname);
							$("#patientname").text(item.patientname);
							$("#totalSum").text(MoneyConversion(item.totalprice));
							$("#totalDisSum").text(MoneyConversion(item.totalprice) - reducesum);
							$("#discountSum").text(amount);

							$("#ordercontent").text(item.ordercontent);
							if (item.state == 1) {
								//var isPay = true;
							} else {
								$("#payFor_online").addClass("hide");
								$("#payFor_offline").addClass("hide");

								var payChannel = "";
								if (item.payChannel == 1) {
									payChannel = "支付宝";
								} else if (item.payChannel == 2) {
									payChannel = "微信";
								} else if (item.payChannel == 3) {
									payChannel = "银联";
								} else if (item.payChannel == 4) {
									payChannel = "银行卡";
									$("#offline_alert").show();
									$("#offline_pay").text("银行卡");
								} else if (item.payChannel == 5) {
									payChannel = "现金";
									$("#offline_alert").show();
									$("#offline_pay").text("现金");
								}

								if (item.refundstate == -1) {
									$("#alert_box").addClass("alert-success");
									ReactDOM.render(
										<PayText text="该订单还未申请过退款!" />,
										document.getElementById('alert_box')
									);
									$("#refundSum-box").removeClass("hide");
								} else if (item.refundstate == 0) {
									var RefundMoney = 0;
									var RefundingMoney = 0;
									$.each(OrderRefund, function(idx, item) {
										if (item.state == 0) {
											RefundingMoney += MoneyConversion(item.money);
										} else if (item.state == 1) {
											RefundMoney += MoneyConversion(item.money);
										}
									});

									$("#alert_box").addClass("alert-info");
									if (RefundMoney == 0) {
										let text = "该订单已申请" + payChannel + "退款" + RefundingMoney.toFixed(2) + "元!"
										ReactDOM.render(
											<PayText text={text} />,
											document.getElementById('alert_box')
										);
									} else if (RefundMoney > 0) {
										let text = "该订单已申请" + payChannel + "退款" + (RefundingMoney + RefundMoney).toFixed(2) + "元,已成功退款" + RefundMoney + "元！"
										ReactDOM.render(
											<PayText text={text} />,
											document.getElementById('alert_box')
										);
									}

									$("#refundSum").text(RefundingMoney + RefundMoney);
									$("#refundSum-box").removeClass("hide");
								} else if (item.refundstate == 1) {
									RefundMoney = 0;
									$.each(OrderRefund, function(idx, item) {
										RefundMoney += MoneyConversion(item.money);
									});
									$("#alert_box").addClass("alert-warning");
									let text = "该订单已由" + payChannel + "成功退款" + RefundMoney.toFixed(2) + "元!";
									ReactDOM.render(
										<PayText text={text} />,
										document.getElementById('alert_box')
									);
									$("#refundSum").text(RefundMoney);
									$("#refundSum-box").removeClass("hide");
								}
								$("#alert_box").show();
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

			//退款原因
			$.ajax({
				url: serviceurl + "order/rfReason",
				type: "get",
				dataType: "json",
				data: {},
				contentType: "application/json",
				cache: false,
				async: false,

				success: function(dt) {
					//console.log("list" + JSON.stringify(dt));
					if (dt.status == "success") {
						var list = new Array();
						list = dt.map;
						$.each(list, function(idx, item) {
							$("#reason").append(
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
		},

		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});

	$("#refundBtn").click(function() {
		if( Login == "Y"){
			$('#refundModal').modal('show');
		}else if( Login == "N"){
			$('#inputUser').text(getCookie("userMobile"));
			$('#RedirectModal').modal('show');
		}
	});

	$("#okBtn").click(function() {
		var getUserName = getCookie("userMobile");
		var getUserPassword = $("#inputPassword").val();

		var login = {
			"mobile": getUserName,
			"password": getUserPassword,
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
					$('#RedirectModal').modal('hide')
					$('#refundModal').modal('show');
					Login = "Y";
				} else if (dt.status == "error") {
					toast.show("密码错误");
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
			$("#saveBtn").attr("disabled", "disabled");
			var price = $("#inputPrice").val();
			var reason = $("#reason").val();
			var remark = $("#remark").val();
			var refundSum = $("#refundSum").text();
			if (Vld.isNull(price.trim())) {
				toast.show("请输入退款金额！");
				$("#saveBtn").attr("disabled", false);
				return;
			} else {
				if (parseFloat($("#discountSum").text() - parseFloat(refundSum)) < parseFloat(price)) {
					toast.show("退款金额不能大于可退金额！");
					$("#saveBtn").attr("disabled", false);
					return;
				} else if (parseFloat(price) < 0.01) {
					toast.show("退款金额必须大于等于0.01！");
					$("#saveBtn").attr("disabled", false);
					return;
				}
			}
			if (Vld.isNull(reason.trim())) {
				toast.show("请选择退款原因！");
				$("#saveBtn").attr("disabled", false);
				return;
			}
			var _params = {
				"orderid": request("orderID"),
				"money": MoneyValue(price),
				"type": reason,
				"remark": remark
			};
			$.ajax({
				url: serviceurl + "order/refund",
				type: "post",
				dataType: "json",
				data: JSON.stringify(_params),
				contentType: "application/json",
				cache: false,

				success: function(dt) {
					//console.log(JSON.stringify(dt));
					if (dt.status == "success") {
						//toast.show("申请退款成功！");
						toast.show(dt.message);
						setTimeout(function() {
							location.href = "pay_last.html" +
								re_str("hname", request("hname"), 0) +
								re_str("orderID", request("orderID"), 1) +
								re_str("opType", "fund", 1) +
								re_str("gobackURL", "pay_refund.html", 1) +
								re_str("sum", $("#totalSum").text(), 1) +
								re_str("discount", $("#discountSum").text(), 1) +
								re_str("patientname", $("#patientname").text(), 1) +
								re_str("patientmobile", $("#patientmobile").text(), 1) +
								re_str("doctorname", $("#doctorname").text(), 1);
						}, 3000);
					} else {
						toast.show(dt.message);
						$("#saveBtn").attr("disabled", false);
						return;
					}
				},

				error: function(XMLHttpRequest) {
					toast.show(XMLHttpRequest.responseJSON.message);
					$("#saveBtn").attr("disabled", false);
					return;
				}
			});

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