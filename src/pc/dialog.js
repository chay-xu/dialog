/**
 * @file dialog plugin
 * @author xucaiyu
 * @email 569455187@qq.com
 * @version 2.0.5
 * @date 2015-06-18
 * @license MIT License 
 */
 
/** 
  * {
  *     type: {string}
  *     contain: {string}
  *     html: {string}
  *     fun: {
  *         ok: {function},
  *         cancel: {function}
  *     }   
  * }
  */
  
;!(function(){  
// function Dialog( options ){
    var _cid = 1,
        _zIndex = 99999900,
        _zIndexc = 999900,
        layers = [],
        _isIE = !-[1,],
        _isIE6 = _isIE && !window.XMLHttpRequest,
        $doc = $( document ),
        $win = $( window ),
        Default = {
            className: '',
            container: 'body',
            // css: {},
            css: { padding: '10px' },
            html: '加载中...',
            value: '',
            title: '信息',
            left: '50%',
            top: '50%',
            src: 'about:blank',
            scrolling: 'auto',
            align: 'center',
            animate: false,
            animateAlign: 'bottom',
            winBtn: true,
            buttons: [
                {
                    name: '确定',
                    callback: function(){},
                    disabled: false,
                    focus: false
                }
                // ,
                // {
                //     name: '取消',
                //     callback: function(){},
                //     disabled: false,
                //     focus: false
                // }
            ],
            closeBtn: function(){},         // 关闭图层执行
            beforeFn: function(){},         // 初始化之前执行函数
            onloadFn: function(){},         // iframe 页面加载完成执行
            afterFn: function(){},          // 初始化之后执行函数
            shade: true,
            shadeClose: false,
            unload: true,
            delay: false,
            opacity: 0.5,
            fixed: false,
            isMove: true,
            resize: true,
            drag: {
                limit: true,
                range: [ 0, 9999, 9999, 0 ],
                // client: false,
                lockX: false,
                lockY: false,
                onStart: function(){},
                onMove: function(){},
                onEnd: function(){}
            }
        },
        dialogHtml;

    dialogHtml = ''
    // +'<div class="xcy-warpper">'
    +    '<table class="xcy-table xcy-warpper">'
    +        '<tbody>'
    +            '<tr>'
    +                '<td class="xcy-tl xcy-resize-item" id="xcy-resize-tl"></td>'
    +                '<td class="xcy-tc xcy-resize-item" id="xcy-resize-tc"></td>'
    +                '<td class="xcy-tr xcy-resize-item" id="xcy-resize-tr"></td>'
    +            '</tr>'
    +            '<tr>'
    +                '<td class="xcy-cl xcy-resize-item" id="xcy-resize-cl"></td>'
    +                '<td class="xcy-cc">'
    +                    '<div class="xcy-layer">'
    +                    '</div>'
    +                '</td>'
    +                '<td class="xcy-cr xcy-resize-item" id="xcy-resize-cr"></td>'
    +            '</tr>'
    +            '<tr>'
    +                '<td class="xcy-bl xcy-resize-item" id="xcy-resize-bl"></td>'
    +                '<td class="xcy-bc xcy-resize-item" id="xcy-resize-bc"></td>'
    +                '<td class="xcy-br xcy-resize-item" id="xcy-resize-br"></td>'
    +            '</tr>'
    +        '</tbody>'
    +    '</table>';
    // +'</div>';

    // support unit
    var support = {
        /**
         * layers 层级冒泡 将被点击层提升z-index最高
         * @param {string|number} dialog对象_cid
         */
        sort: function( cid ){
            var len = layers.length,
                j, _cid, _zIndex;

            for( j = 0; j < len; j++ ){
                // bubble key position
                if( layers[ j ]._cid == cid ){
                    // 如果是最后1位开始重新渲染
                    if( j == len - 1 ){
                        // if no change 如果原始位置就在最后1位立即返回
                        if( !_cid ) return;
                        // change z-inde style
                        $.each( layers, function( i, obj ){
                            obj.$el.css( 'zIndex', obj._zIndex );
                            obj.$proxy.css( 'zIndex', obj._zIndex );
                            obj.$shade && obj.$shade.css( 'zIndex', obj._zIndex );
                        });

                        return;
                    }

                    // bubble
                    _cid = layers[ j ];
                    _zIndex = layers[ j+1 ]._zIndex;

                    layers[ j ] = layers[ j+1 ];
                    layers[ j+1 ] = _cid;

                    layers[ j ]._zIndex = layers[ j+1 ]._zIndex;
                    layers[ j+1 ]._zIndex = _zIndex;

                }
                
            }
        },
        /**
         * px and % to value of number
         * @param {string|number} value 转换值
         * @param {string|number} max value 最大值
         * @return {number}
         */
        toNumber: function( value, maxValue ){
            if (!value && value !== 0 || typeof value === 'number') {
                return value;
            }

            var last = value.length - 1;
            if ( value.lastIndexOf('px') === last - 1 ) {
                value = parseInt(value);
            } else if ( value.lastIndexOf('%') === last ) {
                if( !maxValue ) maxValue = 100;
                value = parseInt( maxValue * value.split('%')[0] / 100 );
            }

            return value;
        },
        /** 
         * window resize ie6~7 bug
         * @param {Function} callback 回调函数 
         * @param {Integer} delay   延迟时间，单位为毫秒(ms)，默认150 
         * @param {Object} context  上下文，即this关键字指向的对象，默认为null 
         * @return {Function} 
         */ 
        debounce: function( callback, delay, context ){
            if (typeof(callback) !== "function") {  
                return;  
            }

            delay = delay || 150;  
            context = context || null;  
            var timeout,
                runIt = function(){
                    callback.apply(context);  
                };  
            return (function(){
                window.clearTimeout(timeout);  
                timeout = window.setTimeout(runIt, delay);  
            });  
        }    
    };

    function DialogLayer( options ){
        var that = this,
            $el, opt;

        /**
         * mix param
         * drag css dialog
         */
        
        // // drag
        // var _drag = $.extend( {}, Default.drag, options.drag );
        // // css
        // that.css = $.extend( {}, Default.css, options.css );
        // dialog
        opt = $.extend( true, {}, Default, options );
        var _drag = opt.drag;
        that.css = opt.css;

        that.options = opt;
        that.type = opt.type;

        // dialog parent
        // that.$parent = $( opt.fixed ? 'body' : opt.container );
        
        that.$parent = (typeof opt.container === 'string') ? $( opt.container ) : opt.container;
        if( this.$parent.length == 0 ) that.$parent = $('body');
        // dialog warpper
        that.$el =  $( dialogHtml );
        that.$el.addClass( opt.className );

        // fixed or limit choose
        that._isBody = (this.$parent[0].nodeName == 'BODY');
        if( (opt.fixed && !that._isBody) || that.type == 'msg' ) 
            that.options.isMove = false;

        // private
        that._cid = _cid++;
        that._zIndex = _zIndex++;

        // type layer id array
        that.$elArr = [];
        // init function 初始化之前执行的自定义函数
        opt.beforeFn.apply( this );

        that.init( _drag );
        // save global dialog
        layers.push( this );

        // init function 初始化之后执行的自定义函数
        opt.afterFn.apply( this );
        options = null;
    }
    // dialog
    DialogLayer.prototype = {
        v: '2.0.5',
        constructor: DialogLayer,
        init: function( _drag ){
            var that = this,
                opt = that.options,
                title = opt.title,
                html = opt.html,
                showShade = that.type == 'shade' || opt.shade,
                $el = that.$el,
                resize = opt.resize,
                $tit, id;

            // shade layer
            if( showShade ){
                id = 'shade-layer-'+ that._cid;

                that.$elArr.push( '#'+id );

                // that.shadeEvent( that.parent, id );
                that._shadeHtml( id );
                opt.shadeClose && that._bindShadeClose();
            }
            switch( that.type ){
                case 'load':
                    id = 'load-layer-'+ that._cid;

                    that._layerHtml( false, html, false );
                    break;
                case 'confirm':
                    id = 'confirm-layer-'+ that._cid;

                    that._layerHtml( title, html, opt.buttons );
                    break;
                case 'prompt':
                    id = 'prompt-layer-'+ that._cid;

                    that._layerHtml( title, html, opt.buttons );
                    break;
                case 'alert':
                    id = 'alert-layer-'+ that._cid;

                    that._layerHtml( title, html, opt.buttons );
                    break;
                case 'msg':
                    id = 'msg-layer-'+ that._cid;
                
                    that._layerHtml( title, html, false );
                    break;
                case 'iframe':
                    id = 'iframe-layer-'+ that._cid;

                    that._layerHtml( title, true, false );
                    break;
                default:
                    id = 'page-layer-'+ that._cid;
                
                    that._layerHtml( title, html, false );
            }
            // push id
            that.$elArr.push( '#'+id );

            // set id
            $el.attr( 'id', id );

            // append drag proxy
            that.$proxy = $('<div class="xcy-proxy xcy-proxy-hidden"><div class="xcy-title xcy-drag"><span>'+title+'</span></div></div>').css({
                width: that.warpperWidth,
                height: that.warpperHeight,
                top: that.top,
                left: that.left,
                zIndex: that._zIndex
            })
            that.$parent.append( that.$proxy );

            // container is body
            // if( that.$parent[0].nodeName == 'BODY' ){
                // fixed position
                // layer滚动
                if( opt.fixed ){
                    // parent is body
                    if( that._isBody ){
                        
                        // ie6的固定与相对定位 fixed
                        if( _isIE6 ){
                            that._ie6Fix = that._topFixed( $win );
                            $win.bind( 'scroll', that._ie6Fix );
                        }else{
                            that.$el.addClass( 'xcy-fixed' );
                            that.$proxy.css( 'position', 'fixed' );
                        }

                    // parent is not body
                    }else{
                        // container fixed
                        that._ie6Fix = that._topFixed( that.$parent );
                        // scroll event
                        that.$parent.bind( 'scroll', that._ie6Fix );
                    }
                }
                // set shade layer the height
                // $( '#shade-layer-' + that._cid ).css( 'height', that.$parent[0].scrollHeight );
            // }

            // ie6 bug
            if( _isIE6 ){
                // iframe mask ie6 select tag bug
                that._ie6SelectFix();
            }

            // fixed and no move bind resize event of dialog
            // 窗口大小改变事件
            if( resize && (opt.fixed || !opt.isMove) ){
                that._winResize = function(){

                    opt.isMove && that._dragObj._size();
                    // 获取layer位置
                    var ph = that.parentHeight - that.warpperHeight,
                        pw = that.parentWidth - that.warpperWidth,
                        t = Number(that.top)/ph,
                        l = Number(that.left)/pw;

                    // debounce 防止resize执行过于频繁
                    support.debounce( function(){
                        
                        that._getParentSize();
                        // 刷新窗口重新计算layer位置
                        var nph = that.parentHeight - that.warpperHeight,
                            npw = that.parentWidth - that.warpperWidth,
                            top = Math.round( t*nph ),
                            left = Math.round( l*npw );

                        // set layer css
                        that.$el.css( that._setCss( top, left ) );
                        // set proxy css
                        that.$proxy && that.$proxy.css({
                                top:  top,
                                left: left 
                            })
                        // set shade css
                        if( showShade ){
                            that._shadeCss( $( that.$elArr[0] ) );
                        }
                    })();
                    // that.$parent.scroll();
                };

                if( that._isBody ){
                    $win.bind( 'resize', that._winResize );
                }else{
                    // this.$parent.bind( 'resize', that._winResize );
                }
            }

            // restore 记住原始大小和位置
            that._restore = {top: that.top, left: that.left, height: that.height, width: that.width };

            // drag layer move
            if( opt.isMove ){   
                // var timeStep;          
                // set drag value
                $.extend( _drag, {
                    selector: that.$proxy,
                    container: opt.container,
                    fixed: opt.fixed,
                    target: $('.xcy-title', $el),
                    isBody: that._isBody
                })
                _drag.onStart = function( $drag ){
                    // $drag.css({ top: that.top, left: that.left })
                    $el.hide();
                };
                var onMove = _drag.onMove;
                _drag.onMove = function( t, l ){
                    // clearTimeout(timeStep)
                    // showProxy()
                    that.top = t;
                    that.left = l;
                    onMove( t, l );
                };
                _drag.onEnd = function( t, l ){
                    that.$el.css({ top: t, left: l })
                    // set _restore 修改原始位置
                    that._restore.top = t;
                    that._restore.left = l;
                    $el.show();
                };

                // drag drop init
                that._dragObj = new DragDrop( _drag );
            }
            // 层级冒泡排序
            $el.bind('mousedown', function(){
                // bubble z-index, set drag ladyer z-index
                support.sort( id.split( '-' )[2] );
            })
            
            // 监控加载状态
            if( that.$iframe ){
                var iframe = that.$iframe[0];
                if( iframe.attachEvent ){
                    iframe.attachEvent( "onload", function(){
                        opt.onloadFn && opt.onloadFn();
                        iframe.detachEvent( "onload", arguments.caller);
                    });
                }else{
                    iframe.onload = function(){
                        opt.onloadFn && opt.onloadFn();
                        iframe.onload = null;
                    };
                }
                // iframe层级冒泡排序
                // $(that.$iframe[0].contentDocument).bind('mousedown', function(){
                //     // bubble z-index, set drag ladyer z-index
                //     that.$el.mousedown();
                // })
            }

            // auto hidden
            if( opt.delay )
                that.timer = setTimeout( function(){ that._autoClose(); }, typeof opt.delay === 'boolean' ? 1800 : opt.delay );

            // resize
//             $el.addClass('xcy-resize');
//             $el.delegate('.xcy-resize-item', 'mousedown', function(){
//                 var $me = $(this),
//                     id = $me.attr('id'),
//                     // h = $win.innerHeight(),
//                     // w = $win.innerWidth();
//                     parentOffset = that.$parent.offset(),
//                     parentTop = parentOffset.top,
//                     parentLeft = parentOffset.left;
//                     // oldLeft = that.left;
//                     that.$proxy.css({
//                         top: that.top,
//                         left: that.left
//                     })

//                 var offset = that.$proxy.offset(),
//                     top = offset.top,
//                     left = offset.left,
//                     width = that.$proxy.width(),
//                     height = that.$proxy.height();

//                     // $(document).bind( 'mousemove', handleResize );
//                     // $(document).bind( 'mouseup', unResize)
                    
//                     function handleResize( e ){
//                         var type = e.type;

//                         // var offset = $proxy.offset(),
//                         //     top = offset.top,
//                         //     left = offset.left;

//                         // window capture focus
//                         if( _isIE ){
//                             $me.bind( 'losecapture', that._end );
//                             $me[0].setCapture();
//                         }else{
//                             $doc.bind( 'blur', that._end );
//                         }

//                         // clear selected text
//                         window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

//                         switch(id){
//                             case 'xcy-resize-tl':
//                                 break;
//                             case 'xcy-resize-tc':
//                                 break;
//                             case 'xcy-resize-tr':
//                                 break;
//                             case 'xcy-resize-cl':
//                                 // console.log(left, oldLeft);
//                                 if(e.clientX < parentLeft) return;
//                                 if(e.clientX > left+width-150) return;
// console.log(left );
//                                 // var cssPosition = that._dragObj.range(top, e.clientX - parentLeft, width + (left - e.clientX), height) 
//                                 that.$proxy.css({
//                                     display: 'block',
//                                     left: cssPosition.left,
//                                     width: cssPosition.width
//                                 })
//                                 // that.resize( (that.width + that.left - e.clientX)+left, that.height, that.top, e.clientX-left)
//                                 break;
//                             case 'xcy-resize-cr':
//                                 if(e.clientX > that.parentWidth + left-6) return;
//                                 console.log(e.clientX - that.left);
//                                 // that.resize( e.clientX - (that.left) - left, that.height, that.top, that.left)
//                                 break;
//                         }
                        
//                         // if(e.clientX <= 20) return;

//                         // that.resize( (that.width + that.left - (e.clientX ))+20, that.height, that.top, e.clientX-20)
//                         // console.log(that.left, e.clientX, that.$parent.offset().left)

//                         return false;
//                     }

//                     function unResize(){
//                         $(document).unbind( 'mousemove', handleResize );
//                         $(document).unbind( 'mouseup', unResize );

//                         var offset = that.$proxy.position();
//                         console.log(offset.top, offset.left, '---++++---')

//                         that.resize( that.$proxy.width(), that.$proxy.height(), offset.top, offset.left, true )
//                         that.$proxy.hide();
//                     }
//             })

        },
        _autoClose: function(){
            var that = this,
                len = that.$elArr.length - 1;

            that.closed = true;

            $.each( that.$elArr, function( i, v ){
                $( v ).animate({opacity: '0'}, 800, function(){ 
                    i == len && that.close(); 
                });
            });
        },
        _bindShadeClose: function( parent ){
            var that = this,
                $el = $( '.xcy-shade', that.$parent );

            $el && $el.bind( 'click', function( e ){
                if( that.closed ) return;
                that.close();
            });
        },
        _getContent: function(){

            return $( '.xcy-content', this.$el );
        },
        _getTitle: function(){

            return $( '.xcy-title', this.$el );
        },
        _getFoot: function(){

            return $( '.xcy-foot', this.$el );
        },
        // html render
        _layerHtml: function( title, content, buttonArr ){
            var that = this,
                opt = that.options,
                type = that.type,
                $el = that.$el,
                cssObj = that.css,
                isTitle = title !== false,
                tit, con, btn, winBtn,
                animateCss, animateAlign;

            opt.title = title;
            // get parent size 
            that._getParentSize();
            // title
            if( isTitle ){
                
                tit = that._titHtml( title );
                
                // render title
                $( '.xcy-layer', $el ).append( tit );
            }

            // content
            if( type == 'load' ){

                con = that._loadHtml( content );
            }else if( type == 'iframe' ){
                
                con = that._iframeHtml( opt.src );           
            }else{
                if( type == 'prompt' ){
                    con = that._conHtml( '<div class="xcy-text">'
                        + '</div><input class="xcy-input" type="text" value=\"' + opt.value + '\" />' );

                    con.find( '.xcy-text' ).html( content );
                }else{
                    con = that._conHtml( content );
                }

                // 宽高设置xcy-main层
                // 自定义css 设置在xyc-main-inner层
                $( '.xcy-main', con ).css( cssObj ); 
            }

            // render content
            $( '.xcy-layer', $el ).append( con );

            // append dialog
            // 按钮要焦点 需要先渲染
            that.$parent.append( $el );

            // buttons element
            if( buttonArr ){
                btn = that._btnHtml( buttonArr );

                // render buttons
                $( '.xcy-layer', $el ).append( btn );
            }

            // window controll buttons
            if( type !== 'load' && opt.closeBtn ){
                winBtn = that._winBtnHtml( type );
                // render window buttons
                $( '.xcy-layer', $el ).append( winBtn );

            }   
            // 转换宽高为数字
            that._toNumberW( opt.width );
            that._toNumberH( opt.height );      

            // set content css
            that._setCssSize( that._getContent() );

            // get warpper size
            that._getWarpperSize( $el );

            // set warpper css position
            if( opt.animate ){
                animateCss = {};
                animateAlign = opt.animateAlign;
                // console.log(that.warpperWidth, that.parentWidth)
                if( animateAlign == 'bottom' ){
                    animateCss = {
                        top: that.parentHeight + that.warpperHeight,
                        left: support.toNumber(opt.left, that.parentWidth - that.warpperWidth)
                    }
                }else if( animateAlign == 'top' ){
                    animateCss = {
                        top: -that.parentHeight,
                        left: support.toNumber(opt.left, that.parentWidth - that.warpperWidth)
                    }
                }else if( animateAlign == 'left' ){
                    animateCss = {
                        top: support.toNumber(opt.top, that.parentHeight - that.warpperHeight),
                        left: -that.warpperWidth
                    }
                }else if( animateAlign == 'right' ){
                    animateCss = {
                        top: support.toNumber(opt.top, that.parentHeight - that.warpperHeight),
                        left: that.parentWidth + that.warpperWidth
                    }
                }
                $el.css( animateCss );

                $el.animate( that._setCss(opt.top, opt.left), opt.delay );
            }else{
                $el.css( that._setCss(opt.top, opt.left), opt.delay );
            }

            // button focus
            try {
                if( buttonArr ) that.$focus.focus();
            }catch( e ){}
        },
        // shade html
        _shadeHtml: function( id ){
            var that = this,
                shade = $( '<div class="xcy-shade" id=\"'+ id +'\"></div>' );

            that._shadeCss( shade );
            that.$shade = shade;
            // set id
            // shade.css( { width: width, height: height, opacity: opacity, 'z-index': that._zIndex } );

            that.$parent.append( shade );
        },
        _shadeCss: function( el ){
            var that = this,
                opacity = that.options.opacity,
                isBody = that._isBody,
                width = isBody ? $('body').outerWidth() : that.$parent[0].scrollWidth,
                height = isBody ? $doc.innerHeight() : that.$parent[0].scrollHeight;

            // that._getParentSize();
            // set shade css
            el.css( { width: width, height: height, opacity: opacity, 'z-index': that._zIndex } );
        },
        // load html
        _loadHtml: function( html ){
            var that = this,
                opt = that.options,
                node = $( '<div class="xcy-load"><span class="xcy-load-img"></span><span>'+html+'</span></div>' );

            // 转换宽高为数字
            that._toNumberW( opt.width );
            that._toNumberH( opt.height ); 
            // set content css
            that._setCssSize( node );

            return node;
        },
        _iframeHtml: function( src ){
            var that = this,
                opt = that.options,
                $iframe = $('<iframe allowtransparency="true" frameborder="0" class="xcy-iframe" name="xcy-iframe-' 
                    + that._cid +'"  src="'+src+'" scrolling="'+opt.scrolling+'"></iframe>');

                // 添加 iframe 对象
                that.$iframe = $iframe;

            return that._conHtml( '' ).html( $iframe );
        },
        // content html
        _conHtml: function( html ){
            var that = this,
                opt = that.options,
                node = $( '<div class="xcy-content"><div class="xcy-main"></div></div>' ),
                display, prev, next, parent;

            // element remove save node info 
            if( html && html.nodeType === 1 ){
                display = html.style.display;
                prev = html.previousSibling;
                next = html.nextSibling;
                parent = html.parentNode;
                that._elemBack = function () {
                    if (prev && prev.parentNode) {
                        prev.parentNode.insertBefore( html, prev.nextSibling);
                    } else if (next && next.parentNode) {
                        next.parentNode.insertBefore( html, next);
                    } else if (parent) {
                        parent.appendChild( html );
                    }
                    html.style.display = display;
                    that._elemBack = null;
                };
            }

            // set content html
            node.find( '.xcy-main' ).html( html );
            // add icon
            if( opt.icon ){
                node.addClass('xcy-icon-box')
                node.append('<div class="xcy-icon-default xcy-icon-'+opt.icon+'"></div>')
            }

            return node;
        },
        // title html
        _titHtml: function( title ){
            var that = this,
                node = $( '<div class="xcy-title"></div>' );

            node.append( '<span title=\"'+ title +'\">'+ title +'</span>' );

            return node;
        },
        // button html
        _btnHtml: function( buttonArr ){
            var that = this,
                node = $( '<div class="xcy-foot"></div>' ),
                html = '',
                len = buttonArr.length - 1;

            // button html
            $.each( buttonArr, function( i, v ){
                var disabled = v.disabled ? 'disabled' : '',
                    className = '';
                if( i === 0 ){
                    className = 'xcy-btn-r';
                }else if( i == len ){
                    className = 'xcy-btn-l';
                }else{
                    className = 'xcy-btn-m';
                }
                html += '<button class="xcy-btn '+ className +'" type="button" '+ disabled +'>'+ v.name +'</button>';
            });

            // button html
            node.html( html );
            // text align direction
            node.css( 'text-align', that.options.align );

            // bind callback event
            $( 'button', node ).each(function(i){
                var $ele = $( this ),
                    obj = buttonArr[ i ],
                    isReturn, callback, val;

                $ele.click(function( e ){
                    callback = obj.callback;
                    val = $( '.xcy-input', that._getContent() ).val();

                    // return callback
                    if( callback ) isReturn = callback( $ele.text(), val );

                    if( isReturn === false ){
                        return;
                    }else{
                        that.close();
                    }
                });

                // focus
                if( obj.focus && !obj.disabled ){
                    that.$focus = $ele;
                }
            })

            return node;
        },
        _winBtnHtml: function( type ){
            var that = this,
                opts = that.options,
                closeBtn = opts.closeBtn,
                winBtn = opts.winBtn,
                node = $( '<div class="xcy-winBtn"></div>' ),
                state = true,
                msgClass = 'xcy-close-btn';

            // min max
            if( type == 'iframe' && winBtn ){
                node.append( '<a class="xcy-winBtn-btn" id="xcy-min-btn" href="javascript:;">-</a>' );
                node.append( '<a class="xcy-winBtn-btn" id="xcy-full-btn" href="javascript:;">+</a>' );
            }
            // if type is msg or page, change close class
            if( ( type == 'msg' && opts.title === false ) || (type == 'page' && opts.title === false) )
                msgClass = 'xcy-x-btn';
            
            // close
            node.append( '<a class="xcy-winBtn-btn"  id=\"'+ msgClass +'\" href="javascript:;">×</a>' );

            $( 'a', node ).bind( 'click', function( e ){
                var id = $( this ).attr( 'id' ),
                    isReturn = true;

                switch( id ){
                    case 'xcy-close-btn':
                    case 'xcy-x-btn':
                        // return callback
                        if( closeBtn ) isReturn = closeBtn( that.title() );

                        if( isReturn === false ){
                            return;
                        }else{
                            that.close();
                        }
                        break;
                    case 'xcy-full-btn':
                        // if( state ){
                            that.full();
                            $( this ).attr( 'id', 'xcy-restore-btn' )
                            $( '#xcy-min-btn', that.$el ).show();
                            // state = false;
                        // }else{
                        //     $( '#xcy-min-btn', that.$el ).show();
                        //     that.restore();
                        //     state = true;
                        // }
                        break;
                    case 'xcy-restore-btn':
                        that.restore();
                        $( this ).attr( 'id', 'xcy-full-btn' )
                        $( '#xcy-min-btn', that.$el ).show();
                        break;
                    case 'xcy-min-btn':
                        $( this ).hide();
                        that.min();
                        $( this ).next().attr( 'id', 'xcy-restore-btn' )
                        break;
                }
            });

            return node;
        },
        _topFixed: function( parent ){
            var that = this,
                _top, Fix;

            // client top
            Fix = function(){
                
                support.debounce( function(){
                    that.$el.css({
                        top: that.top + parent.scrollTop(),
                        left: that.left + parent.scrollLeft()
                    })
                    // that.$el.animate({
                    //     top: that.top + parent.scrollTop(),
                    //     left: that.left + parent.scrollLeft()
                    // })  
                })();
            };

            return Fix;
        },
        // ie6 select not mask with div tag
        _ie6SelectFix: function(){
            var that = this,
                $el = that.$el,
                width = that.warpperWidth,
                height = that.warpperHeight,
                iframe;

            // iframe = $el.append(document.createElement('iframe'));
            iframe = document.createElement('iframe');
            iframe.src = 'about:blank;';
            iframe.style.cssText = 'position:absolute;z-index:-1;left:0;top:0;'
            + 'filter:alpha(opacity=0);border:0 none;width:' + width + 'px;height:' + height +'px;';

            $el.append( iframe );
        },
        // 宽度百分比转换数字
        _toNumberW: function( w ){
            var that = this,
                conW, //内容宽
                overW;

            // warpper 大小
            that._getWarpperSize( that.$el );

            that._getConWidth();
           
            // % percent conver to number
            if( w ){
                if( String(w).indexOf('%') !== -1 ){
                    conW = that.width;
                    overW = that.warpperWidth - conW;
                    w = support.toNumber( w, that.parentWidth -overW );
                }
                that.width = Number(w);
            }
        },
        // 高度百分比转换数字
        _toNumberH: function( h ){
            var that = this,
                conH, //内容宽
                overH;

            // warpper 大小
            that._getWarpperSize( that.$el );

            that._getConHeight();

            // % percent conver to number
            if( h ){
                if( String(h).indexOf('%') !== -1 ){
                    conH = that.height;
                    overH = that.warpperHeight - conH;
                    h = support.toNumber( h, that.parentHeight -overH );
                }
                that.height = Number(h);
            }
        },
        // set content css
        _setCssSize: function( el ){
            var that = this,
                cssObj = that.css;

            // 宽高分开渲染，不然高度受宽度影响获取值不对
            // that._toNumberW( w );
            el.css( { width: that.width, height: that.height } );

            // that._toNumberH( h );
            // el.css( { height: that.height } );
        },
        // set warpper css
        _setCss: function( t, l ){
            var that = this,
                opt = that.options,
                $parent = that.$parent,
                isBody = that._isBody,
                dt = 0,
                dl = 0,
                cssObj = {};

            if( opt.fixed && _isIE6 ){
                dt = isBody ? $doc.scrollTop() : that.$parent.scrollTop();
                dl = isBody ? $doc.scrollLeft() : that.$parent.scrollLeft();
            }

            // top
            if( t === undefined || t === '' ){
                t = '50%';
            }
            // top % to number
            t = support.toNumber( t, that.parentHeight - that.warpperHeight );
            that.top = t;

            // left
            if( l === undefined || l === '' ){
                l = '50%';
            }
            // left % to number
            l = support.toNumber( l, that.parentWidth - that.warpperWidth );
            that.left = l;

            cssObj[ 'z-index' ] = that._zIndex;

            cssObj[ 'top' ] = t + dt;
            cssObj[ 'left' ] = l + dl;

            return cssObj;
        },
        // 获取dialog content容器宽度
        _getConWidth: function(){
            var that = this;

            that.width = that._getContent().width();
        },
        // 获取dialog content容器高度
        _getConHeight: function(){
            var that = this;

            that.height = that._getContent().height();
        },
        // 获取dialog父级可视大小
        _getParentSize: function(){
            var that = this,
                opt = that.options,
                $parent = that.$parent,
                isBody = that._isBody;

            // this.parentWidth = isClient ? ( document.documentElement.clientWidth || document.body.clientWidth ) : $parent[0].clientWidth;
            // this.parentHeight = isClient ? ( document.documentElement.clientHeight || document.body.clientHeight ) : $parent[0].clientHeight;
            that.parentWidth = isBody ? $win.innerWidth() : $parent[0].clientWidth;
            that.parentHeight = isBody ? $win.innerHeight() : $parent[0].clientHeight;
        },
        // 获取dialog大小
        _getWarpperSize: function( el ){
            this.warpperWidth = el.outerWidth();
            this.warpperHeight = el.outerHeight();
        },
        min: function(){

            this.resize( '180', '0', this.top, this.left );
        },
        full: function(){

            this.resize( '100%', '100%', 0, 0 );
        },
        restore: function(){
            var that = this,
                restore = that._restore;

            that.resize( restore.width, restore.height, restore.top, restore.left );
        },
        title: function( title ){
            var el = this._getTitle().children( 'span' );

            var newTitle = title ? el.html( title ) : el.html();

            return title ? this : newTitle;
        },
        html: function( html ){
            this._getContent().html( html );

            return this;
        },
        buttons: function( buttonArr ){
            $( 'button', this.$el ).unbind( 'click' );
            this._getFoot().replaceWith( this._btnHtml( buttonArr ) );

            return this;
        },
        resize: function( w, h, t, l, isdrag ){
            var that = this,
                offL = parseInt( that.$el.css( 'left' ) ),  //left
                offT = parseInt( that.$el.css( 'top' ) ),
                conW, conH, //内容宽
                diffH, diffW,
                overH, overW,
                left, top, box;

            // restore
            // that._restore = {top: that.top, left: that.left, height: that.height, width: that.width };

            // 宽高转换数字
            that._toNumberW( w );
            that._toNumberH( h );

            conW = that.width, //内容宽
            conH = that.height,

            this.options.height = h;
            this.options.width = w;            

            // 除内容外的宽度/2
            // diffW = (conW - w)/2;
            // diffH = (conH - h)/2;
            // // exist l and t 指定位置
            // // no exist [ offL + diffW ]
            // left = l !== undefined ? l : offL + diffW;
            // top = t !== undefined ? t : offT + diffH;
           
            // t = that.oTop;
            // l = that.oLeft;
            
// console.log( that._restore );

            // set content css
            that._setCssSize( that._getContent() );
            // reset warpper size
            that._getWarpperSize( that.$el );
            // exist l and t 指定位置
            // no exist [ offL + diffW ]
            box = that._setCss( t, l );
            top = box.top;
            left = box.left;

            that.$proxy.css({
                left: left,
                top: top,
                width: that.warpperWidth,
                height: that.warpperHeight
            })

            // move positon
            // if( !this._dragObj || isdrag ){
                console.log( top, left, that.warpperHeight, that.warpperWidth )
                // that.$el.css( that._setCss( top, left ) );
                that.$el.css({
                    top: top,
                    left: left
                });
            // }else{
                // that._dragObj._move( top, left, that.warpperHeight, that.warpperWidth );
                // that._dragObj._end( top, left );
            // }

            return this;
        },
        moveTo: function( t, l ){
            var that = this;

            // % percent conver to number
            t = support.toNumber( t, that.parentHeight );
            l = support.toNumber( l, that.parentWidth );

            // get drag layer limit range
            if( !this._dragObj ){
                box = that._setCss( t, l );
            }else{
                box = that._dragObj.range( t, l, that.warpperWidth, that.warpperHeight );
            }

            // set warpper css
            that.$el.css( that._setCss( box.top, box.left ) );

            return this;
        },
        setDrag: function( o ){
            if( !this._dragObj ) return this;

            this._dragObj.set( o );

            return this;
        },
        hide: function(){
            $.each( this.$elArr, function( i, v ){
                $( v ).hide();
            })

            return this;
        },
        show: function(){
            $.each( this.$elArr, function( i, v ){
                $( v ).show();
            })

            return this;
        },
        close: function(){
            var that = this;

            if( that.timer ){
                clearTimeout( that.timer )
                that.timer = null;
            }
            that.closed = null;

            // not unload
            if( !that.options.unload ){
                that.hide();
                return;
            }

            // unload
            that.unload();
        },
        unload: function(){
            var that = this, t;

            // unbind input buttons click event
            $( 'button', that.$el ).unbind( 'click' );
            $( '.xcy-winBtn a', that.$el ).unbind( 'click' );
            that.$el.unbind( 'mousedown' );

            // unbind window event
            if( that._winResize ){
                $win.unbind( 'resize', that._winResize );
            }
            if( that._ie6Fix ){
                $win.unbind( 'scroll', that._ie6Fix );
                that.$parent.unbind( 'scroll', that._ie6Fix ); 
            }
            
            // unbind shade
            that.options.shadeClose && $( '.xcy-shade', that.$parent ).unbind( 'click' );

            // unbind drag click event
            that.options.isMove && that._dragObj.disable();
            // if html is element, back move position
            that._elemBack && that._elemBack();

            // 低版本ie 内存回收 iframe
            if( that.type === 'iframe' ){
                try {
                    var iframe = that.$iframe[0];
                    iframe.contentWindow.document.write('');
                    iframe.contentWindow.close();
                    that.$iframe.remove();
                } catch(e){}
            }
            // remove dom
            $.each( that.$elArr, function( i, v ){
                $( v ).remove();
            })
            that.$elArr = null;
            that.$proxy.remove();
            that.$proxy = null;

            // delete global array object
            t = layers.length;
            while( t-- ){
                if( layers[ t ]._cid === this._cid ){
                    layers.splice( t, 1 );
                }
            }

        },
        closeAll: function(){
            $.each( layers, function( i, v ){
                v.close();
            })
        }
    }

    // drag layer
    var DragDrop = (function( options ){

        /**
         * [dragdrop description]
         * @param  {[type]} options [description]
         * @return {[type]}         [description]
         */
        function dragdrop( options ){
            var that = this;

            that.diffx = 0;
            that.diffy = 0;
            that.options = options;
            that.$drag = typeof options.selector === 'string' ? $( options.selector ) : options.selector;
            that.$target = typeof options.selector === 'string' ? $( options.target ) : options.target;
            that._handleEvent = _handleEvent;

            that._init();

            // handle event
            function _handleEvent( e ){
                var type = e.type,
                    _self = that,
                    $target = $( e.target ),
                    className = that.$target.attr('class'),
                    $el;

                // target is tit childer
                if( $target.parents( '.xcy-drag' ).length !== 0 ){
                    $el = $target.parents( '.xcy-drag' );
                // target is tit
                }else{
                    $el = $target;
                }

                switch( type ){
                    case 'mousedown':
                        // bind start event
                        that.options.onStart( that.$drag );

                        if( $el.hasClass( 'xcy-drag' ) ){

                            that.$drag.removeClass('xcy-proxy-hidden');
                            // console.log(that.$target[0].getBoundingClientRect())
                            // mouse clientx - drag layer offset left
                            that.diffx = e.clientX - that.$drag[0].offsetLeft;
                            that.diffy = e.clientY - that.$drag[0].offsetTop;
                            // afresh size
                            that._getOffSize();
                   
                            // clear selected text
                            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                            
                            // window capture focus
                            if( _isIE ){
                                that.$drag.bind( 'losecapture', that._end );
                                that.$drag[0].setCapture();
                            }else{
                                $doc.bind( 'blur', that._end );
                            }

                            $doc.bind( 'mousemove', that._handleEvent );
                            $doc.bind( 'mouseup', that._handleEvent );

                            e.preventDefault();
                        }
                        break;
                    case 'mousemove':
                        var l = e.clientX - that.diffx,
                            t = e.clientY - that.diffy;

                        that._move( t, l, that.dragH, that.dragW );

                        e.preventDefault();
                        break;
                    case 'mouseup':
                        // dragable proxy hidden
                        that.$drag.addClass('xcy-proxy-hidden');

                        that._end();
                        break;
                }
            }
        }
        dragdrop.prototype = {
            _init: function(){
                var that = this;

                that._size();

                // $tit.attr( 'data-move', 'true' );
                // $tit.css( 'cursor', 'move' );
                that.$target.addClass( 'xcy-drag' );
                // mousedown event
                that.$target.bind( 'mousedown', that._handleEvent );
            },
            _getActive: function () {
                try {// try: ie8~9, iframe bug
                    var activeElement = document.activeElement,
                        contentDocument = activeElement.contentDocument,
                        elem = contentDocument && contentDocument.activeElement || activeElement;
                    return elem;
                } catch (e) {}
            },
            _size: function(){
                var that = this,
                    opt = that.options,
                    range = opt.range,
                    $container;

                // limit range
                if( !opt.limit ) return;

                that.mxT = range[0];
                that.mxR = range[1] !== undefined ? range[1] : range[0];
                that.mxB = range[2] !== undefined ? range[2] : range[0];
                that.mxL = range[3] !== undefined ? range[3] : range[1] ? range[1] : range[0];

                // that.marginL = parseInt( that.$parent.css( 'marginLeft' ) );
                // that.marginT = parseInt( that.$parent.css( 'marginTop' ) );

                that._getOffSize();

                // container
                // if( opt.container ){
                    // $container = opt.fixed ? $( 'body' ) : $( opt.container );
                    $container = $( opt.container );

                    // client element 可视范围dom对象
                    if( !opt.fixed && opt.isBody ){
                        // scroll range value值
                        that.h = $doc.outerHeight();
                        that.w = $doc.outerWidth();

                    }else if( opt.fixed && opt.isBody ){
                        that.h = $win.innerHeight();
                        that.w = $win.innerWidth();

                    }else{
                        // client range value值
                        that.h = $container[0].scrollHeight;
                        that.w = $container[0].scrollWidth;
                    }

                    // container css style position
                    $container.css( 'position' ) == 'relative' && $container.css( 'position', 'relative' );

                // }

                // lock x axis
                if( opt.lockX ) that.mxR = that.mxL = that.left;
                // lock y axis
                if( opt.lockY ) that.mxT = that.mxB = that.top;
            },
            _getOffSize: function(){
                var that = this;

                // get parent width and height value
                that.dragW = that.$drag.outerWidth();
                that.dragH = that.$drag.outerHeight();
                // left top
                that.left = parseInt( that.$drag.css( 'left' ) );
                that.top = parseInt( that.$drag.css( 'top' ) );

                // reprai 修正右下limit range值
                // limit right值: 右限制最大值
                // limit left值 + 拖动容器width值: 右限制范围最小值
                that.mxR = Math.max( that.mxR, that.mxL + that.dragW );
                that.mxB = Math.max( that.mxB, that.mxT + that.dragH );
            },
            _move: function( t, l, dragH, dragW ){
                var that = this,
                    position, left, top;

                // left and top value
                position = that.range( t, l, dragW, dragH );
                left = position.left;
                top = position.top;

                that.$drag.css( { 'left': left, 'top': top } );
                that.left = left;
                that.top = top;

                that.options.onMove( top, left );
            },
            // drag end, unbind event
            _end: function(){
                var that = this;

                $doc.unbind( 'mousemove', that._handleEvent );
                $doc.unbind( 'mouseup', that._handleEvent );

                if( _isIE ){
                    that.$drag.unbind( 'losecapture', that._end );
                    that.$drag[0].releaseCapture();
                }else{
                    $doc.unbind( 'blur', that._end );
                }

                that.options.onEnd(that.top, that.left);
            },
            range: function( t, l, dragW, dragH ){
                var that = this,
                    opt = that.options,
                    obj = {},
                    mxT, mxR, mxL, mxB;

                // scroll top
                // if( !opt.fixed ){
                //     st = $doc.scrollTop();
                //     sl = $doc.scrollLeft();
                // }

                if( opt.limit ){

                    mxT = that.mxT;
                    mxR = that.mxR;
                    mxL = that.mxL;
                    mxB = that.mxB;

                    if( opt.container ){
                        // [ limit range , container range ] 容器最小活动范围
                        mxT = Math.max( that.mxT, 0 );
                        mxR = Math.min( that.w - dragW, that.mxR - dragW );
                        mxL = Math.max( that.mxL, 0 );
                        mxB = Math.min( that.h - dragH, that.mxB - dragH );
                    }

                    // 获取drag时正确的范围值
                    l = Math.max(Math.min( l, mxR ), mxL );
                    t = Math.max(Math.min( t, mxB ), mxT );
                }

                obj.left = l;
                obj.top = t;
                obj.width = dragW;
                obj.height = dragH;

                return obj;
            },
            // set attribute options
            set: function( options ){
                var that = this;

                options && $.extend( that.options, options );
                that._size();
            },
            // bind event
            enable: function(){
                var that = this;

                that.$drag.bind( 'mousedown', that._handleEvent );
            },
            // unbind event
            disable: function(){
                var that = this;

                that.$drag.unbind( 'mousedown', that._handleEvent ); 
            }
        }

        return dragdrop;

    })();

    var dialog = {
        create: function( options ){
            var dl = new DialogLayer( options );
            // save global dialog
            // layers.push( dl );
            return dl;
        },
        load: function( msg, delay, shade, shadeClose ){
            // delay is not exist
            return Dialog.create({
                type: 'load',
                html: msg,
                fixed: true,
                unload: true,
                shade: shade || false,
                shadeClose: shadeClose || true,
                delay: typeof delay !== 'undefined' ? delay : false
            })
        },
        prompt: function( msg, val, ok, cancel ){
            return Dialog.create({
                type: 'prompt',
                html: msg,
                value: val,
                fixed: true,
                width: 300,
                unload: true,
                shade: true,
                buttons: [
                    {
                        name: '确定',
                        callback: ok,
                        disabled: false,
                        focus: true
                    },
                    {
                        name: '取消',
                        callback: cancel,
                        disabled: false,
                        focus: false
                    }
                ]
            })
        },
        confirm: function( msg, ok, cancel ){

            return Dialog.create({
                type: 'confirm',
                html: msg,
                fixed: true,
                unload: true,
                shade: true,
                buttons: [
                    {
                        name: '确定',
                        callback: ok,
                        disabled: false,
                        focus: true
                    },
                    {
                        name: '取消',
                        callback: cancel,
                        disabled: false,
                        focus: false
                    }
                ]
            })
        },
        alert: function( msg, config, callback ){
            // title is not exist
            if( typeof config === 'function' ){
                callback = config;
                config = {};
                config.title = Default.title;
            }

            return Dialog.create({
                type: 'alert',
                html: msg,
                icon: config.icon || false,
                fixed: true,
                title: config.title,
                unload: true,
                shade: config.shade === false ? false : true,
                buttons: [
                    {
                        name: '确定',
                        callback: callback,
                        disabled: false,
                        focus: true
                    }
                ]
            })
        },
        msg: function( msg, delay, shade ){
            // delay is not exist
            delay = typeof delay !== 'undefined' ? delay : true;

            return Dialog.create({
                type: 'msg',
                title: false,
                html: msg,
                fixed: true,
                unload: true,
                shade: shade || false,
                closeBtn: !delay ? function(){} : false,
                delay: delay,
                isMove: false
            })
        },
        // config default param
        config: function( config ){
            return $.extend( Default, config );
        }
    }

    'function' === typeof define? define(function(){
        return dialog;
    }) : window.Dialog = dialog;
    
})()