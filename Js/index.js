/**
 * Created by Administrator on 2015/3/27.
 */
var openId = getUrlParam('openId');
var rootId = localStorage['rootId'] ;
var  floor = localStorage['floor'];
var newPhone = localStorage['phone'];
var complete = false;
//$.ajax({
//    type: "get",
//    url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxcad192eff007ef0a&secret=bf0cbb98ee41332a2caa3367c863c854",
//    data: '',
//    success: function(data){
//        alert('xxx');
//        if(data){
//            alert('xxx');
//            var jsonData = JSON.parse(data);
//            window.access_token = jsonData.access_token;
//        }
//    },
//    complete:function(){
//        complete = true;
//    },
//    error:function(){
//        hadAlert('xsasdsdd！','my-alert');
//    }
//});
//if(complete){
//    $.ajax({
//        type: "POST",
//        url: "https://api.weixin.qq.com/cgi-bin/user/info",
//        data: {access_token:window.access_token,openId:openId,lang:"zh_CN"},
//        success: function(data){
//            if(data){
//                var jsonData = JSON.parse(data);
//                alert(jsonData.nickname)
//            }
//        },
//        error:function(){
//            hadAlert('网络原因，请重试！','my-alert');
//        }
//    });
//}

$.ajax({
    type: "POST",
    url: bath + "index.php?c=coupon&m=addFreeCoupon",
    data: {phone:newPhone,openId:openId},
    success: function(data){
        if(data){
            var param = JSON.parse(data);
            console.log(data);
            switch (param.code){
                case -1:
//                    hadAlert('网络错误，请重试！','my-alert');
                    break;
                case -2:
//                    hadAlert('亲，您来晚了，免费券已经领取完了！','my-alert');
                    break;
                case -3:

//                    hadAlert('亲，该手机号码已经领取过免费券，感谢您关注开呗！','my-alert');
                    window.location.href ="redEnvelopesDetail.html?rootId="+rootId + "&floor="+floor;
                    break;
                case -4:
                    var msg = '很抱歉，您尚未享受上门保养服务，预约后再来领取红包吧！';
                    hadConfirm(msg,'my-confirm',appointPage_test,function(){window.history.back()});
                    break;
                case 0:
//                    time(_this);
                    localStorage['rootId'] = rootId;
                    localStorage['floor'] = newFloor;
//                    localStorage['phone'] = phone;
                    window.location.href = 'getCouponSuccess.html?rootId='+rootId+"&floor="+newFloor;
                    break;
            }
//            window.location.href ="redEnvelopesDetail.html?rootId="+rootId + "&floor="+floor;
        }
    },
    error:function(){
        hadAlert('网络原因，请重试！','my-alert');
    }
});
$(function(){
    var bath = "http://120.24.208.201/hadlink/hadlink91_product/";
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
                url: bath + param,
                data: {phone:phone,openId:openId},
                success: function(data){
                    if(data){
                        var param = JSON.parse(data);
                        if(param.data){
                            var rootId = param.data.id;
                            var newFloor = param.data.floor;
                        }
                        switch (param.code){
                            case -1:
                                hadAlert('网络错误，请重试！','my-alert');
                                break;
                            case -2:
                                hadAlert('亲，您来晚了，免费券已经领取完了！','my-alert');
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
                                localStorage['phone'] = phone;
                                window.location.href = 'getCouponSuccess.html?rootId='+rootId+"&floor="+newFloor;
                                break;
                        }
                    }

                },
                error:function(){
                    hadAlert('网络原因，请重试！','my-alert');
                }
            });
        }
    })
});