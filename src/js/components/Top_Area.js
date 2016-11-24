'use strict';
import React from 'react';
import {
	re_str,
	request
} from '../lib/common.js';
//顶部边框控件
var Top_Area = React.createClass({
	getDefaultProps: function() {
		return {
			btnDisplay: "none",
			link: ""
		};
	},
	go: function() {
		if (this.props.link) {
			window.open(this.props.link + ".html" +
				re_str("hname", request("hname"), 0));
		} else if (this.props.sideFrame) {
			try {
				this.props.clearsbid("");
			} catch (e) {}
			$("#tabright").css({
				"right": "0"
			});
			$(".mask-div").css({
				"height": $("html")[0].scrollHeight,
				"width": $("html")[0].scrollWidth
			})
			$(".mask-div").show();
		}
	},
	render: function() {
		if (this.props.btnDisplay == "none") {
			var Display = {
				display: "none"
			}
		} else {
			Display = {
				display: "block"
			}
		}
		var className = "btn btn-primary no-border " + this.props.btnColor;
		return (
			<div className="bmargin1">
                <div>
                    <div style={Display} className="btn-group pull-right " role="group" aria-label="...">
                        <button type="button" className={className} onClick={this.go} id={this.props.btnId} >
                        	<i className="fa fa-plus" aria-hidden="true"></i> 
                        	{this.props.btnText}
                        </button>
                    </div>
                    <div className="page-title">{this.props.titleName}</div>
                </div>
            </div>
		);
	}
});
export default Top_Area;