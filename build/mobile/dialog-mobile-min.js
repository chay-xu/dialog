!function(n){function t(n){this.options=$.extend({},a,n?n:{}),e&&e.close(),this.view()}var e=null,o=1,i=999900,a={type:"load",time:!1,shade:!0,shadeClose:!0,html:"",animation:!1,unload:!0,align:"center",buttons:[{name:"取消",callback:function(){}},{name:"确认",callback:function(){}}],init:function(){},closeFn:function(){}};t.prototype.view=function(){var n=this,t=n.options,e=t.type,a=t.html,l=$('<div class="xcy-layer"></div>'),c="",s="",d=t.align,h={};n.$el=l,("load"==e||"tip"==e)&&(s+="load"==e?'<div class="xcy-load"> </div><div class="xcy-text">'+a+"</div>":a,c='<div class="xcy-load-box">'+s+"</div>"),("confirm"==e||"alert"==e)&&($.each(t.buttons,function(n,t){s+='<div class="xcy-btn">'+t.name+"</div>"}),c='<div class="xcy-box"><div class="xcy-con">'+a+'</div><div class="xcy-btns">'+s+"</div></div>"),l.html("page"==e?a:'<div class="xcy-main"><div class="xcy-section">'+c+"</div></div>"),t.shade&&(n.$shade=$('<div class="xcy-shade"></div>'),n.$shade.attr("id","xcy-layer-"+o++),$("body").append(n.$shade),n.$shade.css({zIndex:i++})),t.animation&&l.addClass(t.animation+"in"),l.attr("id","xcy-layer-"+o++),$("body").append(l),n.action(),"center"==d?h={marginTop:-(n.$el.height()/2),marginLeft:-(n.$el.width()/2),left:"50%",top:"50%"}:"bottom"==d||"top"==d?(h[d]=0,h.width="100%"):("left"==d||"right"==d)&&(h[d]=0,h.top=0,h.height="100%"),h.zIndex=i++,n.$el.css(h)},t.prototype.action=function(){{var n=this,t=n.options,e=(t.type,t.time);t.html}e!==!1&&(1==e&&(e=1200),setTimeout(function(){n.close()},e)),t.shade&&n.$shade.on("click touchmove",function(){n.close()}),$btns=$(".xcy-btn",n.$el),0!==$btns.length&&$(".xcy-btn",n.$el).each(function(e){var o=$(this),i=t.buttons[e];o.click(function(){callback=i.callback?i.callback(o.text()):null,callback!==!1&&n.close()})}),t.init()},t.prototype.close=function(){var n=this,t=n.options;t.unload?t.animation?n.animate(n.unload):n.unload():t.animation?n.animate(n.hide):n.hide(),e=null,t.closeFn()},t.prototype.animate=function(n){var t=this,e=t.options;t.$el.removeClass(e.animation+"in"),t.$el.addClass(e.animation+"out"),t.$el.on("webkitAnimationEnd",function(){t.$el.removeClass(e.animation+"out"),n.apply(t),t.$el.off()})},t.prototype.unload=function(){var n=this,t=n.options;n.$el.find(".xcy-load").removeClass("xcy-load"),$(".xcy-btn",n.$el).off("click"),n.$el.remove(),t.shade&&(n.$shade.off("click touchmove"),n.$shade.remove()),n.options=null},t.prototype.show=function(){{var n=this;n.options}e&&e.close(),n.$el.show(),n.$shade&&n.$shade.show(),e=n},t.prototype.hide=function(){{var n=this;n.options}n.$el.hide(),n.$shade&&n.$shade.hide()};var l={create:function(n){return e=new t(n)},load:function(n,o,i){return e=new t({html:n,time:void 0!==o?o:1200,shadeClose:i?i:!1})},confirm:function(n,o,i,a){return e=new t({type:"confirm",html:n,shadeClose:a?a:!1,buttons:[{name:"取消",callback:i},{name:"确认",callback:o}]})},alert:function(n,o,i){return e=new t({type:"alert",html:n,shadeClose:i?i:!1,buttons:[{name:"确认",callback:o?o:function(){}}]})},tip:function(n,o,i,a){return e=new t({type:"tip",html:n,time:"number"==typeof o?o:1200,shadeClose:"boolean"==typeof i?i:!0,closeFn:a?a:function(){}})},page:function(n,o,i){return e=new t({type:"page",html:n,callback:o,shadeClose:i?i:!0})},config:function(n){a=$.extend(a,n?n:{})}};"function"==typeof define?define(function(){return l}):n.Dialog=l}(window);