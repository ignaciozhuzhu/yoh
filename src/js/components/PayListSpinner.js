'use strict';
import React from 'react';
import {
	getCookie,
	toDecimal,
	MoneyConversion,
	checknullto0,
	calculateInputNum
} from '../lib/common.js';
import {
	toast
} from '../lib/toast.js';

var PayListBox = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default" style={{borderBottom:'none'}}>
                <div className="panel-heading w-bg pay-head-border-bottom">
                    <span><i className="glyphicon glyphicon-user"></i></span>
                    <span className="rmargin" id="patientname"></span>
                    <span>联系电话：</span>
                    <span id="patientmobile"></span>
                    <span className="pull-right" id="doctorname"></span>
                    <span className="pull-right">挂号医生：</span>
                </div>
                <div className="container-fluid table-responsive" id="pay-2-list">
                    <ul className="list-group">
                    	<PayListSpinner changeDiscountCd={this.props.changeDiscount} />
                    </ul>
                </div>
            </div>
		)
	}
})

var sum = 0.00;
var PayListSpinner = React.createClass({
	//计算折扣相互之间交互实时的变动
	handleChange: function(ev) {
		let id = ev.selector.substring(ev.selector.indexOf("_"));
		let sumsmall = $("#sum" + id)[0].innerText;
		let sumzkl_id = "#sumzkl" + id;
		let sumzkj_id = "#sumzkj" + id;
		let sumzkx_id = "#sumzkx" + id;
		let thisvalue = parseFloat($(ev.selector).val());
		//输入折扣验证
		function testInput(id, tips, ty) {
			if (ty == 0) {
				thisvalue = ty;
			} else {
				thisvalue = sumsmall;
			}
			$(id)[0].value = thisvalue;
			toast.show(tips);
		}
		if (ev.selector.indexOf("zkl") > -1) {
			if (thisvalue > 100) {
				testInput(sumzkl_id, "折扣率不能大于100", 0);
			}
			if (thisvalue < 0) {
				testInput(sumzkl_id, "折扣率不能小于0", 0);
			}
			$(sumzkj_id).val((thisvalue * 0.01 * sumsmall).toFixed(2));
			$(sumzkx_id).val(((1 - thisvalue * 0.01) * sumsmall).toFixed(2));
		} else if (ev.selector.indexOf("zkj") > -1) {
			if (thisvalue > sumsmall) {
				testInput(sumzkj_id, "折扣金额不允许大于原价", 0);
			}
			if (thisvalue < 0) {
				testInput(sumzkj_id, "折扣金额不能小于0", 0);
			}
			$(sumzkl_id).val(((thisvalue / sumsmall) * 100).toFixed(0));
			$(sumzkx_id).val((sumsmall - thisvalue).toFixed(2));
		} else if (ev.selector.indexOf("zkx") > -1) {
			if (thisvalue > sumsmall) {
				testInput(sumzkx_id, "折后不允许大于原价");
			}
			if (thisvalue < 0) {
				testInput(sumzkx_id, "折后不允许小于0");
			}
			$(sumzkl_id).val(((sumsmall - thisvalue) / sumsmall * 100).toFixed(0));
			$(sumzkj_id).val((sumsmall - thisvalue).toFixed(2));
		}
		this.calculatezkx();
	},
	calculatezkx: function() {
		let sumdis = calculateInputNum("sumzkx_");
		$("#totalDisSum").html("¥ " + sumdis);
		this.props.changeDiscountCd();
	},
	render: function() {
		var o = this;
		var zkxSum = 0.00;
		var arrList = getCookie("serviceIDs").substr(1).split(",");
		var layList = arrList.map(function(item) {
			var id = item.split(" ")[0];
			var num = item.split(" ")[1];
			var title = item.split(" ")[2];
			var price = toDecimal(item.split(" ")[3]).toFixed(2);
			var unit = item.split(" ")[4];

			let disMoney = MoneyConversion((item.split(" ")[5] || 0), 2);
			zkxSum += toDecimal(parseInt(num) * (parseFloat(price))) - disMoney;
			let thisSum = toDecimal(parseInt(num) * (parseFloat(price))).toFixed(2);
			let defaultSum = (thisSum - disMoney).toFixed(2);
			let defaultl = ((disMoney / thisSum).toFixed(2) * 100).toFixed(0);
			if (thisSum == 0) defaultl = 0;
			$("#totalDisSum").html("¥ " + zkxSum.toFixed(2));
			$("#discountSum").html("¥ " + zkxSum.toFixed(2));

			sum = (parseFloat(sum) + parseFloat(thisSum)).toFixed(2);
			var plus_id = "plus_" + id;
			var input_id = "input_" + id;
			var minus_id = "minus_" + id;
			var sum_id = "sum_" + id;

			var sumzkl_id = "sumzkl_" + id;
			var sumzkj_id = "sumzkj_" + id;
			var sumzkx_id = "sumzkx_" + id;

			return (
				<li key={item} className="list-group-item row no-lborder text-center no-rborder padding03 padding5_8">        
					<span className="col-sm-2">{title}</span>                                   
					<span className="col-sm-1 width10P">{price}/{unit}</span>                          
					<span className="col-sm-3">                                                   
						<div className="input-group">                                             
						  <span className="input-group-btn">                                      
							<button className="btn btn-default" id={plus_id} type="button" onClick={o.PlusClick.bind(null,item)} >+</button>
						  </span>                                                               
						  <input type="number" className="form-control text-center nonefloat" id={input_id} value={num} readOnly/>
						  <span className="input-group-btn">                                      
							<button className="btn btn-default" id={minus_id} type="button" onClick={o.MinusClick.bind(null,item)} >-</button>
						  </span>                                                               
						</div>                                                                  
					</span>                                              
					<span className="col-sm-1 width10P" id={sum_id} >{thisSum}</span>
					<span className="col-sm-1 width10P paddingtop3"><input type="number" step="1" className="form-control show padding06 inline80p " id={sumzkl_id} onChange={o.handleChange.bind(o,$("#"+sumzkl_id))} defaultValue={defaultl} /></span>
					<span className="col-sm-1 width10P paddingtop3" ><input type="number" step="0.01" className="form-control show padding06 inline80p font12px" id={sumzkj_id}onChange={o.handleChange.bind(o,$("#"+sumzkj_id))} defaultValue={disMoney} /></span>
					<span className="col-sm-1 width10P paddingtop3" ><span></span><input type="number" step="0.01" className="form-control show padding06 inline80p font12px" id={sumzkx_id}onChange={o.handleChange.bind(o,$("#"+sumzkx_id))} defaultValue={defaultSum} /></span>
				</li>
			)

		});
		return (
			<div className="font12px">
				<li className="list-group-item row no-lborder text-center no-rborder fontWeight700 padding03 padding5_8">
					<span className="col-sm-2">收费明细</span>                
				    <span className="col-sm-1 width10P">单价</span>     
				    <span className="col-sm-3">数量</span>
				    <span className="col-sm-1 width10P">原价</span>     
				    <span className="col-sm-1 width10P">折扣率%</span>                
				    <span className="col-sm-1 width10P">折扣金额</span>               
				    <span className="col-sm-1 width10P">折后价</span>
				</li>
				{layList}
			</div>
		)
	},
	PlusClick: function(item) {
		var id = item.split(" ")[0];
		//var num = item.split(" ")[1];
		var price = item.split(" ")[3];
		//var thisSum = toDecimal(parseInt(num) * (parseFloat(price)));
		var input = $("#input_" + id)[0];

		input.value = parseInt(input.value) + 1;
		sum = toDecimal(parseFloat(sum) + parseFloat(price)).toFixed(2);
		$("#sum_" + id).html(toDecimal(parseFloat($("#sum_" + id)[0].textContent) + parseFloat(price)).toFixed(2));

		$("#sumzkx_" + id).val(toDecimal(parseFloat($("#sum_" + id)[0].textContent)).toFixed(2));
		$("#sumzkl_" + id).val(0);
		$("#sumzkj_" + id).val((0).toFixed(2));

		$("#totalSum").html("¥ " + sum);
		$("#totalDisSum").html("¥ " + sum);
		this.props.changeDiscountCd();
	},
	MinusClick: function(item) {
		var id = item.split(" ")[0];
		//var num = item.split(" ")[1];
		var price = item.split(" ")[3];
		//var thisSum = toDecimal(parseInt(num) * (parseFloat(price)));
		var input = $("#input_" + id)[0];

		if (parseInt(input.value) > 0) {
			input.value = parseInt(input.value) - 1;
			sum = toDecimal(parseFloat(sum) - parseFloat(price)).toFixed(2);
			$("#sum_" + id).html(toDecimal(parseFloat($("#sum_" + id)[0].textContent) - parseFloat(price)).toFixed(2));

			$("#sumzkx_" + id).val(toDecimal(parseFloat($("#sum_" + id)[0].textContent)).toFixed(2));
			$("#sumzkl_" + id).val(0);
			$("#sumzkj_" + id).val((0).toFixed(2));

			$("#totalSum").html("¥ " + sum);
			$("#totalDisSum").html("¥ " + sum);
			this.props.changeDiscountCd();
		}
	}
})
var InputPrivilegeDiv = React.createClass({
	getInitialState: function() {
		var that = this;
		$("#inputPrivilege").blur(function() {
			that.props.changeDiscount();
		});
		return {
			check0: true,
			check1: false,
			check2: false,
			check3: false
		};
	},
	changedis: function() {},
	nofav: function() {
		$("#inputPrivilege").attr({
			"class": "form-control hide"
		});
		this.props.changeDiscount(0);
	},
	cashfav: function() {
		$("#inputPrivilege").attr({
			"class": "form-control show",
			"placeholder": "请输入优惠金额(元)",
			"min": "0.01"
		});
		this.props.changeDiscount(0);
	},
	disfav: function() {
		$("#inputPrivilege").attr({
			"class": "form-control show",
			"placeholder": "请输入折扣率(0%~99.99%)",
			"min": "0",
			"max": "99.99"
		});
		this.props.changeDiscount(0);
	},
	nopay: function() {
		$("#inputPrivilege").attr({
			"class": "form-control hide"
		});
		let DisSum = $("#totalDisSum")[0].innerText.replace("¥", "").trim();
		$("#inputPrivilege").val(DisSum);
		this.props.changeDiscount(1);
	},
	render: function() {
		return (
			<div>
			<label className="radio-inline">
                <input type="radio" name="inlineRadioOptions" id="inlineRadio0" value="0" defaultChecked={this.state.check0} onClick={this.nofav} />没有优惠
            </label>
            <label className="radio-inline">
                <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1" defaultChecked={this.state.check1} onClick={this.cashfav} />金额优惠
            </label>
            <label className="radio-inline">
                <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2" defaultChecked={this.state.check2} onClick={this.disfav} />折扣优惠
            </label>
            <label className="radio-inline">
                <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="3" defaultChecked={this.state.check3} onClick={this.nopay} />免单
            </label>
        </div>
		)
	}
})

