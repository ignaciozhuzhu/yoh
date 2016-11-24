'use strict';
import React from 'react';
import {
	serviceurl,
	setCookie,
	request
} from '../lib/common.js';
import {
	toast
} from '../lib/toast.js';
//顶部边框控件
var TopBox = React.createClass({
	logout: function() {
		$.ajax({
			url: serviceurl + "site/logout",
			type: "post",
			dataType: "json",
			data: {},
			contentType: "application/json",
			cache: false,
			async: false,
			success: function(dt) {
				//console.log(JSON.stringify(dt));
				if (dt.status == "success") {
					// console.log("退出成功");
					setCookie("userName", "", 30);
					setCookie("userMobile", "", 30);
					setCookie("userPWD", "", 30);
					location.href = "login.html";
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
	componentDidMount: function() {
		$("#hospitalname").text(request("hname"));
	},
	render: function() {
		var href = "manage_clinic.html?hname=" + request("hname");
		return (
			<div className="container">
		<div className="navbar-header">
			<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
				<span className="sr-only">Toggle navigation</span> 
				<span className="icon-bar"></span> 
				<span className="icon-bar"></span> 
				<span className="icon-bar"></span>
			</button>
			<a className="navbar-brand nav-top-text" href="#">云诊所</a>
		</div>
		<div id="navbar" className="collapse navbar-collapse">
			<ul className="nav navbar-nav navbar-right">

				<li><a href={href} className="nav-top-text" id='hospitalname'>未登录</a></li>
				<li><a href="#" className="nav-top-text" onClick={this.logout}>退出</a></li>
			</ul>
		</div>
      </div>
		);
	}
});
export default TopBox;