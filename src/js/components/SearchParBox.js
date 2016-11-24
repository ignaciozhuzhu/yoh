'use strict';
import React from 'react';
var SearchParBox = React.createClass({
	render: function() {
		let color = "filter-item active " + this.props.module + "bg-color";
		return (
			<div className="list-group bottom20">
				<div className="list-group-item">
					<div className="filter">
						<div className="filter-label pull-left">日期</div>
						<div className="filter-item-wrap">
							<a href="#" className={color} name="condition_Date" rel="0" onClick={this.handleClick}>不限</a>
							<a href="#" className="filter-item" name="condition_Date" rel="-1" onClick={this.handleClick}>之前</a>
							<a href="#" className="filter-item" name="condition_Date" rel="1" onClick={this.handleClick}>今天</a>
							<a href="#" className="filter-item" name="condition_Date" rel="2" onClick={this.handleClick}>明天</a>
							<a href="#" className="filter-item" name="condition_Date" rel="3" onClick={this.handleClick}>本周剩余</a>
							<a href="#" className="filter-item" name="condition_Date" rel="4" onClick={this.handleClick}>本月剩余</a>
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">状态</div>
						<div className="filter-item-wrap">
							<a href="#" className={color} name="condition_Status" rel="00" onClick={this.handleClick}>不限</a>
							<a href="#" className="filter-item" name="condition_Status" rel="11" onClick={this.handleClick}>已支付</a>
							<a href="#" className="filter-item" name="condition_Status" rel="10" onClick={this.handleClick}>未支付</a>
							<a href="#" className="filter-item" name="condition_Status" rel="20" onClick={this.handleClick}>已退款</a>
						</div>
					</div>
					<div className="filter">
						<div className="filter-label pull-left">医生</div>
						<div className="filter-item-wrap" id="condition_Doctor" onClick={this.handleClick}>
							<a href="#" className={color} name="condition_doc" rel="" onClick={this.handleClick}>不限</a>
							 {this.props.docNodes}
						</div>
					</div>
				</div>
			</div>)
	},
	handleClick: function(e) {
		this.props.searchClick(e);
	}
})
export {
	SearchParBox
};