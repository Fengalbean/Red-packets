/**
 * Created by Administrator on 2015/3/28.
 */
$(function(){
    var bath = "http://120.24.208.201/hadlink/hadlink91_product/";
    var url = "index.php?c=coupon&m=getRedEnvelopeCoupon";
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
            id:55,
            floor:'0-55-69'
        }
    };
    param = {
        id:55,
        floor:'0-55-69'
    };
    var ajaxSend = function(){
        $.ajax({
            type: "get",
            url: bath + url,
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
                    console.log(jsonData);
                    if (jsonData.data) {
                        var param = jsonData.data;
                        dealData(param);
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
            console.log(v);
            var ret = html.replace("{%createTime%}",Datepattern(new Date(v.createTime *1000), "yyyy-MM-dd HH:mm"))
                .replace(/\{%amount%\}/g, v.amount)
                .replace(/{%status%}/g, v.status);
            $("#cashList").append(ret);
        });
        if(data.free){
            $('#num').text(data.free[0].sum);//统计使用代金券的人数
        }
        var img = $('.use-img');
        img.each(function(){//加载已使用、未使用代金券
            var that = $(this);
            var dataStatus = that.data('status');
            console.log(typeof dataStatus);
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
       window.open('http://productdev.ikaibei.com/maintenance/v2/index.html?')
    });
});