import {
	serviceurl
} from '../lib/common.js';

let neworderlen = 0;
let sumold = 0;
let countInter = 0;

function getResLen() {
	var _params = {
		"currentPage": 1,
		"timeid": 0,
		"querytime": "",
		"bookstatusid": "00",
		"doctorid": "",
		"patientname": ""
	};
	$.ajax({
		url: serviceurl + "booking/hosBooking",
		type: "get",
		dataType: "json",
		data: _params,
		contentType: "application/json",
		cache: false,
		success: function(dt) {
			if (dt.status == "success") {
				if (countInter == 0) {
					sumold = dt.map.page.totalCount;
					countInter++;
				}
				var sumnow = dt.map.page.totalCount;
				neworderlen = sumnow - sumold;
				if (neworderlen > 0) {
					$("#ResNum")[0].innerText = neworderlen;
					$("#ResNum").css({
						"color": "#fff",
						"background-color": "#777"
					})
				}
			}
		}
	});
};
export {
	getResLen
}