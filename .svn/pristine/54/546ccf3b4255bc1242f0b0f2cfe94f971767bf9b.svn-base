'use strict';
import React from 'react';
var SwitchBox = React.createClass({

	getInitialState: function() {
		$(".mask").css({
			"height": $(".laybox").height() + 30,
			"width": $(".laybox").width() + 30
		})
		return {
			data: []
		};
	},
	render: function() {
		return (
			<div>
				<div className="page-title width9p float-right" id="switchbox">
                    <div id="switchcont" className="close1">
                            <div id="switchbut" className="close2" onClick={this.handleClick}>
                            </div>
                    </div>
                </div>
                <div className="page-title width9p float-right">编辑
        		</div>
			</div>
		)
	},
	handleClick: function() {
		var div1 = document.getElementById("switchcont");
		var div2 = document.getElementById("switchbut");
		if (div1.className == "close1") {
			div1.className = "open1";
			$(".mask").hide();
		} else {
			div1.className = "close1";
			$(".mask").show();
		}
		if (div2.className == "close2") {
			div2.className = "open2";
			$(".mask").hide();
		} else {
			div2.className = "close2";
			$(".mask").show();
		}
	}
})
export {
	SwitchBox
};