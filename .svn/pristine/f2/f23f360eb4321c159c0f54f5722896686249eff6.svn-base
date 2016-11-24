import {
	serviceurl
} from '../lib/common.js';
import {
	toast
} from '../lib/toast.js';

var sum = 0;
var pageContent = 10; //每页显示条数
var pageAllnum = 1; //总共几页
var dataList = [];

// //获取(刷新)列表信息
var refleshData = function(refObj) {
	//console.log("currentPage:   " + refObj.currentPage);
	var _params = {
		"currentPage": refObj.currentPage,
		"timeid": refObj.timeid,
		"querytime": refObj.querytime,
		"bookstatusid": refObj.bookstatusid,
		"doctorid": refObj.doctorid,
		"patientname": refObj.patientname
	};
	$.ajax({
		url: serviceurl + "booking/hosBooking",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			//	console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				//隐藏loading
				$("#loading").hide();

				dataList = dt.data;
				sum = dt.map.page.totalCount;
				$("#listSum").html(sum);
				if (sum % pageContent == 0) {
					pageAllnum = parseInt(sum / pageContent);
				} else {
					pageAllnum = parseInt(sum / pageContent) + 1;
				}
				var timerProcess = setTimeout(function() {
					if ($("#previousPage")[0] != undefined && $("#nextPage")[0] != undefined) {
						//分页显示判断
						if (pageAllnum == 1) {
							$("#previousPage").addClass("hide");
							$("#nextPage").addClass("hide");
						} else if (refObj.currentPage == pageAllnum) {
							$("#previousPage").removeClass("hide");
							$("#nextPage").addClass("hide");
						} else if (refObj.currentPage == 1) {
							$("#previousPage").addClass("hide");
							$("#nextPage").removeClass("hide");
						} else {
							$("#previousPage").removeClass("hide");
							$("#nextPage").removeClass("hide");
						}
						clearTimeout(timerProcess);
					}
				}, 10);
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

export {
	dataList,
	refleshData,
	sum,
	pageAllnum
}