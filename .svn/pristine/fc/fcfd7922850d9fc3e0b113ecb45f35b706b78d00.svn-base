'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
	serviceurl,
	leftBoxClick,
	request,
	isMockMobile
} from './lib/common.js';
import {
	toast
} from './lib/toast.js';
import Vld from 'validator';
import {
	testLogin
} from './ajax/user.js';
import LeftBox from './components/LeftBox.js';
import TopBox from './components/TopBox.js';
import {
    PagingSearch,
    PagingPN,
    LoadingBox
} from './components/Paging.js';
$(document).ready(function() {
	//判断登陆与否
	testLogin("reservation_center.html");
	leftBoxClick("collapseRes", 2, "res");
});
var dataList = [];
//获取挂号信息
var getSetData = function() {
	$.ajax({
		url: serviceurl + "hospital/queryBookingBaseInfo",
		type: "get",
		dataType: "json",
		contentType: "application/json",
		cache: false,
		async: false,
		success: function(dt) {
			//隐藏loading
			$("#loading").hide();
			console.table(dt);
            console.log(JSON.stringify(dt));
			if (dt.status == "success") {
				dataList = dt.data;
			} else {
				toast.show(dt.message);
				return;
			}
		},
		complete: function() {},
		error: function(XMLHttpRequest) {
			toast.show(XMLHttpRequest.responseJSON.message);
			return;
		}
	});
};

// var SelectList = React.createClass({
//     componentWillMount : function(){
//         var selectList = [];
//         var selectNum = 0
//         if( selectNum < 12){
//             selectList.push(selectNum);
//         }
//         return(
//             data: selectList
//         )
//     },
//     render: function() {
//         var sList = selectList.map(function(item){
//             return(
//                 <option value={item}>{item}+"123"</option>
//             );
//         })
//     }
// });

var List_Area = React.createClass({
    componentDidMount: function() {
        getSetData();
        var duration = dataList.duration;
        if(duration==900){
            //选中15分钟
            $("input[name=timeRadio]:eq(0)").attr("checked",'checked'); 
        }else if(duration==1800){
            //选中30分钟
            $("input[name=timeRadio]:eq(1)").attr("checked",'checked'); 
        }
        $("#morningNum").val(dataList.morningnum);
        $("#afternoonNum").val(dataList.afternoonnum);
        var starttime = dataList.starttime.split(":");
        $("#startHour").val(starttime[0]);
        $("#startMin").val(starttime[1]);

        var endtime = dataList.endtime.split(":");
        $("#endtHour").val(endtime[0]);
        $("#endMin").val(endtime[1]);

    },
    render: function() {
        return (
            <div className="panel panel-default no-border">
                <form className="form-horizontal" role="form">
                    <div className="form-group hide">
                        <label for="inputEmail3" className="col-sm-2 control-label">营业时间</label>
                        <div className="col-sm-10">
                            <div className="form-control-static">
                                从&nbsp;
                                <select id="startHour" className="form-control input-sm sub_set_selectBox">
                                    <option value="00">00</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                </select>
                                &nbsp;:&nbsp;
                                <select id="startMin" className="form-control input-sm sub_set_selectBox">
                                    <option value="00">00</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                    <option value="32">32</option>
                                    <option value="33">33</option>
                                    <option value="34">34</option>
                                    <option value="35">35</option>
                                    <option value="36">36</option>
                                    <option value="37">37</option>
                                    <option value="38">38</option>
                                    <option value="39">39</option>
                                    <option value="40">40</option>
                                    <option value="41">41</option>
                                    <option value="42">42</option>
                                    <option value="43">43</option>
                                    <option value="44">44</option>
                                    <option value="45">45</option>
                                    <option value="46">46</option>
                                    <option value="47">47</option>
                                    <option value="48">48</option>
                                    <option value="49">49</option>
                                    <option value="50">50</option>
                                    <option value="51">51</option>
                                    <option value="52">52</option>
                                    <option value="53">53</option>
                                    <option value="54">54</option>
                                    <option value="55">55</option>
                                    <option value="56">56</option>
                                    <option value="57">57</option>
                                    <option value="58">58</option>
                                    <option value="59">59</option>
                                </select>
                                &nbsp;到&nbsp;
                                <select id="endtHour" className="form-control input-sm sub_set_selectBox">
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                </select>
                                &nbsp;:&nbsp;
                                <select id="endMin" className="form-control input-sm sub_set_selectBox">
                                    <option value="00">00</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                    <option value="32">32</option>
                                    <option value="33">33</option>
                                    <option value="34">34</option>
                                    <option value="35">35</option>
                                    <option value="36">36</option>
                                    <option value="37">37</option>
                                    <option value="38">38</option>
                                    <option value="39">39</option>
                                    <option value="40">40</option>
                                    <option value="41">41</option>
                                    <option value="42">42</option>
                                    <option value="43">43</option>
                                    <option value="44">44</option>
                                    <option value="45">45</option>
                                    <option value="46">46</option>
                                    <option value="47">47</option>
                                    <option value="48">48</option>
                                    <option value="49">49</option>
                                    <option value="50">50</option>
                                    <option value="51">51</option>
                                    <option value="52">52</option>
                                    <option value="53">53</option>
                                    <option value="54">54</option>
                                    <option value="55">55</option>
                                    <option value="56">56</option>
                                    <option value="57">57</option>
                                    <option value="58">58</option>
                                    <option value="59">59</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="inputPassword3" className="col-sm-2 control-label">挂号最小单位</label>
                        <div className="col-sm-10">
                            <div className="form-control-static row">
                                <span className="col-sm-3"><input type="radio" name="timeRadio" value="900" defaultChecked="true"/>&nbsp;&nbsp;15分钟</span>
                                <span className="col-sm-3"><input type="radio" name="timeRadio" value="1800"/>&nbsp;&nbsp;30分钟</span>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="inputPassword3" className="col-sm-2 control-label">挂号量设置</label>
                        <div className="col-sm-10">
                            <div className="form-control-static">
                                上午&nbsp;
                                <select id="morningNum" className="form-control input-sm sub_set_selectBox">
                                    <option value="">请选择</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                                &nbsp;个号&nbsp;
                                &nbsp;下午&nbsp;
                                <select id="afternoonNum" className="form-control input-sm sub_set_selectBox">
                                    <option value="">请选择</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                                &nbsp;个号
                            </div>
                        </div>
                    </div>
                </form>                    
            </div>
        );
    }
});

