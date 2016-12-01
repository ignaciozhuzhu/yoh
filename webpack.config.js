var webpack = require('webpack');
var path = require("path");

var commonsPlugin =
	new webpack.optimize.CommonsChunkPlugin('js/lib/share.js');

module.exports = {
	entry: {
		"js/login": "./src/js/login.js",
		"js/login_bd": "./src/js/login_bd.js",
		//	"js/scheduling": "./src/js/scheduling.js",
		"js/manage_clinic": "./src/js/manage_clinic.js",
		"js/reservation_center": "./src/js/reservation_center.js",

		/*"js/dd_doctor": "./src/js/dd_doctor.js",
		"js/dd_addjob": "./src/js/dd_addjob.js",
		"js/dd_job": "./src/js/dd_job.js",
		"js/dd_doctor_det": "./src/js/dd_doctor_det.js",

		"js/count_clinic": "./src/js/count_clinic.js",
		"js/count_doctor": "./src/js/count_doctor.js",
		"js/count_doctor_add": "./src/js/count_doctor_add.js",
		"js/count_doctor_det": "./src/js/count_doctor_det.js",
		"js/count_pay": "./src/js/count_pay.js",

		"js/manage_addtag": "./src/js/manage_addtag.js",
		"js/manage_doctor": "./src/js/manage_doctor.js",
		"js/manage_doctor_add": "./src/js/manage_doctor_add.js",
		"js/manage_doctor_det": "./src/js/manage_doctor_det.js",
		"js/manage_doctor_check": "./src/js/manage_doctor_check.js",

		"js/pay_center": "./src/js/pay_center.js",
		"js/pay_last": "./src/js/pay_last.js",
		"js/pay_order_list": "./src/js/pay_order_list.js",
		"js/pay_refund": "./src/js/pay_refund.js",
		"js/pay_second": "./src/js/pay_second.js",
		"js/pay_start": "./src/js/pay_start.js",

		"js/reservation_add": "./src/js/reservation_add.js",
		"js/reservation_detail": "./src/js/reservation_detail.js",
		"js/subscribe_center": "./src/js/subscribe_center.js",
		"js/subscribe_set": "./src/js/subscribe_set.js",*/

		"js/console": "./src/js/console.js",
		//	"js/console_back": "./src/js/console_back.js",

	},
	output: {
		//path: "./dist",
		path: path.join(__dirname, 'dist'),
		filename: "[name].js"
	},
	module: {
		//代码严格审查这步大概需要2-3秒
		/*preLoaders: [{
		    test: /\.js$/,
		    loader: "eslint-loader",
		    exclude: /node_modules/
		}],*/
		loaders: [{
				test: /\.css$/,
				loader: "style!css"
			}, {
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/, //写明路径,速度快一倍
				query: {
					presets: ['es2015', 'react']
						//presets: ["babel-fast-presets/es2015-stage1", "react"] //用这个可以快2-5秒
				}
			}

		]
	},
	resolve: {
		// you can now require('file') instead of require('file.coffee')
		extensions: ['', '.js', '.json']
	},
	plugins: [
		commonsPlugin
	],
	eslint: {
		//quiet: true //安静,无warning显示,默认为false,即会显示warning
	}
	/*  ,
	  node: {
	    fs: "empty"
	  }*/
};