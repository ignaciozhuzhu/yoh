'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	getCookie,
	serviceurl,
	MoneyConversion,
	MoneyValue,
	leftBoxClick,
	request,
	getChannelNameByID,
	isMockMobile,
	getreduceSum
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
import {
	ContainBox
} from './components/PayListSpinner.js';

var isPay = false; //是否为要付款，默认值不需要付款
const opType = (request("opType") == "pay") ? 0 : 1; //如果是从pay_second过来,值就是pay,opType=0,否则opType=1
var channel;
$(document).ready(function() {

	$("#pay_card").click(function() {
		$("#pay_card_box").css("display", "block");
		$(".pay_confirm").css("display", "block");
	});
	$("#pay_money").click(function() {
		$("#pay_card_box").css("display", "none");
		$(".pay_confirm").css("display", "block");
	});

	//判断登陆与否
	testLogin("pay_order_list.html");
	leftBoxClick("collapsePay", 1, "pay");
	//订单详情--获取医嘱
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
			//console.log("order-det:" + JSON.stringify(dt));
			if (dt.status == "success") {
				//隐藏loading
				$("#loading").hide();
				$("#loading_end").show();
				var OrderList = dt.map.order;
				var oderServices = dt.map.oderServices;
				if (opType) {
					var OrderRefund = dt.map.refund;
					var amount = 0;
					ReactDOM.render(
						<ContainBox arrLists={oderServices}  />,
						document.getElementById('containBox')
					);
				}
				let reducesum = getreduceSum(oderServices);

				if (!opType) {
					//完善服务项目数据
					var arrList = getCookie("serviceIDs").substr(1).split(",");
					ReactDOM.render(
						<ContainBox arrLists={arrList}  />,
						document.getElementById('containBox')
					);
					$("#patientname").html(request("patientname"));
					$("#patientmobile").html(isMockMobile(request("patientmobile")));
					$("#doctorname").html(request("doctorname"));
					$("#totalSum").html(MoneyConversion(request("sum")).toFixed(2));
					$("#totalDisSum").html(((MoneyConversion(request("sum")) - reducesum)).toFixed(2));
					$("#discountSum").html(MoneyConversion(request("discount")).toFixed(2));
				}
				$.each(OrderList, function(idx, item) {
					if (opType) {
						amount = MoneyConversion(item.totalprice - item.reduce);
						//完善服务项目数据
						$("#patientmobile").text(isMockMobile(item.userMobile));
						$("#doctorname").text(item.doctorname);
						$("#patientname").text(item.patientname);
						$("#totalSum").text(MoneyConversion(item.totalprice).toFixed(2));
						$("#totalDisSum").text((MoneyConversion(item.totalprice) - reducesum).toFixed(2));
						$("#discountSum").text(amount.toFixed(2));
					}
					$("#ordercontent").text(item.ordercontent);
					if (item.state == 1) {
						isPay = true;
					} else {
						$("#payFor_online").addClass("hide");
						$("#payFor_offline").addClass("hide");
						if (!opType) {
							toast.show("该订单已支付");
						} else if (opType) {
							var payChannel = getChannelNameByID(item.payChannel);

							if (item.refundstate == -1) {
								$("#alert_box").addClass("alert-success");
								$("#alert_box").html(
									"<i class='glyphicon glyphicon-ok-circle'></i>" +
									"该订单已由" + payChannel + "成功支付!"
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
									$("#alert_box").html(
										"<i class='glyphicon glyphicon-ok-circle'></i>" +
										"该订单已申请" + payChannel + "退款" + RefundingMoney.toFixed(2) + "元!"
									);
								} else if (RefundMoney > 0) {
									$("#alert_box").html(
										"<i class='glyphicon glyphicon-ok-circle'></i>" +
										"该订单已申请" + payChannel + "退款" + (RefundingMoney + RefundMoney).toFixed(2) + "元,已成功退款" + RefundMoney + "元！"
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
								$("#alert_box").html(
									"<i class='glyphicon glyphicon-ok-circle'></i>" +
									"该订单已由" + payChannel + "成功退款" + RefundMoney.toFixed(2) + "元!"
								);
								$("#refundSum").text(RefundMoney);
								$("#refundSum-box").removeClass("hide");
							}
							$("#alert_box").show();
						}
					}
				});

				if (isPay) {
					//监听订单状态是否已付款
					var Paymethod = window.setInterval(function() {
						$.ajax({
							url: serviceurl + "order/orderPayState",
							type: "get",
							dataType: "json",
							data: {
								"orderid": request("orderID")
							},
							contentType: "application/json",
							cache: false,
							async: false,
							success: function(dt) {
								//console.log(JSON.stringify(dt));
								if (dt.data == "Y") {
									toast.show("付款成功");
									if (!opType) {
										$("#pay-method").text(getChannelNameByID(dt.map.channel));
									} else {
										var channel = getChannelNameByID(dt.map.channel);
										$("#alert_box").addClass("alert-success");
										$("#alert_box").html(
											"<i class='glyphicon glyphicon-ok-circle'></i>" +
											"该订单已由 " + channel + " 成功支付!"
										);
									}
									$("#alert_box").show();
									$("#payFor_online").hide();
									$("#payFor_offline").hide();
									clearInterval(Paymethod);
								}
							},

							error: function(XMLHttpRequest) {
								toast.show(XMLHttpRequest.responseJSON.message);
								clearInterval(Paymethod);
								return;
							}
						});
					}, 5000);

					//支付宝生成付费二维码
					var ali_params = {
						"orderId": request("orderID"),
						"orderNo": (!opType) ? request("orderNum") : "",
						"amount": (!opType) ? request("discount") : MoneyValue(amount),
						"channel": "alipay_qr"
					};
					//console.log("zfb" + JSON.stringify(ali_params));
					$.ajax({
						url: serviceurl + "order/paying",
						type: "post",
						dataType: "json",
						data: JSON.stringify(ali_params),
						contentType: "application/json",
						cache: false,
						success: function(dt) {
							//console.log("paying:   " + JSON.stringify(dt));
							if (dt.status == "success") {
								var payURL = dt.data.credential.alipay_qr;
								jQuery('#aliPay').qrcode(payURL);
							} else if (dt.status == "redirect") {
								location.href = "../html/login.html"
							}
						},
						error: function(XMLHttpRequest) {
							clearInterval(Paymethod);
							toast.show(XMLHttpRequest.responseJSON.message);
							return;
						}
					});
					//微信生成付费二维码
					ali_params = {
						"orderId": request("orderID"),
						"orderNo": (!opType) ? request("orderNum") : "",
						"amount": (!opType) ? request("discount") : MoneyValue(amount),
						"channel": "wx_pub_qr"
					};
					//console.log("wx" + JSON.stringify(ali_params));
					setTimeout(wx_pay, 500);

					function wx_pay() {
						$.ajax({
							url: serviceurl + "order/paying",
							type: "post",
							dataType: "json",
							data: JSON.stringify(ali_params),
							contentType: "application/json",
							cache: false,
							success: function(dt) {
								//console.log("paying:   " + JSON.stringify(dt));
								if (dt.status == "success") {
									var payURL = dt.data.credential.wx_pub_qr;
									jQuery('#weixinPay').qrcode(payURL);
								} else {
									if (dt.message == "线上支付金额必须大于0") {
										channel = 5;
										document.getElementById('pay_confirm').click();
									} else {
										toast.show(dt.message);
									}
									return;
								}
							},
							error: function(XMLHttpRequest) {
								clearInterval(Paymethod);
								toast.show(XMLHttpRequest.responseJSON.message);
								return;
							}
						});
					};


					//线下支付
					$("#pay_confirm").click(function() {
						channel = $("input[name='pay_offline']:checked").val() || channel;
						var tradeNo = "";
						var method = "";
						if (channel == 4) {
							tradeNo = $("#card_num").val();
							if (Vld.isNull(tradeNo + "")) {
								toast.show("请填写卡号！");
								return;
							}
							if (isNaN(tradeNo)) {
								toast.show("请输入正确的卡号");
								return;
							} else {
								if (!(tradeNo.length == 16 || tradeNo.length == 19)) {
									toast.show("请输入正确的卡号");
									return;
								}
							}
						}
						var offline_params = {
							"orderId": request("orderID"),
							"tradeNo": tradeNo,
							"amount": request("discount"),
							"channel": channel
						}
						$.ajax({
							url: serviceurl + "order/offlinePaying",
							type: "post",
							dataType: "json",
							data: JSON.stringify(offline_params),
							contentType: "application/json",
							cache: false,

							success: function(dt) {
								//console.log("paying:   " + JSON.stringify(dt));
								if (dt.status == "success") {
									clearInterval(Paymethod);
									$("#pay_confirm").attr("disabled", "disabled");
									toast.show("线下支付成功");
									if (!opType) {
										$("#pay-method").text(getChannelNameByID(channel));
									} else {
										method = getChannelNameByID(channel);
										$("#alert_box").addClass("alert-success");
										$("#alert_box").html(
											"<i class='glyphicon glyphicon-ok-circle'></i>" +
											"该订单已由" + method + "成功支付!"
										);
									}
									$("#alert_box").show();
									$("#payFor_online").hide();
									$("#payFor_offline").hide();
									return;
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
				}
			} else if (dt.status == "redirect") {
				location.href = "../html/login.html"
			}
		},

		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
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