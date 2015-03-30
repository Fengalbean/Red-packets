/**
 * Created by Administrator on 2015/3/28.
 */
$(function(){
    var bath = "http://120.24.208.201/hadlink/hadlink91_product/";
    var url = "index.php?c=coupon&m=addCashCoupon";
    var id = $.urlParam('roorId');
    var floor = $.urlParam('floor');
    var param = {};
    function hadAlert(msg,element){
        $('#'+element).find('.am-modal-msg').text(msg);
        $('#'+element).modal({
            relatedTarget: this
        });
    };
    if(id && floor){
        param = {
            rootId:55,
            floor:'0-55-69'
        }
    };
    param = {
        rootId:55,
        floor:'0-55-69'
    };
    var bodyContainer = $('#bodyContainer');
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
            param.phone = phone;
            $.ajax({
                type: "POST",
                url: bath + url,
                data: param,
                success: function(data){
                    if(data){
                        var param = JSON.parse(data);
                        if(param.data){
                            var routeId = param.data.id;
                            var floor = param.data.floor;
                        }
                        console.log(param);
                    }
                },
                error:function(){
                    hadAlert('网络原因，请重试！','my-alert');
                }
            });
        }
    })
});