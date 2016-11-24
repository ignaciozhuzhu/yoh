'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	leftBoxClick,
	re_str,
	request
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import {
	testLogin
} from './ajax/user.js';
import {
	getlistHosDoctor,
	docList
} from './ajax/listHosDoctor.js';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
$(document).ready(function() {
	//判断登陆与否
	testLogin("manage_doctor.html");
	leftBoxClick("collapseMan", 1, "manage");
});
//获取列表信息
var refleshData = function() {
	getlistHosDoctor();
};

var List_Area = React.createClass({
	render: function() {
		var nodes = this.props.data.map(function(comment) {
			return (
				<Comment 
	          	key={comment.doctorid}
	          	doctorid={comment.doctorid}
	          	avatar={serviceurl + comment.avatar}
	          	doctorname={comment.doctorname}
	          	title={comment.title}
	          >
	          </Comment>
			);
		});
		return (
			<div className="panel panel-default no-border">
          
                    <div className="list-group">
                        <div className="row">
                            {nodes}
                        </div>
                    </div>
         
            </div>
		);
	}
});

var Comment = React.createClass({
	goDetail: function() {
		//setCookie("doctorID", this.props.doctorid, 30);
		//setCookie("gobackURL", "manage_doctor.html", 30);
		window.open("manage_doctor_det.html" +
			re_str("hname", request("hname"), 0) +
			re_str("doctorID", this.props.doctorid, 1) +
			re_str("gobackURL", "manage_doctor.html", 1));
	},
	goDelete: function() {
		if (window.confirm('是否删除' + this.props.doctorname + '医生？')) {
			var _params = {
				"doctorid": this.props.doctorid
			};
			$.ajax({
				url: serviceurl + "doctor/clinicDelDoctor",
				type: "post",
				dataType: "json",
				data: JSON.stringify(_params),
				contentType: "application/json",
				cache: false,

				success: function(dt) {
					console.log(JSON.stringify(dt));
					if (dt.status == "success") {
						refleshData();
						location.href = "manage_doctor.html" +
							re_str("hname", request("hname"), 0) +
							re_str("gobackURL", "manage_doctor.html", 1);
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
			return;
		}

	},
	render: function() {
		return (
			<div className='col-sm-4 text-center'>
                <img src={this.props.avatar} className='img-circle pointer' width='50px' height='50px' onClick={this.goDetail}/>
                <p className='bmargin0 pointer' onClick={this.goDetail}>{this.props.doctorname}</p>
                <p className='bmargin0 pointer' onClick={this.goDetail}>{this.props.title}</p>
                <p onClick={this.goDelete} className='pointer yayi-text-color'>删除</p>
            </div>
		);
	}
});

var Top_Area = React.createClass({
	goAdd: function() {
		$.ajax({
			url: serviceurl + "hospital/currentInfo",
			type: "get",
			dataType: "json",
			data: {},
			contentType: "application/json",
			cache: false,
			async: false,

			success: function(dt) {
				console.log("info" + JSON.stringify(dt));
				if (dt.status == "success") {
					var userInfo = dt.data;
					if (userInfo.v == 1) {
						//setCookie("gobackURL", "manage_doctor.html", 30);
						window.open("manage_doctor_check.html" +
							re_str("hname", request("hname"), 0) +
							re_str("gobackURL", "manage_doctor.html", 1));
					} else {
						$("#addDocBtn").trigger("click");
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
	},
	render: function() {
		return (
			<div className="bmargin1">
                <div>
                    <div className="btn-group pull-right " role="group" aria-label="...">
                        <button type="button" className="btn btn-primary managebg-color border-ddd" onClick={this.goAdd}>新增医生</button>
                    	<button type="button" className="btn btn-primary managebg-color border-ddd hide" id="addDocBtn" data-toggle="modal" data-target="#addDoc">检测认证</button>     
                    </div>
                    <div className="page-title">医生管理</div>
                </div>
            </div>
		);
	}
});

var MainBox = React.createClass({
	getInitialState: function() {
		refleshData();
		return {
			data: docList
		};
	},
	componentDidMount: function() {
		this.setState({
			data: docList
		});
	},
	handleCommentSubmit: function(comment) {
		this.setState({
			data: comment
		});
	},
	render: function() {
		return (
			<div>
      	<Top_Area/>
        <List_Area onCommentSubmit={this.handleCommentSubmit} data={this.state.data} />
      </div>
		);
	}
});


ReactDOM.render(
	<MainBox  data={docList} />,
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