var OrderDetailList = React.createClass({
	render: function() {
		var style = {
			fontWeight: 600
		}
		return (
			<div>
				<li className="list-group-item row no-lborder text-center no-rborder">
	                <span className="col-sm-3" style={style} >收费明细</span>
	                <span className="col-sm-3" style={style} >单价</span>
	                <span className="col-sm-3" style={style} >数量</span>
	                <span className="col-sm-3" style={style} >总价</span>
	            </li>
				{
				this.props.arrLists.map(function(item) {
					try{
						var id = item.split(" ")[0];
						var num = item.split(" ")[1];
						var title = item.split(" ")[2];
						var price = item.split(" ")[3];
						var unit = item.split(" ")[4];
						var thisSum = parseInt(num) * price;
				 	}
					catch (e){
						id = item.id;
						num = item.amount;
						title = item.servicename;
						price = MoneyConversion(item.price);
						thisSum = parseInt(num) * price;
						unit = item.unit;
					}
					var style={
						"lineHeight": "34px"
					}
	            return (
		            <li style={style} key={id} className="list-group-item row no-lborder text-center no-rborder"> 
						<span className="col-sm-3"> {title} </span>                          
						<span className="col-sm-3"> {price}/{unit} </span>                          
						<span className="col-sm-3"> {num} </span>                           
						<span className="col-sm-3"> {thisSum} </span>                       
					</li>
				)})
	        	}
			</div>
		)
	}
})

