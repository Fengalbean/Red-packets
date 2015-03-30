/**
 * Created by Administrator on 2015/3/27.
 */
$(function(){
    function getUrlParam(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

        var r = window.location.search.substr(1).match(reg);

        if(r!=null)return  unescape(r[2]); return null;
    }//获取URL参数
    var Datepattern = function(d, fmt) {
        var o = {
            "M+": d.getMonth() + 1, //月份
            "d+": d.getDate(), //日
            "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12, //小时
            "H+": d.getHours(), //小时
            "m+": d.getMinutes(), //分
            "s+": d.getSeconds(), //秒
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度
            "S": d.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[d.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };//日期格式化参数
    var id = getUrlParam('roorId');
    var floor = getUrlParam('floor');
    var param;

    var bath = "http://120.24.208.201/hadlink/hadlink91_product/";
    var url = "index.php?c=coupon&m=getRedEnvelopeCoupon";
    function hadAlert(msg,element){
        $('#'+element).find('.am-modal-msg').text(msg);
        $('#'+element).modal({
            relatedTarget: this
        });
    };
    if(id && floor){
        param = {
            id:55,
            floor:'0-55-69'
        }
    }
    param = {
        id:55,
        floor:'0-55-69'
    };
    var ajaxSend = function(){
        $.ajax({
            type: "get",
            url: bath + url,
            data: param,
            success: function (data) {
                var flag = false;
                if (data) {
                    var jsonData = JSON.parse(data);
                    if(jsonData.code !== 0 ){
                        hadAlert('网络原因，请求数据失败，请刷新页面或者检查网络！',"my-alert");
                        flag = true;
                    }
                    if(flag) return;
                    console.log(jsonData);
                    if (jsonData.data) {
                        var param = jsonData.data;
                        dealData(param);
                    }
                }
            },
            error: function () {
                hadAlert('网络原因，请重试！', 'my-alert');
            }
        });
    };
    var dealData = function(data){//渲染数据
        var red0 = '<img  src="images/0.png">';
        var red1 = '<img  src="images/1.png">';
        var red2 = '<img src="images/2.png">';
        var red3 = '<img  src="images/3.png">';
        var red4 = '<img  src="images/4.png">';
        var red5 = '<img  src="images/5.png">';
        var red6 = '<img src="images/6.png">';
        var red7 = '<img  src="images/7.png">';
        var red8 = '<img  src="images/8.png">';
        var red9 = '<img  src="images/9.png">';
        var red10 = '<img src="images/10.png">';
        var redEnvelopes = $('#redEnvelopes');
        var num;
        if(data.free){
            if(data.free[0]){
                num = data.free[0].sum;
                $('#activeCash').text(num);//统计领取代金券的人数
            }else{
                $('#activeCash').text(0);//统计领取代金券的人数
            }
        }
        switch (num){
            case 1 :
                redEnvelopes.append(red1);
                break;
            case 2 :
                redEnvelopes.append(red2);
                break;
            case 3 :
                redEnvelopes.append(red3);
                break;
            case 4 :
                redEnvelopes.append(red4);
                break;
            case 5 :
                redEnvelopes.append(red5);
                break;
            case 6 :
                redEnvelopes.append(red6);
                break;
            case 7 :
                redEnvelopes.append(red7);
                break;
            case 8 :
                redEnvelopes.append(red8);
                break;
            case 9 :
                redEnvelopes.append(red9);
                break;
            default :
                redEnvelopes.append(red0);
        }
        var html = ' <li style="background-color: #FFFFFF">\
            <div class="list-container">\
            <div class="header-img">\
                <img src="images/header.png" alt="" class="am-circle">\
                </div>\
                <div class="text-container">\
                    <div class="text-top" id="name-date">\
                    {%createTime%}\
                    </div>\
                    <div class="text-bottom" id="cash">\
                    {%amount%}元代金券\
                    </div>\
                </div>\
                <div class="use-img" data-status = "{%status%}">\
                        </div>\
                    </div>\
                </li>';
        $("#cashList").empty();
        $.each(data.cash,function(k,v){//渲染列表
            console.log(v);
            var ret = html.replace("{%createTime%}",Datepattern(new Date(v.createTime *1000), "yyyy-MM-dd HH:mm"))
                .replace(/\{%amount%\}/g, v.amount/100)
                .replace(/{%status%}/g, v.status);
            $("#cashList").append(ret);
        });
        var count = 0;
        if(data.cash){
            count = data.cash.length;
            console.log(count);
            $('#num').text(count);
        }
        var img = $('.use-img');
        img.each(function(){//加载已使用、未使用代金券
            var that = $(this);
            var dataStatus = that.data('status');
            console.log(typeof dataStatus);
            var use = '<img class="img-used" src="images/has_been_used.png" style="max-height: 50px;max-width: 50px;">';
            var unuse = '<img class="img-unused" src="images/not.png" style="max-height: 50px;max-width: 50px;" >';
            var expired = '<img class="img-unused" src="images/has_expired.png" style="max-height: 50px;max-width: 50px;" >';
            if(dataStatus == 1){
                that.append(unuse);
            }else if(dataStatus == 2){
                that.append(use);
            }else{
                that.append(expired);
            }
        })
    };
    ajaxSend();//初始化加载数据
});

