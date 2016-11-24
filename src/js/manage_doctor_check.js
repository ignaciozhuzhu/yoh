'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	re_str,
	request,
	leftBoxClick
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
$(document).ready(function() {
	//判断登陆与否
	testLogin("manage_doctor_check.html");
	leftBoxClick("collapseMan", 1, "manage");
});
$("#loading").hide();
$("#loading_end").show();
var MainBox = React.createClass({
	saveDoc: function() {
		var mobile = $("#docTel").val();
		if (Vld.isMobilePhone(mobile, 'zh-CN') === false) {
			toast.show("请输入11位手机号！");
			return;
		}
		var _params = {
			"mobile": mobile
		};
		$.ajax({
			url: serviceurl + "hospital/addDoctorByMobile",
			type: "post",
			dataType: "json",
			data: JSON.stringify(_params),
			contentType: "application/json",
			cache: false,

			success: function(dt) {
				console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					var type = dt.data;
					if (type == "0") {
						//用户不存在,进入录入医生信息页面
						//setCookie("doctormobile", mobile, 30);
						location.href = "manage_doctor_add.html" +
							re_str("hname", request("hname"), 0) +
							re_str("doctormobile", mobile, 1);
					} else if (type == "1") {
						//被注册为其他角色
						toast.show("该医生已经被注册为其他角色");
						return;
					} else if (type == "2") {
						//医生添加成功
						toast.show("医生添加成功");
						setTimeout(function() {
							location.href = "manage_doctor.html";
						}, 3000);
					} else if (type == "3") {
						//该医生已经在该医院内
						toast.show("该医生已经在该医院内");
						return;
					}
				} else {
					toast.show(dt.message);
					return;
				}
			},

			error: function(XMLHttpRequest) {}
		});

	},
	render: function() {
		return (
			<div className="input-group">
                <input type="text" className="form-control" placeholder="医生手机号" id="docTel"/>
                <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.saveDoc}>
                        <i className="glyphicon glyphicon-plus"></i>
                    </button>
                </span>
            </div>
		);
	}
});

ReactDOM.render(
	<MainBox />,
	document.getElementById('content')
);
ReactDOM.render(
	<LeftBox />,
	document.getElementById('leftMainBox')
);
ReactDOM.render(
	<TopBox />,
	document.getElementById('topMainBox')
);