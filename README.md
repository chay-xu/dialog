# Dialog
dialog layer plugin support pc and mobile

see demo pc：[dialog](http://xu8511831.github.io/demo/dialog/pc/index.html) mobile： [dialog](http://xu8511831.github.io/demo/dialog/mobile/index.html)

# dialog.js

#### base
<table>
  <thead>
    <tr>
      <th>Param</th>
      <th>Type</th>
      <th>Default</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>className</td>
      <td><code>string</code></td>
      <td></td>
      <td>className</td>
    </tr>
    <tr>
      <td>container</td>
      <td><code>string</code></td>
      <td>body</td>
      <td>dom element</td>
    </tr>
    <tr>
      <td>css</td>
      <td><code>object</code></td>
      <td>{ padding: '10px' }</td>
      <td>css object</td>
    </tr>
    <tr>
      <td>html</td>
      <td><code>string</code></td>
      <td>'加载中...'</td>
      <td>html</td>
    </tr>
    <tr>
      <td>title</td>
      <td><code>string</code></td>
      <td>'信息'</td>
      <td>html</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>string | number</code></td>
      <td>'50%'</td>
      <td>dialog position</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>string | number</code></td>
      <td>'50%'</td>
      <td>dialog position</td>
    </tr>
    <tr>
      <td>align</td>
      <td><code>string</code></td>
      <td>center</td>
      <td>
        <code>left</code>
        <code>center</code>
        <code>right</code>
      </td>
    </tr>
    <tr>
      <td>buttons</td>
      <td><code>array</code></td>
      <td>
        {
          name: '确定',
          callback: function(){},
          disabled: false,
          focus: false
        }
      </td>
      <td>dialog position</td>
    </tr>
    <tr>
      <td>closeBtn</td>
      <td><code>function</code></td>
      <td>function(){}</td>
      <td>close button</td>
    </tr>
  </tbody>
</table> 
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

# dialog-mobile.js
