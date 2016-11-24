'use strict';
import React from 'react';
var PagingSearch = React.createClass({
	render: function() {
		return (
			<div className="panel-heading count-head-border">
				<div className="row">
					<div className="col-sm-8">
						<div className="color-black line-height-30">共有<span id="listSum">{this.props.sumtotal}</span>条记录</div>
					</div>
					<div className="col-sm-4">
						<div className="input-group input-group-sm">
							<input type="text" className="form-control" ref="searchText" id="searchText" placeholder="姓名/电话" />
							<span className="input-group-btn">
								<button className="btn btn-default" type="button" onClick={this.handleClick}>搜索</button>
							</span>
						</div>
					</div>
				</div>
			</div>
		)
	},
	handleClick: function() {
		this.props.searchClick();
	}
})
var PagingPN = React.createClass({
	getInitialState: function() {
		return {
			prestyle: null,
			nextstyle: null
		};
	},
	componentDidMount: function() {
		this.display();
	},
	componentDidUpdate: function() {
		this.display();
	},
	display: function() {
		if (this.props.page != null && this.props.count != null) {
			if (this.props.page == 1) {
				this.refs.pre.className = "previous hide";
			} else {
				this.refs.pre.className = "previous";
			}
			if (this.props.count == 10 && this.props.totalPage !== this.props.page) {
				this.refs.next.className = "next";
			} else {
				this.refs.next.className = "next hide";
			}
		}
	},
	render: function() {
		return (
			<ul className="pager">
				<li className="previous" id="previousPage" ref="pre" ><a href="#" onClick={this.handlePClick}>上一页</a></li>
				<li className="next" id="nextPage" ref="next" ><a href="#" onClick={this.handleNClick}>下一页</a></li>
			</ul>
		)
	},
	handlePClick: function() {
		this.props.prevClick();
	},
	handleNClick: function() {
		this.props.nextClick();
	}
})
var LoadingBox = React.createClass({
	render: function() {
		return (
			<div><div className="container" id="loading">
        <div className="loading_box">
            <div className="spinner">
              <div className="spinner-container container1">
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
              </div>
              <div className="spinner-container container2">
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
              </div>
              <div className="spinner-container container3">
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
              </div>
            </div>
        </div>
    </div></div>)
	}
})
export {
	PagingSearch,
	PagingPN,
	LoadingBox
};