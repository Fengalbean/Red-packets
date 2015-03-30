/**
 * Created by Administrator on 2015/3/27.
 */
$(function(){
    var bath = "http://120.24.208.201/hadlink/hadlink91_product/";
    var bodyContainer = $('#bodyContainer');
    var param = "index.php?c=coupon&m=addFreeCoupon";
//    var clickable=true;
//    function waitOneMinute(){
//        var second = 60;
//        var c= setInterval(function(){
//            if(second>=1){
//                $("#getVerifyCode").html(second +"秒后重试");
//                clickable = false;
//                $("#getVerifyCode").addClass("disable");
//                second--;
//            }else{
//                $("#getVerifyCode").html("获取验证码");
//                clickable = true;
//                $("#getVerifyCode").removeClass("disable");
//                clearInterval(c);
//            }
//
//        },1000);
//    }
    bodyContainer.on('click','#draw',function(){
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
                data: {phone:phone},
                success: function(data){
                    if(data){
                        var param = JSON.parse(data);
                        if(param.data){
                            var rootId = param.data.id;
                            var floor = param.data.floor;
                            console.log(param.data.floor);
                            console.log(param.data.id);
                        }
                        console.log(param.code);
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
                                $('#my-confirm').find('.am-modal-msg').text(msg);
                                $('#my-confirm').modal({
                                    relatedTarget: this,
                                    onConfirm: function() {
                                        if(window.ENVIRONMENT =="dev") {
                                            window.location.href = 'http://productdev.ikaibei.com/maintenance/v2/index.html';
                                        }else{
                                            window.location.href = 'http://product.ikaibei.com/maintenance/v2/index.html';
                                        }
                                    },
                                    onCancel: function() {
                                        window.history.back();
                                    }
                                });
                                break;
                            case 0:
                                //$.cookie(’name’, ‘value’, {expires: 7, path: ‘/’, domain: ‘jquery.com’, secure: true});
                                $.cookie('rootId',rootId,{});
                                window.location.href = 'getCouponSuccess.html?rootId='+rootId +"&"+"floor="+floor+"";
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