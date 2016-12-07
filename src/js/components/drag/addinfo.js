/**
 * Created by Administrator on 2016/9/12.
 */

$(function() {
    //添加省列表
    var province_append = function(provinces) {
        $("#province").empty();
        $("#province").append("<option value='000000'>请选择</option>");
        $("#city").empty();
        $("#city").append("<option value='000000'>请选择</option>");
        $("#county").empty();
        $("#county").append("<option value='000000'>请选择</option>");
        for (var i = 0, j = provinces.length; i < j; i++) {
            $("#province").append("<option value='" + provinces[i].id + "'>" + provinces[i].name + "</option>");
        }
    }

    //添加市列表
    var city_append = function(citys) {
        $("#city").empty();
        $("#city").append("<option value='000000'>请选择</option>");
        $("#county").empty();
        $("#county").append("<option value='000000'>请选择</option>");
        for (var i = 0, j = citys.length; i < j; i++) {
            $("#city").append("<option value='" + citys[i].id + "'>" + citys[i].name + "</option>");
        }
    }

    //添加县列表
    var county_append = function(countys) {
        $("#county").empty();
        $("#county").append("<option value='000000'>请选择</option>");
        for (var i = 0, j = countys.length; i < j; i++) {
            $("#county").append("<option value='" + countys[i].id + "'>" + countys[i].name + "</option>");
        }
    }

    //获得当前用户信息
    var initPage = $.ajax({
        url: base_url + "hospital/addHospital",
        dataType: 'json',
        contentType: "application/json",
        type: 'get',
        //data: JSON.stringify({mobile:mobile, password:password}),
        cache: false,
        async: false,
        beforeSend: function(XMLHttpRequest) {},
        success: function(data) {
            var userInfo = data.map;
            $("#username").html(userInfo.realname);
            $("#username1").html(userInfo.realname);
            province_append(data.data);
        }.bind(this),
        error: function() {}.bind(this)
    });

    //初始化市
    $("#province").on("change", function() {
        //alert(this.value);
        var initPage = $.ajax({
            url: base_url + "user/getCity?provinceCode=" + this.value,
            dataType: 'json',
            contentType: "application/json",
            type: 'get',
            //data: JSON.stringify({mobile:mobile, password:password}),
            cache: false,
            async: false,
            beforeSend: function(XMLHttpRequest) {},
            success: function(data) {
                city_append(data.data);
            }.bind(this),
            error: function() {}.bind(this)
        });
    });


    //初始化县
    $("#city").on("change", function() {
        //alert(this.value);
        var initPage = $.ajax({
            url: base_url + "user/getCounty?cityCode=" + this.value,
            dataType: 'json',
            contentType: "application/json",
            type: 'get',
            //data: JSON.stringify({mobile:mobile, password:password}),
            cache: false,
            async: false,
            beforeSend: function(XMLHttpRequest) {},
            success: function(data) {
                county_append(data.data);
            }.bind(this),
            error: function() {}.bind(this)
        });
    });

    //医院添加
    $("#addBtn").click(function() {
        $("#addBtn").attr("disabled", "disabled");
        var name = $("#hospitalName").val();
        if (name == null || name == "") {
            alert("医院名称不能为空！");
            $("#addBtn").attr("disabled", false);
            return false;
        }
        var grade_level = $("#grade_level").val().split("_");
        $("#grade").val(grade_level[0]);
        $("#level").val(grade_level[1]);

        var city = $("#city").val();
        var county = $("#county").val();
        if (city == null || city == "000000") {
            alert("请选择医院所属地区！")
            $("#addBtn").attr("disabled", false);
            return false;
        } else if (county == null || county == "000000") {
            $("#countycode").val(city);
        } else {
            $("#countycode").val(county);
        }

        var morning1 = $("#morning1").val();
        if (morning1 == null || morning1 == "0") {
            alert("上午上班时间不能为空！");
            $("#addBtn").attr("disabled", false);
            return false;
        }

        var morning2 = $("#morning2").val();
        if (morning2 == null || morning2 == "0") {
            alert("上午下班时间不能为空！");
            $("#addBtn").attr("disabled", false);
            return false;
        }

        var afternoon1 = $("#afternoon1").val();
        if (afternoon1 == null || afternoon1 == "0") {
            alert("下午上班时间不能为空！");
            $("#addBtn").attr("disabled", false);
            return false;
        }

        var afternoon2 = $("#afternoon2").val();
        if (afternoon2 == null || afternoon2 == "0") {
            alert("下午下班班时间不能为空！");
            $("#addBtn").attr("disabled", false);
            return false;
        }

        var evening1 = $("#evening1").val();
        if (evening1 == null || evening1 == "0") {
            evening1 = "22:00";
        }
        var evening2 = $("#evening2").val();
        if (evening2 == null || evening2 == "0") {
            evening2 = "23:00";
        }

        //"{"morning":{"start":"8:00","end":"12:00"},"afternoon":{"start":"13:00","end":"23:00"},"evening":{"start":"23:00","end":"23:59"}}";
        var worktime = '{"morning":{"start":"' + morning1 + '","end":"' + morning2 + '"},"afternoon":{"start":"' + afternoon1 + '","end":"' + afternoon2 + '"},"evening":{"start":"' + evening1 + '","end":"' + evening2 + '"}}';
        $("#worktime").val(worktime);

        var formdata = $('#formid').serialize();
        $.ajax({
            url: base_url + "hospital/addHospitalPost",
            type: 'post',
            data: formdata,
            success: function(dt) {
                console.log("addDoctor: " + JSON.stringify(dt));
                if (dt.status == "success") {
                    //添加成功
                    alert("添加成功");
                    window.location.href = "../../pages/hospital/hospitalCheck.html";
                } else {
                    alert("添加失败");
                    // $("#addDoctor").attr("disabled",false);
                    return;
                }
            }
        }).done(function(data) {}).error(function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.responseJSON.message);
            //$("#addDoctor").attr("disabled",false);
            return;
        });

        /*        var form = $("#formid");
                var options = {
                    url: base_url + "hospital/addHospitalPost",
                    type: 'post',
                    success: function(dt) {
                        console.log("addDoctor: " + JSON.stringify(dt));
                        if (dt.status == "success") {
                            //添加成功
                            alert("添加成功");
                            window.location.href = "../../pages/hospital/hospitalCheck.html";
                        } else {
                            alert("添加失败");
                            // $("#addDoctor").attr("disabled",false);
                            return;
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest.responseJSON.message);
                        //$("#addDoctor").attr("disabled",false);
                        return;
                    }
                };
                form.ajaxSubmit(options);*/
    });
});