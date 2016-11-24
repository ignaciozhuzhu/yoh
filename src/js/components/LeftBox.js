'use strict';
import React from 'react';
import {
	serviceurl,
	request,
	re_str
} from '../lib/common.js';
import {
	Link
} from 'react-router'
var menuList = [];
//左侧边框控件
var LeftBox = React.createClass({
	left_nav_head: function() {
		//$(".collapse").slideUp();
	},
	gosubscribe_center: function() {
		location.href = "subscribe_center.html" + re_str("hname", request("hname"), 0);
	},
	gosubscribe_set: function() {
		location.href = "subscribe_set.html" + re_str("hname", request("hname"), 0);
	},
	goReservation_center: function() {
		location.href = "reservation_center.html" + re_str("hname", request("hname"), 0);
	},
	goReservation_add: function() {
		location.href = "reservation_add.html" + re_str("hname", request("hname"), 0);
	},
	goPay_center: function() {
		location.href = "pay_center.html" + re_str("hname", request("hname"), 0);
	},
	goPay_list: function() {
		location.href = "pay_order_list.html" + re_str("hname", request("hname"), 0);
	},
	goScheduling: function() {
		location.href = "scheduling.html" + re_str("hname", request("hname"), 0);
	},
	goCount_clinic: function() {
		location.href = "count_clinic.html" + re_str("hname", request("hname"), 0);
	},
	goCount_doctor: function() {
		location.href = "count_doctor.html" + re_str("hname", request("hname"), 0);
	},
	goCount_pay: function() {
		location.href = "count_pay.html" + re_str("hname", request("hname"), 0);
	},
	goManage_clinic: function() {
		location.href = "manage_clinic.html" + re_str("hname", request("hname"), 0);
	},
	goManage_doctor: function() {
		location.href = "manage_doctor.html" + re_str("hname", request("hname"), 0);
	},
	goManage_doctor_add: function() {
		location.href = "manage_addtag.html" + re_str("hname", request("hname"), 0);
	},
	goDD_doctor: function() {
		location.href = "dd_doctor.html" + re_str("hname", request("hname"), 0);
	},
	goDD_job: function() {
		location.href = "dd_job.html" + re_str("hname", request("hname"), 0);
	},
	getInitialState: function() {
		return {
			data: []
		};
	},
	componentDidMount: function() {
		$.ajax({
			url: serviceurl + "site/getMenu",
			type: "get",
			dataType: "json",
			contentType: "application/json",
			cache: false,
			//async: false,
			beforeSend: function() {},
			success: function(dt) {
				//console.log("获取菜单栏：" + JSON.stringify(dt));
				if (dt.status == "success") {
					menuList = dt.data;
				} else {
					toast.show(dt.message);
					return;
				}

				$.each(menuList, function(index, item) {
					// console.log(index + " : " + item.remark);
					if (item.state == 1) {
						// $("#"+item.name+"_menu").css('display', 'none');
						$("#" + item.name + "_menu").removeClass("left-display-none");
						$("#" + item.name + "_menu").addClass("left-nav-padding");
					}
				});
			},
			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				return;
			}
		});

	},
	render: function() {
		return (
			<div id="leftBoxDIV">
				<div className="panel panel-default left-nav-textcolor">
					<div className="panel-body left-nav pointer" data-toggle="collapse" href="#subscribe" aria-expanded="false" aria-controls="subscribe">
						<div className="left-line resbg-color pull-left"></div>
						<div><b className="panel-title">预约中心</b></div>
					</div>
					<div className="list-group collapse in" id="subscribe">
						<a href="#" className="list-group-item left-display-none" onClick={this.gosubscribe_center} id="subscribe_center_menu">
							<span className="img-middle"></span>
							<img src="../img/1.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">预约中心</span>
						</a>
					</div>
				</div>

				<div className="panel panel-default left-nav-textcolor">
					<div className="panel-body left-nav pointer" data-toggle="collapse" href="#collapseRes" aria-expanded="false" aria-controls="collapseRes">
						<div className="left-line resbg-color pull-left"></div>
						<div><b className="panel-title">挂号中心</b></div>
					</div>
					<div className="list-group collapse in" id="collapseRes">
						<a href="#" className="list-group-item left-display-none" onClick={this.goReservation_center} id="reservation_center_menu">
							<span className="img-middle"></span>
							<img src="../img/1.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">挂号中心<span id="ResNum" className="badge badgezs"></span></span>
						</a>
						<a href="#" className="list-group-item left-display-none" onClick={this.goReservation_add} id="reservation_add_menu">
							<span className="img-middle"></span>
							<img src="../img/2.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">新增挂号</span>
						</a>
						<a href="#" className="list-group-item left-display-none" onClick={this.gosubscribe_set} id="subscribe_set_menu">
							<span className="img-middle"></span>
							<img src="../img/13.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">挂号设置</span>
						</a>
					</div>
				</div>
				
				<div className="panel panel-default">
					<div className="panel-body left-nav pointer" data-toggle="collapse" href="#collapsePay" aria-expanded="false" aria-controls="collapsePay">
						<div className="left-line paybg-color pull-left"></div>
						<div><b className="panel-title">诊间收费</b></div>
					</div>
					<div className="list-group collapse" id="collapsePay" >
						<a href="#" className="list-group-item left-display-none" onClick={this.goPay_center} id="pay_center_menu">
							<span className="img-middle"></span>
							<img src="../img/3.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">收费列表</span>
						</a>
						<a href="#" className="list-group-item left-display-none" onClick={this.goPay_list} id="pay_order_list_menu">
							<span className="img-middle"></span>
							<img src="../img/4.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">订单列表</span>
						</a>
					</div>
				</div>

				<div className="panel panel-default">
					<div className="panel-body left-nav pointer" data-toggle="collapse" href="#collapseSch" aria-expanded="false" aria-controls="collapseSch">
						<div className="left-line schbg-color pull-left"></div>
						<div><b className="panel-title">排班管理</b></div>
					</div>
					<div className="list-group collapse" id="collapseSch">
						<a href="#" className="list-group-item left-display-none" onClick={this.goScheduling} id="scheduling_menu">
							<span className="img-middle"></span>
							<img src="../img/5.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">排班列表</span>
						</a>
					</div>
				</div>

				<div className="panel panel-default">
					<div className="panel-body left-nav pointer" data-toggle="collapse" href="#collapseCount" aria-expanded="false" aria-controls="collapseCount">
						<div className="left-line countbg-color pull-left"></div>
						<div><b className="panel-title">数据统计</b></div>
					</div>
					<div className="list-group collapse" id="collapseCount">
						<a href="#" className="list-group-item left-display-none" onClick={this.goCount_clinic} id="count_clinic_menu">
							<span className="img-middle"></span>
							<img src="../img/6.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">诊间统计</span>					
						</a>
						<a href="#" className="list-group-item left-display-none" onClick={this.goCount_doctor} id="count_doctor_menu">
							<span className="img-middle"></span>
							<img src="../img/7.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">医生统计</span>					
						</a>
						<a href="#" className="list-group-item left-display-none" onClick={this.goCount_pay} id="count_pay_menu">
							<span className="img-middle"></span>
							<img src="../img/8.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">收费统计</span>
						</a>
					</div>
				</div>

				<div className="panel panel-default">
					<div className="panel-body left-nav pointer" data-toggle="collapse" href="#collapseMan" aria-expanded="false" aria-controls="collapseMan">
						<div className="left-line managebg-color pull-left"></div>
						<div><b className="panel-title">诊所管理</b></div>
					</div>
					<div className="list-group collapse" id="collapseMan">
						<a href="#" className="list-group-item left-display-none" onClick={this.goManage_clinic} id="manage_clinic_menu">
							<span className="img-middle"></span>
							<img src="../img/9.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">诊所管理</span>
						</a>
						<a href="#" className="list-group-item left-display-none" onClick={this.goManage_doctor} id="manage_doctor_menu">
							<span className="img-middle"></span>
							<img src="../img/10.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">员工管理</span>
						</a>
						<a href="#" className="list-group-item left-display-none" onClick={this.goManage_doctor_add} id="manage_addtag_menu">
							<span className="img-middle"></span>
							<img src="../img/11.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">收费项目</span>
						</a>
					</div>
				</div>

				<div className="panel panel-default">
					<div className="panel-body left-nav pointer" data-toggle="collapse" href="#collapseDD" aria-expanded="false" aria-controls="collapseDD" onClick={this.left_nav_head}>
						<div className="left-line ddbg-color pull-left"></div>
						<div><b className="panel-title">点点医生</b></div>
					</div>
					<div className="list-group collapse" id="collapseDD">
						<a href="#" className="list-group-item left-display-none" onClick={this.goDD_doctor} id="dd_doctor_menu">
							<span className="img-middle"></span>
							<img src="../img/12.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">职位列表</span>
						</a>
						
						<a href="#" className="list-group-item left-display-none" onClick={this.goDD_job} id="dd_job_menu">
							<span className="img-middle"></span>
							<img src="../img/12.png" className="rmargin1 img left-nav-img" />
							<span className="img-text">投递列表</span>
							{/*<Link to="/dd">投递列表</Link> */}
						</a>
					</div>
				</div>

				<div className="">
					<p className="text-muted">&copy; 2016 医谷科技 </p>
				</div>
		</div>
		);
	}
});
export default LeftBox;