var RevervationBox = React.createClass({
    saveClick:function(e){
        
        if(Vld.isNull($("#morningNum").val())){
            toast.show("请选择上午号码个数！");
            return;
        }
        if(Vld.isNull($("#afternoonNum").val())){
            toast.show("请选择下午号码个数！");
            return;
        }
        //计算选择的号码数是否大于实际可容纳的数量
        let morningNum = $("#morningNum").val();
        let afternoonNum = $("#afternoonNum").val();
        let mMaxNum = 0;
        let aMaxNum = 0;

        mMaxNum = Math.floor(((parseInt(11-parseInt($("#startHour").val()))*60 + parseInt(60-parseInt($("#startMin").val())))/parseInt($('input[name="timeRadio"]:checked').val()==900?15:30)));
        aMaxNum = Math.floor(((parseInt(parseInt($("#endtHour").val())-12)*60 + parseInt($("#endMin").val()))/parseInt($('input[name="timeRadio"]:checked').val()==900?15:30)));
        if(morningNum>mMaxNum){
            toast.show("当前条件上午最大号码个数为："+mMaxNum);
            return;
        }
        if(afternoonNum>aMaxNum){
            toast.show("当前条件下午最大号码个数为："+aMaxNum);
            return;
        }
        var _params={
            "duration" : $('input[name="timeRadio"]:checked').val(),
            "timestart" : $("#startHour").val()+":"+$("#startMin").val(),
            "timeend" : $("#endtHour").val()+":"+$("#endMin").val(),
            "morningnum" : $("#morningNum").val(),
            "afternoonnum" : $("#afternoonNum").val(),
        };
        $.ajax({    
            url : serviceurl+"hospital/updateBookingBaseInfo",   
            type : "post",         
            dataType : "json",                                     
            data : JSON.stringify(_params),
            contentType : "application/json",        
            cache : false,                                                       
            beforeSend:function(XMLHttpRequest){},                                         
            success : function(dt){
                console.log(JSON.stringify(dt));
                if(dt.status == "success"){
                    toast.show("信息修改成功！");
                }else{
                    toast.show("信息修改失败！");
                }
            },
            complete:function(XMLHttpRequest,textStatus){},  
            error:function(XMLHttpRequest,textStatus,errorThrown){
                toast.show(XMLHttpRequest.responseJSON.message);
                return;
            }
        });
    },
	render: function() {
		return (
            <div>
                <div className="bmargin1">
                    <div className="btn-group pull-right " role="group" aria-label="...">
                        <button type="button" className="btn btn-primary resbg-color no-border" id="editBtn" onClick={this.saveClick}>保存</button>
                    </div>
                    <div className="page-title">挂号设置</div>
                </div>
                <List_Area data={dataList}/>
            </div>
		);
	}
});

var Sub_set_box = React.createClass({
    render: function() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top" id="topMainBox">
                    <TopBox />
                </nav>
                <div className="container content-middle">
                    <div className="row">
                        <div className="col-sm-3" id="leftMainBox">
                            <LeftBox />
                        </div>
                        <div className="col-sm-9">
                            <RevervationBox data={dataList} />
                        </div>
                    </div>
                </div>
                <LoadingBox />
            </div>)
    }
})

ReactDOM.render(
    <Sub_set_box />,
    document.getElementById('sub_set_box')
);

export default React.createClass({
    render: function() {
        return (
            <Sub_set_box />)
    }
})