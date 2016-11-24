'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	setCookie,
	getCookie,
	checknull,
	MoneyValue,
	toDecimal,
	leftBoxClick,
	re_str,
	request,
	calculateInputNum,
	MoneyConversion
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
	sum,
	InputPrivilegeDiv,
	PayListBox
} from './components/PayListSpinner.js';
var discount = 0;
var servicesList = "";
var servicesContent = "";
var servicesList4Up = "";
const opType = (request("opType") == "init") ? 1 : 0;

function changeDiscount(non) {
	var text = checknull($("#inputPrivilege").val());
	if (non === 0) text = "";
	discount = calculateInputNum("sumzkx_");
	var choose = $('input[name="inlineRadioOptions"]:checked').val();
	if (text == "") {
		var number = 0;
		$("#discountSum").html("¥ " + discount);
	} else {
		if (!isNaN(text)) {
			if (text.indexOf("-") != -1) {
				toast.show("优惠不能为负数！");
				return;
			}
			number = parseFloat(text);
			if (choose == "1") {
				if (number <= sum) {
					discount = toDecimal(discount - number).toFixed(2);
				} else {
					toast.show("输入金额必须小于总额！");
					return;
				}
			} else if (choose == "2") {
				if (0 <= number && number < 100) {
					discount = toDecimal(discount * (100 - number) / 100).toFixed(2);
				} else {
					toast.show("输入折扣率必须大于等于0小于100！");
					return;
				}
			} else if (choose == "3") {
				discount = toDecimal(discount - number).toFixed(2);
			} else {
				discount = toDecimal(discount).toFixed(2);
			}
			$("#discountSum").html("¥ " + discount);
		} else {
			toast.show("请输入正确的优惠金额!");
			return;
		}
	}
};
$(document).ready(function() {
	//判断登陆与否
	testLogin("pay_center.html");
	leftBoxClick("collapsePay", 0, "pay");
	//隐藏loading
	$("#loading").hide();
	$("#loading_end").show();

	$('input[name="inlineRadioOptions"]').change(function() {
		$("#inputPrivilege").val("");
	});
	//完善服务项目数据
	$("#patientname").html(request("patientname"));
	$("#patientmobile").html(request("patientmobile"));
	$("#doctorname").html(request("doctorname"));
	var arrList = getCookie("serviceIDs").substr(1).split(",");
	$.each(arrList, function(index, item) {
		var id = item.split(" ")[0];
		var num = item.split(" ")[1];
		var title = item.split(" ")[2];
		var price = item.split(" ")[3];
		var unit = item.split(" ")[4];
		let disMoney = MoneyConversion(item.split(" ")[5], 2);
		if (opType) {
			servicesList += "," + id + " " + num + " " + title + " " + price + " " + checknull(unit) + " " + disMoney;
			setCookie("servicesList", servicesList, 30);
		}

	});

	$("#totalSum").html("¥ " + sum);
	//discount = toDecimal(sum);
	discount = toDecimal(calculateInputNum("sumzkx_"));

	$("#saveClick").click(function() {
		var arrList = getCookie("serviceIDs").substr(1).split(",");
		var numMoney = 0;
		var paramStr = "";
		$.each(arrList, function(index, item) {
			var id = item.split(" ")[0];
			numMoney = parseInt($("#input_" + id).val()) + numMoney;
			var num = parseInt($("#input_" + id).val());
			var title = item.split(" ")[2];
			var price = item.split(" ")[3];
			var unit = item.split(" ")[4];
			let disMoney = MoneyValue(parseFloat($("#sumzkj_" + id).val())).toFixed(0);
			if (num != 0) {
				if (opType) {
					servicesContent += ";" + id + "," + num + "," + disMoney;
				} else {
					servicesList4Up += ";" + id + "," + num + "," + disMoney;
				}
				paramStr += "," + id + " " + num + " " + title + " " + price + " " + unit + " " + disMoney;
			}
		});
		if (toDecimal(numMoney) <= 0) {
			toast.show("表单没有服务项目");
			return;
		} else {
			//changeDiscount();
			if (opType) {
				var _params = {
					"bookingid": request("bookingID"),
					"doctorid": request("doctorID"),
					"ordercontent": $("#inputAdvice").val(),
					"reduce": MoneyValue(sum) - MoneyValue(discount),
					"totalprice": MoneyValue(sum),
					"userid": request("clientID"),
					"services": servicesContent.substr(1)
				};
				var ajaxurl = "order/clinicInsert";
			} else {
				$("#discountSum").html("¥ " + discount);
				_params = {
					"orderid": request("orderID"),
					"reduce": MoneyValue(sum - discount),
					"totalprice": MoneyValue(sum),
					"services": servicesList4Up.substr(1)
				};
				ajaxurl = "order/clinicUpdate";
			}
			$.ajax({
				url: serviceurl + ajaxurl,
				type: "post",
				dataType: "json",
				data: JSON.stringify(_params),
				contentType: "application/json",
				cache: false,

				success: function(dt) {
					console.log(JSON.stringify(dt));
					if (dt.status == "success") {
						//存储订单id，订单编号
						setCookie("serviceIDs", paramStr, 30);
						setCookie("servicesList", paramStr, 30);
						if (opType) {
							location.href = "pay_last.html" +
								re_str("hname", request("hname"), 0) +
								re_str("opType", "pay", 1) +
								re_str("gobackURL", "pay_second.html", 1) +
								re_str("orderID", dt.data.id, 1) +
								re_str("orderNum", dt.data.ordernumber, 1) +
								re_str("sum", MoneyValue(sum), 1) +
								re_str("discount", MoneyValue(discount), 1) +
								re_str("reduce", MoneyValue(
									parseFloat($("#totalDisSum")[0].innerText.replace("¥", "").trim()) -
									parseFloat($("#discountSum")[0].innerText.replace("¥", "").trim())), 1) +
								re_str("patientname", request("patientname"), 1) +
								re_str("patientmobile", request("patientmobile"), 1) +
								re_str("doctorname", request("doctorname"), 1);
						} else {
							location.href = "pay_last.html" +
								re_str("hname", request("hname"), 0) +
								re_str("opType", "pay", 1) +
								re_str("gobackURL", "pay_second.html", 1) +
								re_str("orderID", request('orderID'), 1) +
								re_str("orderNum", request('orderNum'), 1) +
								re_str("sum", MoneyValue(sum), 1) +
								re_str("discount", MoneyValue(discount), 1) +
								re_str("reduce", MoneyValue(
									parseFloat($("#totalDisSum")[0].innerText.replace("¥", "").trim()) -
									parseFloat($("#discountSum")[0].innerText.replace("¥", "").trim())), 1) +
								re_str("patientname", request('patientname'), 1) +
								re_str("patientmobile", request('patientmobile'), 1) +
								re_str("doctorname", request('doctorname'), 1);
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
		}

	});
});


ReactDOM.render(
	<PayListBox changeDiscount={changeDiscount}/>,
	document.getElementById('paylistbox')
);

ReactDOM.render(
	<InputPrivilegeDiv changeDiscount={changeDiscount}/>,
	document.getElementById('inputPrivilegeDiv')
);

$('.spinnerExample').spinner({});

ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);