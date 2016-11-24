'use strict';
import React from 'react';
import {
	serviceurl,
	getTimeShort,
	getage
} from '../../lib/common.js';
import {
	toast
} from '../../lib/toast.js';

import {
	UserList
} from './UserList.js';
import DatePicker from 'react-datepicker';
import moment from 'moment';
moment.locale('zh-cn');
var cleanReg = function() {
	$("#name").val("");
	$("#mobile").val("");
	$("#birthday").val("1998-01-01");
	$("#age").text("18");
	try {
		$("#Docselect")[0].options[0].selected = true;
		$("#Dateselect").empty().append("<option value='0'>-医生排班时间-</option>");
		$("#Dateselect")[0].options[0].selected = true;
		$("#selectWorkTime")[0].options[0].selected = true;
		$("#age")[0].innerText = getage("1998");
		$("input[name='inputSex'][value=1]")[0].checked = true;
		$("input[name='inputTimes'][value=0]")[0].checked = true;
	} catch (e) {}
	$("#msg").val("");
	$("#remark").val("");
};
//新增预约弹框
var Tab_Right = React.createClass({
	componentDidMount: function() {
		if (this.props.getsbid) {
			this.serverRequest = $.get(serviceurl +
				"reservation/detail?id=" + this.props.getsbid,
				function(result) {
					this.setState({
						important: result.data.important == "1" ? true : false
					});
				}.bind(this));
		}
	},
	render: function() {
		var titletype = "";
		var o = this;
		if (this.props.getsbid == "") {
			cleanReg();
			$.ajax({
				url: serviceurl + "reservation/getBookingTime",
				type: "get",
				dataType: "json",
				contentType: "application/json",
				cache: false,
				//async: false,
				beforeSend: function(XMLHttpRequest) {},
				success: function(dt) {
					console.log(JSON.stringify(dt));
					if (dt.status == "success") {
						$("#sectionTime_").empty("");
						var options = "<option value=''>-医生排班时间段-</option>";
						$.each(dt.data, function(idx, item) {
							options += "<option value=" + item + ">" + item + "</option>";
						});
						$("#sectionTime_").append(options);
					} else {}

					titletype = "新增" + o.props.Title;
					$("#subtit").empty().append(titletype);
				},
				complete: function(XMLHttpRequest, textStatus) {},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		} else if (this.props.getsbid) {
			$.ajax({
				url: serviceurl + "reservation/detail",
				type: "get",
				dataType: "json",
				data: {
					id: o.props.getsbid
				},
				contentType: "application/json",
				cache: false,
				success: function(dt) {
					console.log(JSON.stringify(dt));
					$("#name").val(dt.data.patient_name)
					$("#mobile").val(dt.data.patient_mobile)
					$("#birthday").val(dt.data.birthday)
					$("#age")[0].innerText = getage(dt.data.birthday.substring(0, 4));
					$("input[name='inputSex'][value=" + dt.data.gender + "]")[0].checked = true;
					$("input[name='inputTimes'][value=" + dt.data.isfirst + "]")[0].checked = true;
					$("#Docselect").val(dt.data.doctorid)
					$("#Dateselect").empty().append("<option value='1'>" + dt.data.reserved_date + "</option>");
					//$("#Dateselect")[0].options[0].selected = true;
					$("#selectWorkTime").empty().append("<option value='1'>" + dt.data.reserved_timerange + "</option>");
					//$("#selectWorkTime")[0].options[0].selected = true;
					$("#msg").val(dt.data.items)
					$("#remark").val(dt.data.remark)
					titletype = "修改" + o.props.Title;
					$("#subtit").empty().append(titletype);
					$("#star-five")[0].className = dt.data.important == "1" ? "imp" : "notimp";
				},
				error: function(XMLHttpRequest) {
					toast.show(XMLHttpRequest.responseJSON.message);
					return;
				}
			});
		}
		return (
			<div>
				<div id="tabright" className="panel panel-default no-border subscribe_det">
					<div className="panel-heading sub_det_heading">
						<span className="sub_det_title" id="subtit">{this.props.Title}</span>
						<span className="sub_det_close" onClick={this.closeTab}>×</span>
						<span className="sub_det_bc" onClick={this.save} >保存</span>
					</div>
					
					<div className="panel-body">
						<Registration_Edit Medicalnum={this.props.Medicalnum} Title={this.props.Title} />
					</div>
	            </div>
            </div>
		);
	},
	closeTab: function() {
		$("#tabright").css({
			"right": "-100%"
		});
		$(".mask-div").hide();
		cleanReg();
		this.props.refleshTable();
	},
	save: function() {
		var o = this;
		if ($("#name").val() == "") {
			toast.show("请输入姓名")
			return
		}

		if ($("#workDate").val() == "") {
			toast.show("请医生排班时间")
			return
		}
		var workTime = $("#sectionTime_").val();

		if (this.props.Title == "挂号") {
			let _params = {
				worktimeid: $("#selectWorkTime").val(),
				mobile: $("#mobile").val(),
				name: $("#name").val(),
				isfirst: $("input[name='times']:checked").val(),
				msg: $("#msg").val(),
				important: $("#star-five")[0].className == "notimp" ? 0 : 1
			};
			$.ajax({
				url: serviceurl + "hospital/addBooking",
				type: "post",
				dataType: "json",
				data: JSON.stringify(_params),
				contentType: "application/json",
				cache: false,
				success: function(dt) {
					console.log(JSON.stringify(dt));
					if (dt.status == "success") {
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
		} else if (this.props.Title == "预约") {
			// let optd = $("#Dateselect")[0];
			// let opt = $("#selectWorkTime")[0];
			let _params = {
				patient_name: $("#name").val(),
				reserved_date: $("#workDate").val(),
				reserved_timerange: workTime,
				doctorid: $("#Docselect").val(),
				patient_mobile: $("#mobile").val(),
				remark: $("#remark").val(),
				items: $("#msg").val(),
				isfirst: $("input[name='inputTimes']:checked").val(),
				gender: $("input[name='inputSex']:checked").val(),
				age: $("#age")[0].innerText,
				birthday: $("#birthday").val(),
				important: $("#star-five")[0].className == "notimp" ? 0 : 1
			};
			let ajaxurl;
			let msg;
			if (this.props.getsbid) {
				ajaxurl = "reservation/edit";
				_params.id = this.props.getsbid;
				_params.confirm = this.props.getconfirm;
				_params.arrive = this.props.getarrive;
				msg = "预约修改成功"
			} else {
				ajaxurl = "reservation/add"
				msg = "预约成功"
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
						toast.show(msg);
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
var DocListSelect = React.createClass({
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
		this.props.getWorkDate(data.target.value);
		this.props.getWorknoon(""); //清空
		this.props.getWorkdateID("");
		//$("#Dateselect")[0].options[0].selected = true;
	},
	render: function() {
		if (this.state.arrDocList) {
			var layList = this.state.arrDocList.map(function(item) {
				return (
					<option key={item.doctorid} value={item.doctorid}>{item.doctorname}</option>
				)
			})
			return (
				<select id="Docselect" className="form-control" onChange={this.ChangeHandle}>
				  	<option value="">-请选择医生-</option>
				  	{layList}
				</select>
			)
		}
		return <div>正在加载...</div>;
	}
})

//日期选择列表
var DateListSelect = React.createClass({
	getInitialState: function() {
		return {
			arrDocWorktimeList: null
		}
	},
	ChangeHandle: function(data) {
		this.props.getWorknoon(data.target.value);
		let index = data.target.selectedIndex;
		this.props.getWorkdateID(data.target[index].title);
	},
	componentWillReceiveProps(nextProps) {
		var o = this;
		$.ajax({
			url: serviceurl + "doctor/listDocWorktime",
			type: "get",
			dataType: "json",
			data: {
				doctorid: nextProps.getdocid
			},
			contentType: "application/json",
			cache: false,
			//async: false,
			success: function(dt) {
				o.setState({
					arrDocWorktimeList: dt.data
				});
			},
			error: function(XMLHttpRequest) {
				toast.show(XMLHttpRequest.responseJSON.message);
				return;
			}
		});
	},
	render: function() {
		let arrD = this.state.arrDocWorktimeList;
		if (arrD !== null) {
			var List = arrD.map(function(item) {
				if (item.morning || item.afternoon) {
					var date = new Date(item.workdate);
					var Y = date.getFullYear() + '-';
					var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';
					date = Y + M + D;
					var noon = (item.morning ^ item.afternoon == true) ? (item.morning == true ? 1 : 0) : 2
					return (
						<option key={date} value={noon} title={item.workdayid} >{date}</option>
					)
				}
			})
		} else List = null;
		return (
			<select id="Dateselect" className="form-control" onChange={this.ChangeHandle} > 
			    <option value="">-医生排班时间-</option>
				   {List}
			</select>
		)
	}
})

//时间段选择列表
var NoonListSelect = React.createClass({
	getInitialState: function() {
		return {
			noonid: null,
			workdateid: null
		}
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({
			noonid: nextProps.getnoonid,
			workdateid: nextProps.getworkdateid
		});
		var arrD = nextProps.getnoonid;
		if (arrD === "0" || arrD === "1" || arrD === "2") {
			$.ajax({
				url: serviceurl + "workDay/queryTime",
				type: "get",
				dataType: "json",
				data: {
					workdayid: nextProps.getworkdateid,
					noon: nextProps.getnoonid
				},
				contentType: "application/json",
				cache: false,
				async: false,
				success: function(dt) {
					if (dt.status == "success") {
						$("#selectWorkTime").html("");
						var options = "<option>-医生排班时间段-</option>";
						$.each(dt.data, function(idx, item) {
							var stime = "";
							var etime = "";
							stime = getTimeShort((item.starttime) * 1000);
							stime.substring(stime.indexOf("午") + 1, stime.length - 3);
							etime = getTimeShort((item.starttime + item.timelong) * 1000);
							etime.substring(etime.indexOf("午") + 1, etime.length - 3);
							options += "<option value='" + item.id + "'>" + stime.substring(0, stime.length - 3) + "-" + etime.substring(0, stime.length - 3) + "</<option>";
						});
						$("#selectWorkTime").append(options);
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
		} else {
			$("#selectWorkTime").html("");
			var options = "<option value=''>-医生排班时间段-</option>";
			$("#selectWorkTime").append(options);
		}
	},
	render: function() {
		return (
			<select className="form-control" id="selectWorkTime">
                    <option value="">-医生排班时间段-</option>
                </select>
		)
	}
})

//新增挂号编辑框
var Registration_Edit = React.createClass({
	getInitialState: function() {
		return {
			doctorid: 0,
			noonid: "",
			workdateid: "",
			startDate: moment(),
			endDate: moment(),
			important: false
		}
	},
	changeDocID: function(item) {
		this.setState({
			doctorid: item
		});
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
		//var YearBorn = data.target.value.substring(0, 4);
		//var myDate = new Date();
		//var YearNow = myDate.getFullYear();
		$("#age")[0].innerText = getage(data.target.value.substring(0, 4));
	},
	showModalBox: function() {
		$(".mask-div").css({
			"height": $("html")[0].scrollHeight,
			"width": $("html")[0].scrollWidth,
			"z-index": 1060
		})
	},
	handleChange: function(dt) {
		this.setState({
			startDate: dt
		});
	},
	clickStar: function(dt) {
		this.setState({
			important: !this.state.important
		});
	},
	render: function() {
		var style = {
			display: this.props.Medicalnum
		}
		var stylestar;
		if (this.state.important == true) {
			$("#star-five").removeClass("notimp").addClass("imp")
		} else {
			$("#star-five").removeClass("imp").addClass("notimp")
		}
		return (
			<form className="form-horizontal" role="form">
			  	<div className="form-group">
			    	<label htmlFor="inputName" className="col-sm-2 control-label">姓名*</label>
		    		<div className="col-sm-10">
		      			<div className="input-group">
		      				<span className="input-group-btn">
				        		<button className="btn btn-default" type="button" onClick={this.clickStar}><span id="star-five" style={stylestar}></span></button>
				      		</span>
							<UserList />
					      	{/*<input type="text" className="form-control" id="name" />*/}
				      		<span className="input-group-btn">
				        		<button className="btn btn-default" type="button" data-toggle="modal" data-target=".modal-select" onClick={this.showModalBox}><img src="../../img/poppatient.png" className="reg_img" /></button>
				      		</span>
				    	</div>
		    		</div>
			  	</div>

		  		<div className="form-group">
			    	<label htmlFor="inputMobile" className="col-sm-2 control-label">手机</label>
		    		<div className="col-sm-10">
		      			<input type="tel" className="form-control" id="mobile" placeholder="" />
		    		</div>
			  	</div>

			  	<div className="form-group" style={style}>
			    	<label htmlFor="inputMedicalnum" className="col-sm-2 control-label">病历号码</label>
		    		<div className="col-sm-10">
		      			<input type="text" className="form-control" id="medicalnum" />
		    		</div>
			  	</div>

		  		<div className="form-group">
			    	<label htmlFor="inputBirthday" className="col-sm-2 control-label">出生日期</label>
		    		<div className="col-sm-7">
		      			<input type="date" className="form-control" id="birthday" onChange={this.setAge} defaultValue="1998-01-01" />
		    		</div>
		    		<div className="col-sm-3 form-control-static"><span><span id="age">18</span>岁</span></div>
			  	</div>

			  	<div className="form-group">
			  		<label htmlFor="inputSex" className="col-sm-2 control-label">性别</label>
				  	<div className="col-sm-10">
				  		<label className="radio-inline">
							<input type="radio" name="inputSex" id="male" value="1" defaultChecked="true"/> 男
						</label>
						<label className="radio-inline">
							<input type="radio" name="inputSex" id="female" value="-1" /> 女
						</label>
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputTimes" className="col-sm-2 control-label">{this.props.Title}类型</label>
				  	<div className="col-sm-10">
				  		<label className="radio-inline">
							<input type="radio" name="inputTimes" id="first" value="0" defaultChecked="true"/>初诊
						</label>
						<label className="radio-inline">
							<input type="radio" name="inputTimes" id="frequent" value="1" />复诊
						</label>
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDoctor" className="col-sm-2 control-label">主治医生</label>
				  	<div className="col-sm-10">
						<DocListSelect getWorkDate={this.changeDocID} getWorknoon={this.changeNoonID} getWorkdateID={this.changeWorkDateID}/>
	           		</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDate" className="col-sm-2 control-label">就诊时间*</label>
					<div className="col-sm-10" id="datelistselect">
						<DatePicker ref="endDate" id="workDate"
							selected={this.state.startDate}
							onChange={this.handleChange}
							className='form-control sub_date'
						/>
						<span className="lmargin">
							<select id="sectionTime_" className="form-control sub_dateInput"></select>
						</span>
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDoctor" className="col-sm-2 control-label">事项</label>
				  	<div className="col-sm-10">
						<textarea className="form-control" id="msg" rows="5"></textarea>	
					</div>
				</div>

				<div className="form-group">
			  		<label htmlFor="inputDoctor" className="col-sm-2 control-label">备注</label>
				  	<div className="col-sm-10">
						<textarea className="form-control" id="remark" rows="5"></textarea>	
					</div>
				</div>

			  	
			</form>


		);
	}
});

export {
	Tab_Right
};