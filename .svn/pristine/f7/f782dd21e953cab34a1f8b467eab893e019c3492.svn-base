'use strict';
import React from 'react';
import {
	serviceurl,
	unique4
} from '../../lib/common.js';
import {
	func
} from './changeTips.js';

$(function() {
	$(".ln #name").changeTips({
		divTip: ".on_changes"
	});
})

//UserList
var UserList = React.createClass({
	handleCall: function() {
		var _params = {
			"keyword": $(".ln #name").val()
		};
		$.ajax({
			url: serviceurl + "patient/listHosPatient",
			type: 'get',
			data: _params,
			success: function(result) {
				let Arr = [];
				for (let i = 0; i < result.data.length; i++) {
					Arr.push(result.data[i].fullname);
				}
				Arr = unique4(Arr);
				$(".on_changes").empty();
				if (Arr.length == 0) {
					$(".on_changes").hide()
				} else {
					for (let i = 0; i < Arr.length; i++) {
						$(".on_changes").append("<li>" + Arr[i] + "</li>");
					}
				}
			}
		})
	},
	render: function() {
		return (
		<div className="userSearchList">
			<div className="ln">
			<input className="form-control" 
			type="text" maxLength="48" 
			name="name" id="name" onChange={this.handleCall} 
			style={{borderRadius: "5px"}} /></div>
			<ul className="on_changes" style={{borderRadius: "5px",borderColor:"#ccc",width:"100%"}}>
			</ul>
		</div>
		)
	}
})

export {
	UserList
};