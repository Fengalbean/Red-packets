/**
 * Created by Administrator on 2015/3/27.
 */
$(function(){

    var BASE_PATH = "http://product.ikaibei.com";
    function loadWxJsConfig(){
        var img = BASE_PATH + "/maintenance/v2/activity/share.jpg";
        var title = "好友助力，开呗免费保养";
        var content = "给老客户发福利啦！凡享用过开呗上门养车服务的用户可获得一张免费上门保养券和40张总价值800元的代金券分享给朋友，快来邀请车友领取吧！";
        var link = document.location.href;
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
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo'
                        ]
                    });
                    // 展示分享按钮，并绑定分享事件
                    wx.ready(function(){
                        window.wx.onMenuShareTimeline({//分享到朋友圈
                            title: title, // 分享标题
                            link: link, // 分享链接
                            imgUrl: img, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                alert('yes');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                alert('no');
                            }
                        });
                        window.wx.onMenuShareAppMessage({//分享给朋友
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
                        wx.onMenuShareQQ({//分享到QQ
                            title: "<?=$act['act_name']?>", // 分享标题
                            desc: "<?=substr($act['act_stime'],0,10)?>\n<?=$act['act_place']?>", // 分享描述
                            link: "http://www.brandhd.com/v/events/view/<?=$act['act_id']?>", // 分享链接
                            imgUrl: "http://www.brandhd.com<?=$act['act_poster_small']?>", // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareWeibo({//分享到微博
                            title: "<?=$act['act_name']?>", // 分享标题
                            desc: "<?=substr($act['act_stime'],0,10)?>\n<?=$act['act_place']?>", // 分享描述
                            link: "http://www.brandhd.com/v/events/view/<?=$act['act_id']?>", // 分享链接
                            imgUrl: "http://www.brandhd.com<?=$act['act_poster_small']?>", // 分享图标
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
                hadAlert('网络出错了！','my-alert');
            }
        });
    }
    loadWxJsConfig();
    var id = getUrlParam('rootId');
    var floor = getUrlParam("floor");
    console.log(id);
    console.log(floor);
    if(id && floor){
        return;
    }
    var param = {};
    var friendsHelp = $('#friendsHelp');
    friendsHelp.on('click',function(){
        hadShare('share');
//        window.open('redEnvelopesDetail.html?rootId='+id+'&'+'floor='+floor+"")
    });

});
