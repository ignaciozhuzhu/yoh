'use strict';
import React from 'react';
import {
	serviceurl,
	getTimeShort,
	getMobilTime,
	getage
} from '../../lib/common.js';
import {
	toast
} from '../../lib/toast.js';
import {
	getArrive
} from '../../ajax/refleshSBData.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';
moment.locale('zh-cn');
//新增挂号弹框
var cleanReg = function() {
	$("#name_").val("");
	$("#mobile_").val("");
	$("#birthday_").val("1998-01-01");
	$("#age_").text("18");
	$("#medicalnum_").val("");
	try {
		$("#Dateselect_").empty().append("<option value='0'>-医生排班时间-</option>");
		$("#Docselect_")[0].options[0].selected = true;
		$("#Dateselect_").empty();
		$("#Dateselect_").append("<option value=''>-医生排班时间-</option>");
		$("#selectWorkTime_").empty();
		$("#selectWorkTime_").append("<option value=''>-医生排班时间段-</option>");
		$("#Dateselect_")[0].options[0].selected = true;
		$("#selectWorkTime_")[0].options[0].selected = true;
		$("#age_")[0].innerText = getage("1998");
		$("input[name='inputSex_'][value=1]")[0].checked = true;
		$("input[name='inputTimes_'][value=0]")[0].checked = true;
	} catch (e) {}
	$("#msg_").val("");
	$("#remark_").val("");
};
var sbID = "";
var important_
var Tab_Right_ = React.createClass({
	render: function() {
		var titletype = "";
		var o = this;
		sbID = this.props.getsbid_;
		if (sbID != "") {
			$.ajax({
				url: serviceurl + "reservation/detail",
				type: "get",
				dataType: "json",
				data: {
					id: sbID
				},
				contentType: "application/json",
				cache: false,
				success: function(dt) {
					console.log(JSON.stringify(dt));
					$("#name_").val(dt.data.patient_name);
					// $("#important_").val(dt.data.important);
					important_ = dt.data.important;
					$("#mobile_").val(dt.data.patient_mobile);
					$("#birthday_").val(dt.data.birthday);
					$("#age_")[0].innerText = getage(dt.data.birthday.substring(0, 4));
					$("input[name='inputSex_'][value=" + dt.data.gender + "]")[0].checked = true;
					$("input[name='inputTimes_'][value=" + dt.data.isfirst + "]")[0].checked = true;
					$("#msg_").val(dt.data.items);
					$("#remark_").val(dt.data.remark);
					//预约中如果有医生则选中
					let doctorid = dt.data.doctorid;
					if(doctorid!=""){
						//如果该医生无排班则不选中该医生
						$.ajax({
							url: serviceurl + "doctor/listDocWorktime",
							type: "get",
							dataType: "json",
							data: {
								doctorid: doctorid
							},
							contentType: "application/json",
							cache: false,
							async: true,
							success: function(dt1) {
								if (dt1.data.length < 1) {
									$("#Docselect_").val("");
								} else {
									$("#Docselect_").val(doctorid);
									$("#Dateselect_").empty();
									$("#Dateselect_").append("<option value=\"\">-医生排班时间-</option>");
									$.each(dt1.data, function(idx, item) {
										if (item.morning || item.afternoon) {
											var date = new Date(item.workdate);
											var Y = date.getFullYear() + '-';
											var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
											var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';
											date = Y + M + D;
											var noon = (item.morning ^ item.afternoon == true) ? (item.morning == true ? 1 : 0) : 2
											$("#Dateselect_").append("<option key=" + date + " value=" + noon + " title=" + item.workdayid + " >" + date + "</option>");
										}
									});
								}
							},
							error: function(XMLHttpRequest) {
								toast.show(XMLHttpRequest.responseJSON.message);
								return;
							}
						});
					}
				},
				error: function(XMLHttpRequest) {
					toast.show(XMLHttpRequest.responseJSON.message);
					return;
				}
			});
		}
		titletype = "新增" + o.props.Title;
		$("#subtit_").empty().append(titletype);
		return (
			<div>
				<div id="tabright_" className="panel panel-default no-border subscribe_det">
					<div className="panel-heading sub_det_heading">
						<span className="sub_det_title" id="subtit_">{this.props.Title}</span>
						<span className="sub_det_close" onClick={this.closeTab}>×</span>
						<span className="sub_det_bc"onClick={this.save} >保存</span>
					</div>
					
					<div className="panel-body">
						<Registration_Edit Medicalnum={this.props.Medicalnum} Title={this.props.Title} />
					</div>
	            </div>
            </div>
		);
	},
	closeTab: function() {
		$("#tabright_").css({
			"right": "-100%"
		});
		$(".mask-div").hide();
		cleanReg();
		this.props.refleshTable();
	},
	save: function() {
		var o = this;
		if ($("#name_").val() == "") {
			toast.show("请填写姓名")
			return
		}
		if ($("#mobile_").val() == "") {
			toast.show("请填写电话")
			return
		}
		if ($("#Docselect_").val() == "") {
			toast.show("请选择医生")
			return
		}
		if ($("#Dateselect_").val() == "") {
			toast.show("请选择医生排班时间")
			return
		}
		if ($("#selectWorkTime_").val() == "") {
			toast.show("请选择医生排班时间段")
			return
		}
		if (this.props.Title == "挂号") {
			let _params = {
				worktimeid: $("#selectWorkTime_").find("option:selected").attr("name"),
				mobile: $("#mobile_").val(),
				name: $("#name_").val(),
				isfirst: $("input[name='inputTimes_']:checked").val(),
				msg: $("#msg_").val(),
				items: $("#items_").val(),
				gender: $("input[name='inputSex_']:checked").val(),
				birthday: $("#birthday_").val(),
				sectiontime: $("#selectWorkTime_").find("option:selected").text(),
				important: important_
			};
			$.ajax({
				url: serviceurl + "hospital/submitBooking",
				type: "post",
				dataType: "json",
				data: JSON.stringify(_params),
				contentType: "application/json",
				cache: false,
				success: function(dt) {
					console.log(JSON.stringify(dt));
					if (dt.status == "success") {
						getArrive(sbID, 1);
						toast.show("挂号成功,查看请前往“挂号列表”");
						o.closeTab();
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
	}
});

//医生选择列表
var DocListSelect_ = React.createClass({
	getInitialState: function() {
		return {
			arrDocList: null
		}
	},
	componentDidMount: function() {
		this.serverRequest = $.get(serviceurl + "hospital/listHosDoctor").done(function(data) {
			this.setState({
				arrDocList: data.data
			});
		}.bind(this));
	},
	ChangeHandle: function(data) {
		$.ajax({
			url: serviceurl + "doctor/listDocWorktime",
			type: "get",
			dataType: "json",
			data: {
				doctorid: data.target.value
			},
			contentType: "application/json",
			cache: false,
			//async: false,
			success: function(dt2) {
				$("#Dateselect_").empty();
				$("#Dateselect_").append("<option value=\"\">-医生排班时间-</option>");
				$("#selectWorkTime_").empty();
				$("#selectWorkTime_").append("<option value=\"\">-医生排班时间段-</option>");
				$.each(dt2.data, function(idx, item) {
					if (item.morning || item.afternoon) {
						var date = new Date(item.workdate);
						var Y = date.getFullYear() + '-';
						var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
						var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';
						date = Y + M + D;

						var noon = (item.morning ^ item.afternoon == true) ? (item.morning == true ? 1 : 0) : 2
						$("#Dateselect_").append("<option key=" + date + " value=" + noon + " title=" + item.workdayid + " >" + date + "</option>");
						$("#Dateselect_")[0].options[0].selected = true;
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
		if (this.state.arrDocList) {
			var layList = this.state.arrDocList.map(function(item) {
				return (
					<option key={item.doctorid} value={item.doctorid}>{item.doctorname}</option>
				)
			})
			return (
				<select id="Docselect_" className="form-control" onChange={this.ChangeHandle}>
				  	<option value="">-请选择医生-</option>
				  	{layList}
				</select>
			)
		}
		return <div>正在加载...</div>;
	}
})


//新增挂号编辑框
var Registration_Edit = React.createClass({
	getInitialState: function() {
		return {
			doctorid: 0,
			noonid: "",
			workdateid: ""
		}
	},
	changeDocID: function(item) {
		this.setState({
			doctorid: item
		});
		console.log(item);
	},
	changeNoonID: function(item) {
		this.setState({
			noonid: item
		});
	},
	changeWorkDateID: function(item) {
		this.setState({
			workdateid: item
		});
	},
	setAge: function(data) {
		var YearBorn = data.target.value.substring(0, 4);
		var myDate = new Date();
		var YearNow = myDate.getFullYear();
		$("#age_")[0].innerText = YearNow - YearBorn;
	},
	showModalBox: function() {
		$("#modalbox_").show();
		$(".mask-div").css({
			"height": $("html")[0].scrollHeight,
			"width": $("html")[0].scrollWidth,
			"z-index": 1060
		})
		$(".mask-div").show();
	},
	handleChangeBirthday: function(date) {
		this.setState({
			birthDate: date
		});
		$("#age_")[0].innerText = getage(date.format().substring(0,4));
	},
	ChangeHandle: function(data) {
		// this.props.getWorknoon(data.target.value);
		let index = data.target.selectedIndex;
		// this.props.getWorkdateID(data.target[index].title);
		$.ajax({
				url: serviceurl + "workDay/bookingQueryTime",
				// url: serviceurl + "workDay/queryTime",
				type: "get",
				dataType: "json",
				data: {
					workdayid: data.target[index].title,
					// noon: data.target[index].title
					noon: 2    //2代表全天
				},
				contentType: "application/json",
				cache: false,
				async: false,
				success: function(dt) {
					console.log(JSON.stringify(dt)+"选择时间段"+data.target[index].title);
					if (dt.status == "success") {
						$("#selectWorkTime_").html("");
						var options = "<option value=''>-医生排班时间段-</option>";
						$.each(dt.data, function(idx, item) {
							// options += "<option value='" + item.id + "'>" + getMobilTime(item.starttime*1000).substr(12,5) +"~"+ getMobilTime((item.starttime + item.timelong)*1000).substr(12,5) + "</option>";
							options += "<option value=" + item.worktimeid + " name="+item.worktimeid+">" + item.timeSection + "</option>";
						});
						$("#selectWorkTime_").append(options);
						// $("#selectWorkTime_").attr("name", dt.map.worktimeid);
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
	render: function() {
		var style = {
			display: this.props.Medicalnum
		}
		return (
			<form className="form-horizontal" role="form">
			  	<div className="form-group">
			    	<label htmlFor="inputName" className="col-sm-2 control-label">姓名*</label>
		    		<div className="col-sm-10">
		      			<input type="text" className="form-control" id="name_" placeholder="" readOnly="true"/>
						<input type="hidden" id="important_" value=""/>
		    		</div>
			  	</div>

		  		<div className="form-group">
			    	<label htmlFor="inputMobile" className="col-sm-2 control-label">手机*</label>
		    		<div className="col-sm-10">
		      			<input type="tel" className="form-control" id="mobile_" placeholder="" />
		    		</div>
			  	</div>

			  	<div className="form-group" style={style}>
			    	<label htmlFor="inputMedicalnum" className="col-sm-2 control-label">病历号码</label>
		    		<div className="col-sm-10">
		      			<input type="text" className="form-control" id="medicalnum_" />
		    		</div>
			  	</div>

			  	<div className="form-group">
			    	<label htmlFor="inputBirthday" className="col-sm-2 control-label">出生日期</label>
		    		<div className="col-sm-7">
						<DatePicker ref="birthday_" id="birthday_"
							selected={this.state.birthDate}
							onChange={this.handleChangeBirthday}
							className='form-control sub_date'
						/>
		    		</div>
		    		<div className="col-sm-3 form-control-static"><span><span id="age_">18</span>岁</span></div>
			  	</div>

			  	<div className="form-group">
			  		<label htmlFor="inputSex" className="col-sm-2 control-label">性别</label>
				  	<div className="col-sm-10">
				  		<label className="radio-inline">
							<input type="radio" name="inputSex_" id="male_" defaultChecked="true" value="1" /> 男
						</label>
						<label className="radio-inline">
							<input type="radio" name="inputSex_" id="female_" value="-1" /> 女
						</label>
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputTimes" className="col-sm-2 control-label">{this.props.Title}类型*</label>
				  	<div className="col-sm-10">
				  		<label className="radio-inline">
							<input type="radio" name="inputTimes_" id="first_" defaultChecked="true" value="0" />初诊
						</label>
						<label className="radio-inline">
							<input type="radio" name="inputTimes_" id="frequent_" value="1" />复诊
						</label>
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDoctor" className="col-sm-2 control-label">主治医生*</label>
				  	<div className="col-sm-10">
						<DocListSelect_ getWorkDate={this.changeDocID} getWorknoon={this.changeNoonID} getWorkdateID={this.changeWorkDateID}/>
						
	           		</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDate" className="col-sm-2 control-label">就诊时间</label>
					<div className="col-sm-5" id="datelistselect">
						<select id="Dateselect_" className="form-control" onChange={this.ChangeHandle} > 
							<option value="">-医生排班时间-</option>
						</select>
					</div>
					<div className="col-sm-5">
						<select className="form-control" id="selectWorkTime_">
							<option value="">-医生排班时间段-</option>
						</select>
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDoctor" className="col-sm-2 control-label">事项</label>
				  	<div className="col-sm-10">
						<textarea className="form-control" id="msg_" rows="5"></textarea>	
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDoctor" className="col-sm-2 control-label">备注</label>
				  	<div className="col-sm-10">
						<textarea className="form-control" id="remark_" rows="5"></textarea>	
					</div>
				</div>

			  	
			</form>


		);
	}
});

export {
	Tab_Right_
};