window.KB = (function(){
    var ua = (function(){
        var isWeixin = function(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        };
        var isQQ = function(){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf("qq")>=0) {
                return true;
            } else {
                return false;
            }
        };
        var isKaibei =function(){
            return navigator.userAgent.indexOf("Kaibei") !=-1 ? true:false;
        };
        var browser = {
            versions: function() {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    ios: !!u.match(/Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1,
                    iPhone: u.indexOf('iPhone') > -1,
                    iPad: u.indexOf('iPad') > -1 //是否iPad
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
        return {
            isWeixin : isWeixin(),
            isQQ : isQQ(),
            isKaibei:isKaibei(),
            isAndroid :browser.versions.android,
            isApple : browser.versions.iPhone || browser.versions.iPad,
            isIPhone : browser.versions.iPhone
        };
    })();


    function kaibeiShare(data){
        if(typeof data =="object"){
            data = JSON.stringify(data);
        }
        if(window.CZS.data.version){
            if(window.CZS.share){
                window.CZS.share(data);
            }else{
                if (KB.ua.isApple) {
                window.location="czs://share?data=" + data;
                }
            }
        }else{
            console.log("不在开呗APP内无法分享");
        }
    }
    function kaibeiPay(data){
        if(typeof data =="object"){
            data = JSON.stringify(data);
        }
        if(window.CZS.data.version){
            if(window.CZS.pay){
                window.CZS.pay(data);
            }else{
                if (KB.ua.isApple) {
                window.location="czs://pay?data=" + data;
                }
            }
        }else{
            console.log("不在开呗APP内无法支付");
        }
    }
    function kaibeiJump(pageId,pageData){
        if(typeof pageData =="object"){
            pageData = JSON.stringify(pageData);
        }
        if(window.CZS.data.version){
            console.log("window.CZS.redirect="+window.CZS.redirect);
            if(window.CZS.redirect){
                window.CZS.redirect(pageId,pageData);
            }else{
                console.log(KB.ua.isApple);
                if (KB.ua.isApple) {
                    var url = "czs://jump?pageId=" + pageId;
                    if(pageData){
                        url +="&data=" + pageData;
                    }
                    window.location=url;
                }
            }     
        }else{
            if(pageId == "servicedetail"){
                var pageData = JSON.parse(pageData);
                window.location = "http://www.ikaibei.com/share/carService.html?id=" + pageData["carserviceId"];
            }
            if(pageId == "shopdetail"){
                var pageData = JSON.parse(pageData);
                window.location = "http://www.ikaibei.com/share/shop.html?id=" + pageData["shopId"];
            }
        }
    }


    var urlParam = function(name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results) {
            return results[1];
        } else {
            return 0;
        }
    };
    var utils = {};
    utils.urlParam = urlParam;
    utils.versionCompare = function(version1,version2){
        if(version1 && version2){
            var version1Arr = version1.split(".");
            var version2Arr = version2.split(".");
            if(version1Arr[0] >version2Arr[0]){
                return 1;
            }else if(version1Arr[0] <version2Arr[0]){
                return 2;
            }else{
                if(version1Arr[1] >version2Arr[1]){
                    return 1;
                }else if(version1Arr[1] <version2Arr[1]){
                    return 2;
                }else{
                    if(version1Arr[2] >version2Arr[2]){
                        return 1;
                    }else if(version1Arr[2] <version2Arr[2]){
                        return 2;
                    }else{
                        return 0;
                    }
                }
            }
        }else{
            return -1;
        }
    };
    utils.getSession = function(){
        var session;
        if($.urlParam("session")){
            session= $.urlParam("session");
        }else if($.cookie){
            session= $.fn.cookie("session");
        }
        // alert("session="+session);
        return session;
    };
    return  {
        ua : ua,
        pay : kaibeiPay,
        jump : kaibeiJump,
        share : kaibeiShare,
        utils : utils
    };
})();


window.CZS = window.CZS || {};
window.CZS.data = window.CZS.data ||{};
if(navigator.userAgent.indexOf("iPhone")>=0 || navigator.userAgent.indexOf("iPad")>=0){
    $("body").append('<iframe id="geiIOSdata" style="display:none" src="czs://geiIOSdata"></iframe>');
}

window.IOSCallback = function(){
    // alert("IOSCallback ing");

};

//ios拿数据
function getNativeData(data){
    window.CZS.data = data;
    // alert("getNativeData="+ data);
    setTimeout(function(){
        window.IOSCallback();
    },100);
    
}
if(window.CZS && window.CZS.getNativeData){
    // alert("init android");
    var a  = window.CZS.getNativeData();
    window.CZS.data = JSON.parse(window.CZS.getNativeData());
}
// alert("xxx");
function tryGetNativeData(cb){
    // alert("tryGetNativeData");
    if(!window.CZS.data){
        window.CZS.data={};
    }
    //在开呗里面
    if(window.CZS.data.version){
        console.log("window.CZS.data.version="+window.CZS.data.version);
         //如果是苹果
        if(KB.ua.isApple){
            // alert("KB.ua.isApple");
            if(navigator.userAgent.indexOf("iPhone")>=0 || navigator.userAgent.indexOf("iPad")>=0){
                $("body").append('<iframe id="geiIOSdata" style="display:none" src="czs://geiIOSdata"></iframe>');
            }
            window.IOSCallback = cb;
        }else if(KB.ua.isAndroid){
            console.log("KB.ua.isAndroid");
            if(window.CZS && window.CZS.getNativeData){
                var a  = window.CZS.getNativeData();
                // console.log(a);
                window.CZS.data = JSON.parse(window.CZS.getNativeData());
                // alert("tryGetNativeData android");
                cb();
                // alert(JSON.stringify(window.CZS.data));
            }
        }

    }else{
        cb();
    }
}