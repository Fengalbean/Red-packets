/**
 * Created by Administrator on 2015/3/28.
 */
var BASE_PATH = "http://product.ikaibei.com";
var getUrlParam = function getUrlParam(name){//获取URL参数
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
};
var Datepattern = function(d, fmt) {//日期格式化参数
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
};


/**
 * name : hadAlert提示警告弹出框
 * param@-msg:提示信息
 * param@-selector: 弹出框ID
 * Created by fengdb on 2015/3/28.
 */
function hadAlert(msg,selector){
    var tpl = '<div class="am-modal am-modal-alert" tabindex="-1" id="'+selector +"\">"
            +'<div class="am-modal-dialog">\
                <div class="am-modal-hd pd-5" style="border-bottom: 1px solid gainsboro;">温馨提示\
            <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>\
        </div>\
                <div class="am-modal-bd am-modal-msg" style="padding: 30px;">\
                </div>\
                <div class="am-modal-footer">\
                    <span class="am-modal-btn">确定</span>\
                </div>\
            </div>\
            </div>';
    $('body').find(selector).remove();
    $('body').append(tpl);
    $('#'+selector).find('.am-modal-msg').text(msg);
    $('#'+selector).modal({
        relatedTarget: this
    });
};
/**
 * name : hadShare 分享底部弹出框
 *
 * param@-selector: 弹出框ID
 * Created by fengdb on 2015/3/28.
 */
var hadShare = function(selector){
    var tpl = '<div class="am-modal-actions" id='+selector + '>'
        +'<div class="am-modal-actions-group">\
        <ul class="am-list">\
            <li class="am-modal-actions-header font-16">好友助力，开呗免费保养</li>\
            <li id="sendFriendsClass"><a href="javascript:void(null)"><span class="am-icon-wechat" ></span>分享到朋友圈</a></li>\
            <li id="sendFriend"><a href="javascript:void(null)"><span class="am-icon-wechat" ></span>分享给朋友</a></li>\
            <li id="sendQQFriend"><a href="javascript:void(null)"><span class="am-icon-wechat" ></span>分享给QQ好友</a></li>\
            <li id="sendweibo"><a href="javascript:void(null)"><span class="am-icon-wechat" ></span>分享到微博</a></li>\
        </ul>\
        </div>\
    <div class="am-modal-actions-group">\
        <button class="am-btn am-btn-secondary am-btn-block" data-am-modal-close>取消</button>\
    </div>\
    </div>';
    $('body').find(selector).remove();
    $('body').append(tpl);
    $('#'+selector).modal({
        relatedTarget: this
    });
};

//载入微信JS接口
//function loadWxJsConfig(){
//    var img = BASE_PATH + "/maintenance/v2/activity/share.jpg";
//    var title = "好友助力，开呗免费保养";
//    var content = "给老客户发福利啦！凡享用过开呗上门养车服务的用户可获得一张免费上门保养券和40张总价值800元的代金券分享给朋友，快来邀请车友领取吧！";
//    var link = document.location.href;
//    var jqxhr = $.ajax({
//        url : "http://120.24.229.78/app_dev_test/index.php?c=wechatapi&m=getJsConf",
//        type: "POST",
//        data: {
//            url: location.href.split('#')[0]
//        },
//        dataType: "json",
//        success: function(data) {
//            dataProtocolHandler(data, function(data,dataType,conf) {
//                console.log(data);
////                if(!window.wx){
////                    return;
////                }
//                wx.config({
//                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                    appId: data['appId'], // 必填，公众号的唯一标识
//                    timestamp: data['timestamp'], // 必填，生成签名的时间戳
//                    nonceStr: data['nonceStr'], // 必填，生成签名的随机串
//                    signature: data['signature'],// 必填，签名，见附录1
//                    jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//                        'onMenuShareTimeline',
//                        'onMenuShareAppMessage',
//                        'onMenuShareQQ',
//                        'onMenuShareWeibo'
//                    ]
//                });
//                // 展示分享按钮，并绑定分享事件
//                wx.ready(function(){
//                    wx.onMenuShareTimeline({//分享到朋友圈
//                        title: title, // 分享标题
//                        link: link, // 分享链接
//                        imgUrl: img, // 分享图标
//                        success: function () {
//                            // 用户确认分享后执行的回调函数
//                            alert('yes');
//                        },
//                        cancel: function () {
//                            // 用户取消分享后执行的回调函数
//                            alert('no');
//                        }
//                    });
//                    wx.onMenuShareAppMessage({//分享给朋友
//                        title: title, // 分享标题
//                        desc: content, // 分享描述
//                        link: link, // 分享链接
//                        imgUrl: img, // 分享图标
//                        type: 'link', // 分享类型,music、video或link，不填默认为link
//                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
//                        success: function () {
//                            // 用户确认分享后执行的回调函数
//                            // alert('yes');
//                        },
//                        cancel: function () {
//                            // 用户取消分享后执行的回调函数
//                            // alert('no');
//                        }
//                    });
//                    wx.onMenuShareQQ({//分享到QQ
//                        title: "<?=$act['act_name']?>", // 分享标题
//                        desc: "<?=substr($act['act_stime'],0,10)?>\n<?=$act['act_place']?>", // 分享描述
//                        link: "http://www.brandhd.com/v/events/view/<?=$act['act_id']?>", // 分享链接
//                        imgUrl: "http://www.brandhd.com<?=$act['act_poster_small']?>", // 分享图标
//                        success: function () {
//                            // 用户确认分享后执行的回调函数
//                        },
//                        cancel: function () {
//                            // 用户取消分享后执行的回调函数
//                        }
//                    });
//                    wx.onMenuShareWeibo({//分享到微博
//                        title: "<?=$act['act_name']?>", // 分享标题
//                        desc: "<?=substr($act['act_stime'],0,10)?>\n<?=$act['act_place']?>", // 分享描述
//                        link: "http://www.brandhd.com/v/events/view/<?=$act['act_id']?>", // 分享链接
//                        imgUrl: "http://www.brandhd.com<?=$act['act_poster_small']?>", // 分享图标
//                        success: function () {
//                            // 用户确认分享后执行的回调函数
//                        },
//                        cancel: function () {
//                            // 用户取消分享后执行的回调函数
//                        }
//                    });
//                });
//            });
//        },
//        error: function(data) {
//            hadAlert('网络出错了！','my-alert');
//        }
//    });
//}
//function weixinShareTimeline(title,desc,link,imgUrl){
//    WeixinJSBridge.invoke('shareTimeline',{
//        "img_url":imgUrl,
//        //"img_width":"640",
//        //"img_height":"640",
//        "link":link,
//        "desc": desc,
//        "title":title
//    });
//}
//var share = $('body');//好友助力，开呗免费保养
//share.on('click','#sendFriendsClass',function(){
//    loadWxJsConfig();
//    weixinShareTimeline('好友助力，开呗免费保养','开呗免费送红包','product.ikaibei.com','../images/drawing.png');
//});

function dataProtocolHandler(data, successCallback, failCallback) {
    if (data) {
        if (data.code === 0) {
            if (successCallback && typeof successCallback == "function") {
                successCallback(data.data, data.datatype,data.conf,data.skey);
            }
        }else{
            if (failCallback && typeof failCallback == "function") {
                failCallback(data.code, data.msg, data.data, data.datatype);
            } else {
                hadAlert(data.msg,'showTips');
            }
        }
    } else {
        hadAlert("data is null",'showTips');
    }
}
