/**
 * Created by Administrator on 2015/3/28.
 */

$(function(){
    var bath = "http://120.24.208.201/hadlink/hadlink91_product/";
    var url = "index.php?c=coupon&m=addCashCoupon";
//    var wxOpenId = getUrlParam('openId');
    var rootId = getUrlParam('rootId');
    var floor = getUrlParam('floor');
    var param = {};
    if(rootId && floor){
        param.rootId = rootId;
        param.floor = floor;
//        param.wxOpenId = wxOpenId;
    }
    var bodyContainer = $('#bodyContainer');
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
            param.phone = phone;
            $.ajax({
                type: "POST",
                url: bath + url,
                data: param,
                success: function(data){
                    if(data){
                        var param = JSON.parse(data);
                        if(param.data){
                            var rootId = param.data.id;
                            window.newFloor = param.data.floor;
                        }
                        console.log(param.code);
                        switch (param.code){
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
                                if(!localStorage['phone']){
                                    localStorage['phone'] = phone;
                                }
                                localStorage['rootId'] = rootId;
                                localStorage['floor'] = window.newFloor;
                                alert(window.newFloor);
                                window.location.href = 'getCashSuccess.html?rootId='+rootId+"&floor="+window.newFloor;
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