var PayText = React.createClass({
	render: function() {
		return (
			<div>
			<i className='glyphicon glyphicon-ok-circle'>
			</i>
			{this.props.text}
			</div>
		)
	}
})
var UserInfoHeadBox = React.createClass({
	render: function() {
		return (
			<div className="panel-heading pay-head-border-bottom">
                <span><i className="glyphicon glyphicon-user"></i></span>
                <span className="rmargin" id="patientname"></span>
                <span>联系电话：</span>
                <span id="patientmobile"></span>
                <span className="pull-right" id="doctorname"></span>
                <span className="pull-right">挂号医生：</span>
            </div>
		)
	}
})
var ContainBox = React.createClass({
	render: function() {
		$("#containBox").css("border-bottom", "none");
		return (
			<div>
				<UserInfoHeadBox />
				<div className="container-fluid table-responsive" id="pay-2-list">
                    <ul className="list-group">
                    	<OrderDetailList arrLists={this.props.arrLists} />
                    </ul>
                </div>
            </div>
		)
	}
})

var CarListBox = React.createClass({
	render: function() {
		var layList = this.props.arrLists.map(function(item) {
			var id = item.id;
			var price = checknullto0(item.price).toFixed(2);
			var title = item.title;
			var unit = item.unit;
			var num = item.num;
			var disMoney = MoneyConversion(item.disMoney, 2);
			var price_id = "price_" + id;
			var title_id = "title_" + id;
			var unit_id = "unit_" + id;
			var plus_id = "plus_" + id;
			var input_id = "input_" + id;
			var minus_id = "minus_" + id;
			var disMoney_id = "disMoney_" + id;
			return (
				<div key={id}>
					<li className="list-group-item row ">	
					<input type="hidden" className="service_id" value={id} /*thistitle={title} price={price}*/ />	
					<input type="hidden" value={price} id={price_id} />	
					<span className="col-sm-4 col-xs-3 " id={title_id} style={{paddingTop:"4px"}}>{title}</span>	
					<span className="col-sm-5 col-xs-3 " id={unit_id} style={{paddingTop:"4px"}}>{price} /{unit}</span>	
					<span className="col-sm-3 col-xs-6 ">		
					<div className="input-group">		  
					<span className="input-group-btn">			
					<button className="btn btn-default" data-key={id} id={plus_id} type="button">+</button>		  
					</span>		  
					<input type="number" style={{minWidth:"30px",paddingLeft:0,paddingRight:0}} className="form-control text-center" id={input_id} value={num} readOnly/>		  
					<span className="input-group-btn">			
					<button className="btn btn-default" id={minus_id} type="button">-</button>		  
					</span>		
					</div>	
					</span>

					<span className="nonedisplay" id={disMoney_id} >{disMoney}</span>	
					</li>
            	</div>
			)
		})

		return (<div>{layList}</div>)
	}
})

export {
	PayListSpinner,
	sum,
	InputPrivilegeDiv,
	OrderDetailList,
	PayListBox,
	PayText,
	UserInfoHeadBox,
	ContainBox,
	CarListBox
};