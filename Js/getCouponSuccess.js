/**
 * Created by Administrator on 2015/3/27.
 */
$(function(){
    var BASE_PATH = "http://product.ikaibei.com";
    var rootId = getUrlParam('rootId');
    var floor = getUrlParam("floor");
    var openId = getUrlParam("openId");
    function loadWxJsConfig(activeNum,rootId,floor){
        var img = "http://hadlinkimg.b0.upaiyun.com/weixin/redShare.png";
        var title = "好友助力，开呗免费保养";
        var content = "已有"+activeNum+"张代金券被使用，快来领取代金券，快来免费保养吧！";
        var linkAddr = encodeURI('http://www.hadlink.com');

        var link ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcad192eff007ef0a&response_type=code&"
            +"redirect_uri="+linkAddr+"&scope=snsapi_base#wechat_redirect";
//        var link = 'http://productdev.ikaibei.com/redEnvelopes/initShareFriends.html?rootId='+rootId+"&floor="+floor+"&openId="+openId;
        var jqxhr = $.ajax({
            url : "http://120.24.229.78/app_dev_test/index.php?c=wechatapi&m=getJsConf",
            type: "POST",
            data: {
                url: location.href.split('#')[0]
            },
            dataType: "json",
            success: function(data) {
                dataProtocolHandler(data, function(data,dataType,conf) {
                    console.log(data);
                    if (!window.wx) {
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
                            'onMenuShareAppMessage',
                            'wx.onMenuShareQQ',
                            'wx.onMenuShareWeibo'
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
                                window.location.href ="redEnvelopesDetail.html?rootId="+rootId + "&floor="+floor;
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
                                window.location.href ="redEnvelopesDetail.html?rootId="+rootId + "&floor="+floor;
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
                                window.location.href ="redEnvelopesDetail.html?rootId="+rootId + "&floor="+floor;
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
                                window.location.href ="redEnvelopesDetail.html?rootId="+rootId + "&floor="+floor;
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    });
                })
            },
            error: function(data) {
            }
        });
    }
    loadWxJsConfig(0,rootId,floor);
    var friendsHelp = $('#friendsHelp');
    friendsHelp.on('click',function(){
        tipShare('tipShare');
    });

});
