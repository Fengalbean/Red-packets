/**
 * Created by Administrator on 2015/3/28.
 */
$(function(){
    var url = "index.php?c=coupon&m=getRedEnvelopeCoupon";
    var rootId = getUrlParam('rootId');
    var floor = getUrlParam('floor');
    var openId = getUrlParam('')
    var param = {};
    if(rootId){
        param = {
            id:rootId
        }
    };
    function loadWxJsConfig(activeNum,rootId,newFloor){
        var img = "http://hadlinkimg.b0.upaiyun.com/weixin/redShare.png";
        var title = "好友助力，开呗免费保养";
        var content = "已有"+activeNum+"张代金券被使用，快来领取代金券，快来免费保养吧！";
        var link = 'http://productdev.ikaibei.com/redEnvelopes/initShareFriends.html?rootId='+rootId+"&floor="+newFloor+"&openId="+openId;
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
    var ajaxSend = function(){
        $.ajax({
            type: "get",
            url: bath_test + url,
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
                    if (jsonData.data) {
                        var param = jsonData.data;
                        dealData(param);
                        if(param.free){
                            if(param.free[0]){
                                Window.newFloor = param.free[0].floor;
                                loadWxJsConfig(param.free[0].sum,rootId,Window.newFloor);
                            }
                        }

                    }

                }
            },
            error: function () {
                hadAlert('网络原因，请重试！', 'my-alert');
            }
        });
    };
    var dealData = function(data){//渲染数据
        var count = 0;
        if(data.cash){
            count = data.cash.length;
            $('#num').text(count);
            if(count > 0){
                $('#list').show();
            }
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
                .replace(/\{%amount%\}/g, v.amount)
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
    ajaxSend();
    var order = $('#order');
    order.on('click',function(){
       window.open(appointPage_test);
    });
});