import {
	serviceurl
} from '../lib/common.js';
import {
	toast
} from '../lib/toast.js';
var docList = [];

//获取医生列表
var getlistHosDoctor = function() {
	$.ajax({
		url: serviceurl + "hospital/listHosDoctor",
		type: "get",
		dataType: "json",
		data: {},
		contentType: "application/json",
		cache: false,
		async: false,

		success: function(dt) {
			//console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				//隐藏loading
				$("#loading").hide();
				docList = dt.data;
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

export {
	getlistHosDoctor,
	docList
}