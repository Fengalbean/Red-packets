/**
 * Created by Administrator on 2015/3/31.
 */
$(function(){
    var rootId = getUrlParam('rootId');
    var floor = getUrlParam('floor');
    var bath = "http://120.24.208.201/hadlink/hadlink91_product/";
    var url = "index.php?c=coupon&m=getRedEnvelopeCoupon";
    var urlCash = "index.php?c=coupon&m=addCashCoupon";
    var param = {};
    var phone = localStorage['phone'];

    if(typeof phone != "undefined"){
        param.phone = phone;
    }

    var newFloor = window.newFloor;
    param.rootId = rootId;
    param.floor = floor;
    console.log(param);
    function loadWxJsConfig(activeNum){
        var img = "http://hadlinkimg.b0.upaiyun.com/weixin/redShare.png";
        var title = "好友助力，开呗免费保养";
        var content = "已有"+activeNum+"张代金券被使用，快来领取代金券，快来免费保养吧！";
        var link = 'http://productdev.ikaibei.com/redEnvelopes/initShareFriends.html?rootId='+rootId+"&floor="+newFloor;

        var jqxhr = $.ajax({
            // url: "BASE_PATH" +"/index.php?c=wechatapi&m=getJsConf",
            url : "http://120.24.229.78/app_dev_test/index.php?c=wechatapi&m=getJsConf",
            type: "POST",
            data: {
                url: location.href.split('#')[0]
            },
            dataType: "json",
            success: function(data) {
                dataProtocolHandler(data, function(data,dataType,conf) {
                    if(!window.wx){
                        return;
                    }
                    window.wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data['appId'], // 必填，公众号的唯一标识
                        timestamp: data['timestamp'], // 必填，生成签名的时间戳
                        nonceStr: data['nonceStr'], // 必填，生成签名的随机串
                        signature: data['signature'],// 必填，签名，见附录1
                        jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage'
                        ]
                    });
                    // 展示分享按钮，并绑定分享事件

                    wx.ready(function () {
                        window.wx.onMenuShareTimeline({//分享至朋友圈
                            title: title, // 分享标题
                            link: link, // 分享链接
                            imgUrl: img, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                // alert('yes');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                // alert('no');
                            }
                        });

                        window.wx.onMenuShareAppMessage({//分享给好友
                            title: title, // 分享标题
                            desc: content, // 分享描述
                            link: link, // 分享链接
                            imgUrl: img, // 分享图标
                            type: 'link', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                // alert('yes');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                // alert('no');
                            }
                        });
                        wx.onMenuShareQQ({
                            title: title, // 分享标题
                            desc: content, // 分享描述
                            link: link, // 分享链接
                            imgUrl: img, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareWeibo({
                            title: title, // 分享标题
                            desc: content, // 分享描述
                            link: link, // 分享链接
                            imgUrl: img, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
                });
            },
            error: function(data) {
            }
        });
    }
    var ajaxSend = function(){//渲染列表
        $.ajax({
            type: "get",
            url: bath + url,
            data: {id:rootId,floor:floor},
            success: function (data) {
                var flag = false;
                if (data) {
                    var jsonData = JSON.parse(data);
                    if(jsonData.free){
                        window.newFloor = jsonData.free[0].floor;
//                        localStorage['newFloor'] = newFloor;
                    }

                    if(jsonData.code !== 0 ){
                        hadAlert('错误！',"my-alert");
                        flag = true;
                    }
                    console.log(jsonData);
                    if(flag) return;

                    if (jsonData.data) {
                        var param = jsonData.data;
                        dealData(param);
                        if(param.free){
                            if(param.free[0]){
                                loadWxJsConfig(param.free[0].sum);
                            }
                        }

                    }
                    loadWxJsConfig(0);
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
        var cashNum ;//领取代金券数量
        if(data.cash){
            cashNum = data.cash.length;
            if(cashNum>0){
                $('#num').text(cashNum);//统计领取代金券的人数
                $('#list').show();
            }else{
                $('#num').text(0);
            }
        }else{
            $('#num').text(0);
        }
        if(data.free){
            if(data.free[0]){
                var activeCash = data.free[0].sum;
                $('#activeCash').text(activeCash);
            }
        }else{
            $('#activeCash').text(0);
        }

        switch (data.free[0].sum ? data.free[0].sum :0){
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
            var ret = html.replace("{%createTime%}",Datepattern(new Date(v.createTime *1000), "yyyy-MM-dd HH:mm"))
                .replace(/\{%amount%\}/g, v.amount/100)
                .replace(/{%status%}/g, v.status);
            $("#cashList").append(ret);
        });

        var img = $('.use-img');
        img.each(function(){//加载已使用、未使用代金券
            var that = $(this);
            var dataStatus = that.data('status');
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
    var helpFriends = $('#helpFriends');
    helpFriends.on('click',function(){
        var flag = false;
        console.log(phone);
        console.log(param);
        if( typeof phone == "undefined"){
            window.location.href = "friendsGetCash.html?rootId="+rootId+"&floor="+floor;
            flag = true;
        };
        if(flag) return;
        var _this = $(this);
        var flag = false;
        $.ajax({
            type: "post",
            url: bath + urlCash,
            data: param,
            dataType:'json',
            success: function (data) {
                console.log(data.code);
                switch (data.code){
                    case -1:
                        hadAlert('参数不对，请重试！','my-alert');
                        break;
                    case -2:
                        hadAlert('亲，您来晚了，免费券已经领取完了！','my-alert');
                        break;
                    case -3:
                        hadAlert('亲，不能领取自己的代金券！','my-alert');
                        break;
                    case -4:
                        window.location.href = "getCashSuccess.html?rootId="+rootId + "&floor=" + floor;
                        break;
                    case 0:
//                        cookie.set('phone',phone,99999);
                        localStorage['phone'] = phone;
                        window.location.href = 'getCashSuccess.html?rootId='+rootId+"&floor="+newFloor;
                        break;
                }
            },
            error: function () {
                hadAlert('网络原因，请重试！', 'my-alert');
            }
        });
    });
});

