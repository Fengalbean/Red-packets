/**
 * Created by Administrator on 2015/3/27.
 */
var openId = getUrlParam('openId');
var rootId = localStorage['rootId'] ;
var floor = localStorage['floor'];
var localPhone = localStorage['couponPhone'];
var openIdAlbean = "o3eN7s2WNTaFToFOFFh8JBfGx72c";
var ajaxSend = function(){
    $.ajax({
        type: "POST",
        url: bath_test + "index.php?c=coupon&m=addFreeCoupon",
        data: {phone:localPhone,wxOpenId:openId},
        success: function(data){
            if(data){
                var param = JSON.parse(data);
                switch (param.code){
                    case -1:
                        break;
                    case -2:
                        hadAlert('亲，您来晚了，免费券已经领取完了！','my-alert');
                        window.location.href = appointPage_test;
                        break;
                    case -3:
//                        hadTip('亲，您的手机号码已经领取过免费券，即将在1秒后进入开呗预约界面！');
//                        hadAlert('亲，该手机号码已经领取过免费券，即将进入开呗预约界面！','my-alert');
                        window.location.href ="redEnvelopesDetail.html?rootId="+rootId + "&floor="+floor;
                        break;
                    case -4:
//                        window.location.href ="index.html";
//                        var msg = '很抱歉，您尚未享受上门保养服务，预约后再来领取红包吧！';
//                        hadConfirm(msg,'my-confirm',appointPage_test,function(){window.history.back()});
                        break;
                    case 0:
                        window.location.href = 'getCouponSuccess.html?rootId='+rootId+"&floor="+floor;
                        break;
                }
            }
        },
        error:function(){
            hadAlert('网络链接失败，请查看网络！','my-alert');
        }
    });
};
ajaxSend();
//var linkAddr = encodeURI('http://www.hadlink.com');
//
//var addr ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcad192eff007ef0a&response_type=code&"
// +"redirect_uri="+linkAddr+"&scope=snsapi_base#wechat_redirect";
//window.location.href = addr;
$(function(){
    var bodyContainer = $('#bodyContainer');
    var param = "index.php?c=coupon&m=addFreeCoupon";
    bodyContainer.on('click','#draw',function(){
        var _this = $(this);
        var phone = $('#phone').val();
        var flag = false;
        if(phone.length < 1){
            var msg = '亲，您还没输入手机号码呢！';
            hadAlert(msg,'my-alert');
            flag = true;
        }
        if(flag) return;
        var tel = /^1[0-9]{10}$/;
        var result = tel.test(phone);
        if(!result){
            var msg = '亲，请输入正确的手机号码！';
            hadAlert(msg,'my-alert');
        }else{
            $.ajax({
                type: "POST",
                url: bath_test + param,
                data: {phone:phone,wxOpenId:openIdAlbean},
                success: function(data){

                    if(data){
                        var param = JSON.parse(data);
                        if(param.data){
                            var rootId = param.data.id;
                            var newFloor = param.data.floor;
                        }
                        switch (param.code){
                            case -1:
                                hadAlert('网络错误，请重试1111！','my-alert');
                                break;
                            case -2:
                                hadTip('亲，您的手机号码已经领取过免费券，即将在3秒后进入开呗预约界面！');
                                setTimeout(function () {
                                    window.location.href = appointPage_test;
                                }, 3000);
                                break;
                            case -3:
                                hadAlert('亲，该手机号码已经领取过免费券，感谢您关注开呗！','my-alert');
                                break;
                            case -4:
                                var msg = '很抱歉，您尚未享受上门保养服务，预约后再来领取红包吧！';
                                hadConfirm(msg,'my-confirm',appointPage_test,function(){window.history.back()});
                                break;
                            case 0:
                                time(_this);
                                localStorage['rootId'] = rootId;
                                localStorage['floor'] = newFloor;
                                localStorage['couponPhone'] = phone;
                                window.location.href = 'getCouponSuccess.html?rootId='+rootId+"&floor="+newFloor;
                                break;
                        }
                    }
                },
                error:function(){
                    hadAlert('网络链接失败，请查看网络！','my-alert');
                }
            });
        }
    })
});