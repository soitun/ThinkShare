/**
 +-------------------------------------------------------------------
 * jQuery ThinkShare - 分享插件
 +-------------------------------------------------------------------
 * @version    1.0.0 beta
 * @since      2013.01.31
 * @author     麦当苗儿 <zuojiazi.cn@gmail.com>
 * @github     https://github.com/Aoiujz/ThinkShare.git
 +-------------------------------------------------------------------
 */
(function(){
	/* 当前脚本文件名 */
	var __FILE__ = $("script").last().attr("src");

	/* 分享平台配置 */
	var config = {
		//QQ空间分享配置
		"qzone" : {
			"api"   : "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey",
			"title" : "QQ空间"
		},

		//腾讯微博分享配置
		"tqq"   : {
			"api"   : "http://share.v.t.qq.com/index.php",
			"title" : "腾讯微博",
			"appkey" : ""
		},

		//新浪微博分享配置
		"sina" : {
			"api"       : "http://service.weibo.com/share/share.php",
			"title"     : "新浪微博",
			"appkey"    : "",
			"ralateUid" : ""
		}
	}

	/* 分享插件默认配置 */
	var defaults = {
		"share"    : [], //需要分享到的平台，空表示分享到所有支持的平台 可以在标签上使用data-share更改
		"style"    : "text" //分享工具条风格，可在标签上使用data-style属性更改
	}

	/* 创建分享参数 */
	var params = {
		//组装QQ空间分享参数
		"qzone" : function(value){
			return [
				"url="     + value.url,
				"title="   + value.title,
				"pics="    + value.pic,
				"summary=" + value.summary
			].join("&");
		},

		//组装腾讯微博分享参数
		"tqq" : function(value){
			return [
				"c=share",
				"a=index",
				"url="   + value.url,
				"title=" + value.title,
				"pic="   + value.pic,
				"site="  + window.location.host,
				"appkey" + config.tqq.appkey
			].join("&");
		},

		//组装新浪微博分享参数
		"sina" : function(value){
			return [
				"source=bookmark",
				"url="      + value.url,
				"title="    + value.title,
				"pic="      + value.pic,
				"appkey"    + config.tqq.appkey || "",
				"ralateUid" + config.tqq.ralate || ""
			].join("&");
		}

	}

	var ThinkShare = function(element, options){
		//初始化配置参数
		var self = this, ele = $(element), share_value;
		var options = $.extend({}, defaults, options || {}, ele.data());

		//获取分享数据
		share_value = _get_share_data();

		//解析字符串分享参数
		if($.type(options.share) === "string") options.share = options.share.split(',');

		//设置工具栏样式
		ele.css("display", "inline-block").addClass("think-share-" + options.style);

		//创建分享按钮
		ele.append(_getShareBtnHTML());
		
		//获取分享数据
		function _get_share_data(){
			var data     = {};
			data.url     = encodeURIComponent(options.url || window.location.href);
			data.title   = encodeURIComponent(options.title || $("title").text());
			data.pic     = encodeURIComponent(options.pic || "");
			data.summary = encodeURIComponent(options.summary || "");
			_delete("url", "title", "pic", "summary");
			return data;
		}

		//获取指定分享按钮html代码
		function _getShareBtnHTML(){
			var html = ["<span>分享到：</span>"];
			if(options.share.length == 0){
				$.each(config, function(name){
					html.push(_createShareBtn(name));
				});
			} else {
				for(i in options.share){
					html.push(_createShareBtn(options.share[i]));
				}
			}
			return html.join("");
		}

		//创建分享按钮
		function _createShareBtn(name){
			return [
				"<a class=\"share-icon-",
				name,
				"\" target=\"_blank\" href=\"",
				_get_share_url(name),
				"\">",
				config[name].title,
				"</a>"
			].join("");
		}

		//获取分享url
		function _get_share_url(name){
			var param = params[name](share_value);
			return [config[name].api, "?", param].join("");
		}

		//删除选项
		function _delete(){
			for(i in arguments){
				delete options[arguments[i]];
			}  
		}
	}

	/* 定义JQUERY分享插件 */
	$.fn.ThinkShare = function(options){
		$(this).each(function(){
			new ThinkShare(this, options);
		});
	}

	//加载CSS文件
	var path = __FILE__.slice(0, __FILE__.lastIndexOf("/")) + "/css/share.css";
	$("<link/>").attr({"href" : path, "type" : "text/css", "rel" : "stylesheet"}).appendTo("head");

	//执行默认分享工具
	$($("meta[name='think-share']").attr("value") || "#think-share").ThinkShare();
	
})(jQuery);