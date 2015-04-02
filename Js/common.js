/**
 * Created by Administrator on 2015/3/28.
 */
var appointPage_test = "http://productdev.ikaibei.com/maintenance/v2/activity/index.html";
var appointPage_formal = "http://product.ikaibei.com/maintenance/v2/activity/index.html";
var BASE_PATH = "http://product.ikaibei.com";
var getUrlParam = function getUrlParam(name){//获取URL参数
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
};

var cookie = $.AMUI.utils.cookie;//定义cookie
var bath = "http://120.24.208.201/hadlink/hadlink91_product/";//定义基础url
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

function hadConfirm(msg,selector,link,callback){
    var tpl = '<div class="am-modal am-modal-confirm" tabindex="-1" id="'+selector +"\">"
        +'<div class="am-modal-dialog">\
                <div class="am-modal-hd pd-5" style="border-bottom: 1px solid gainsboro;">温馨提示\
            <a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>\
        </div>\
                <div class="am-modal-bd am-modal-msg" style="padding: 30px;">\
                </div>\
                <div class="am-modal-footer">\
        <span class="am-modal-btn am-modal-btn" data-am-modal-confirm>立即预约</span>\
                </div>\
            </div>\
            </div>';
    $('body').find(selector).remove();
    $('body').append(tpl);
    $('#'+selector).find('.am-modal-msg').text(msg);
    $('#'+selector).modal({
        relatedTarget: this,
        onConfirm: function() {
            window.location.href = link;
        },
        onCancel: function() {
            callback();
        }
    });

}
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
//计时器
var wait=10;
function time(element) {
    if (wait == 0) {
        element.removeAttr("disabled");
        element.css('background','#cc3e3e');
        element.text("立即领取");
        wait = 10;
    } else {
        element.prop("disabled",true);
        element.text(wait + "秒后领取");
        element.css('background',"#808080") ;
        wait--;
        setTimeout(function() {time(element) },1000)
    }
}

function tipShare(selector){
    var tpl = '<div style="top:6%;width: 300px;" class="am-modal am-modal-no-btn" tabindex="-1" id="'+selector+'" >'
//        + '<div class="am-modal-hd">'
//        + '<a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>'
//        + '</div>'
        + '<img src="images/arrow_tip.png" style="opacity: 0.7;width: 330px">'
        + '</div>';

    $('body').find(selector).remove();
    $('body').append(tpl);
    $('#'+selector).modal('open');

}

function hadLoading(option){
    var tpl = '<div class="am-modal am-modal-loading am-modal-no-btn" tabindex="-1" id="my-modal-loading">\
        <div class="am-modal-dialog">\
        <div class="am-modal-hd">正在载入...</div>\
        <div class="am-modal-bd">\
        <span class="am-icon-spinner am-icon-spin"></span>\
        </div>\
    </div>\
    </div>';
    $('body').append(tpl);
    $('#my-modal-loading').modal(option);
}
