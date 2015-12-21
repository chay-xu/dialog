# Dialog
dialog layer plugin support pc and mobile

see demo 

* [pc dialog](http://xu8511831.github.io/demo/dialog/pc/index.html) 
* [mobile dialog](http://xu8511831.github.io/demo/dialog/mobile/index.html)

# dialog.js

#### base options
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
      <td><pre>{ padding: '10px' }</pre></td>
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
      <td><code>string</code>|<code>number</code></td>
      <td>'50%'</td>
      <td>dialog position</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>string</code>|<code>number</code></td>
      <td>'50%'</td>
      <td>dialog position</td>
    </tr>
    <tr>
      <td>align</td>
      <td><code>string</code></td>
      <td>center</td>
      <td>
      	buttons algin positon
        <code>left</code>
        <code>center</code>
        <code>right</code>
      </td>
    </tr>
    <tr>
      <td>drag</td>
      <td><code>object</code></td>
      <td>[drag options](#drag)</td>
      <td>
      	buttons algin positon
        <code>left</code>
        <code>center</code>
        <code>right</code>
      </td>
    </tr>
    <tr>
      <td>animate</td>
      <td><code>boolean</code></td>
      <td>false</td>
      <td>fade animation</td>
    </tr>
    <tr>
      <td>animateAlign</td>
      <td><code>string</code></td>
      <td>bottom</td>
      <td>fade animation direction</td>
    </tr>
    <tr>
      <td>shade</td>
      <td><code>boolean</code></td>
      <td>true</td>
      <td>whether to display the shade layer</td>
    </tr>
    <tr>
      <td>shadeClose</td>
      <td><code>boolean</code></td>
      <td>false</td>
      <td>the shade layer auto close</td>
    </tr>
    <tr>
      <td>opacity</td>
      <td><code>number</code></td>
      <td>0.5</td>
      <td>the shade layer opacity</td>
    </tr>
    <tr>
      <td>delay</td>
      <td><code>boolean</code>|<code>number</code></td>
      <td>false</td>
      <td>
      close time interval, in ms. If the value is <strong>true</strong>, the default is 1800ms. the value is <strong>false</strong>, the not close
      </td>
    </tr>
    <tr>
      <td>unload</td>
      <td><code>boolean</code></td>
      <td>true</td>
      <td>unbind event and destory DOM element</td>
    </tr>
    <tr>
      <td>fixed</td>
      <td><code>boolean</code></td>
      <td>false</td>
      <td>fixed positioned dialog layer</td>
    </tr>
    <tr>
      <td>isMove</td>
      <td><code>boolean</code></td>
      <td>true</td>
      <td>drag and drop move the dialog layer</td>
    </tr>
    <tr>
      <td>buttons</td>
      <td><code>array</code></td>
      <td>
      	<pre>
        [{
          name: '确定',
          callback: function(){},
          disabled: false,
          focus: false
        }]
        </pre>
      </td>
      <td>dialog position</td>
    </tr>
    <tr>
      <td>closeBtnFn</td>
      <td><code>function</code></td>
      <td>function(){}</td>
      <td>Function to execute when the button is closed</td>
    </tr>
    <tr>
      <td>beforeFn</td>
      <td><code>function</code></td>
      <td>function(){}</td>
      <td>Function that are executed before the initialization </td>
    </tr>
    <tr>
      <td>afterFn</td>
      <td><code>function</code></td>
      <td>function(){}</td>
      <td>Function that are executed after the initialization </td>
    </tr>
  </tbody>
</table>

### drag options ###
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
      <td>value</td>
      <td><code>string</code></td>
      <td></td>
      <td>value</td>
    </tr>
  </tbody>
</table>

### prompt options
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
      <td>value</td>
      <td><code>string</code></td>
      <td></td>
      <td>value</td>
    </tr>
  </tbody>
</table>

### prompt options
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
      <td>src</td>
      <td><code>url</code></td>
      <td>about:blank</td>
      <td>address of the resource</td>
    </tr>
    <tr>
      <td>scrolling</td>
      <td><code>string</code></td>
      <td>auto</td>
      <td>iframe window overflow scroll</td>
    </tr>
    <tr>
      <td>winBtn</td>
      <td><code>boolean</code></td>
      <td>true</td>
      <td>
      	add buttons
      	<code>min</code>
      	<code>restore</code>
      	<code>full</code>
      </td>
    </tr>
    <tr>
      <td>onloadFn</td>
      <td><code>function</code></td>
      <td>function(){}</td>
      <td>Function after the completion of the iframe load</td>
    </tr>
  </tbody>
</table>

### Instance Methods

.title()
```js
/**
 * @param {string} title contents
 * @return title
 */
var dialogAlert = Dialog.alert( '成功', function(){} );
var title = dialogAlert.title();
console.log( title );
```

.html()
```js
/**
 * @param {string} html contents
 * @return this
 */
var dialogAlert = Dialog.alert( '成功', function(){} );
var title = dialogAlert.html( '内容' ).title( '标题' );
console.log( title );
```

.buttons()
```js
/**
 * @param {array} buttons array
 * @return this
 */
var dialogAlert = Dialog.alert( '成功', function(){} );

dialogAlert.buttons([{
    name: '取消',
    callback: function(){},
    disabled: false,
    focus: false
}]).html( '内容' );
```

.moveTo()
```js
/**
 * @param {number|string} top position
 * @param {number|string} left position
 * @return this
 */
var dialogPage = Dialog({
	title: 'title',
	html: 'do something'
});
dialogPage.moveTo( '50%', '100%' );

```

.hide()
```js
/**
 * @return this
 */
var dialogAlert = Dialog.alert( '成功', function(){} );

dialogAlert.hide();
```

.show()
```js
/**
 * @return this
 */
var dialogAlert = Dialog.alert( '成功', function(){} );

dialogAlert.show();
```

.close()
```js
/**
 * hide or destory the dialog instance
 */
var dialogAlert = Dialog.alert( '成功', function(){} );

dialogAlert.close();
```

.unload()
```js
/**
 * unbind event and destory dom element
 */
var dialogAlert = Dialog.alert( '成功', function(){} );

dialogAlert.unload();
```

.closeAll()
```js
/**
 * close all of dialog layers on the page
 */
var dialogAlert1 = Dialog.alert( '成功', function(){} );
var dialogAlert2 = Dialog.alert( '成功', function(){} );

dialogAlert1.closeAll();
```

# dialog-mobile.js
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
      <td>type</td>
      <td><code>string</code></td>
      <td>load</td>
      <td>
        <code>load</code>
        <code>tip</code>
        <code>confirm</code>
        <code>alert</code>
        <code>page</code>
      </td>
    </tr>
    <tr>
      <td>html</td>
      <td><code>string</code></td>
      <td></td>
      <td>dialog content html</td>
    </tr>
    <tr>
      <td>mask</td>
      <td><code>boolean</code></td>
      <td>true</td>
      <td>shows or hides the mask layer</td>
    </tr>
    <tr>
      <td>maskClose</td>
      <td><code>boolean</code></td>
      <td>true</td>
      <td>bind close event to mask layer</td>
    </tr>
    <tr>
      <td>animation</td>
      <td><code>string | boolean</code></td>
      <td>false</td>
      <td>css3 animation</td>
    </tr>
    <tr>
      <td>unload</td>
      <td><code>boolean</code></td>
      <td>true</td>
      <td>destroy dialog object</td>
    </tr>
    <tr>
      <td>buttons</td>
      <td><code>array</code></td>
      <td>
        {
					name: '取消',
					callback: function(){}
				},
				{
					name: '确认',
					callback: function(){}
				}
      </td>
      <td>buttons param</td>
    </tr>
    <tr>
      <td>init</td>
      <td><code>function</code></td>
      <td>function(){}</td>
      <td>init callback</td>
    </tr>
    <tr>
      <td>closeBtn</td>
      <td><code>function</code></td>
      <td>function(){}</td>
      <td>close button is clicked</td>
    </tr>
  </tbody>
</table>
#### Creating a Dialog
```js
/**
 * @prama { object } dialog options
 * @return Dialog
 */
Dialog.create( options );

/**
 * @prama { string } 消息内容
 * @prama { number|boolean } 可选 时间延长,false不消失
 * @prama { boolean } 可选 mask点击关闭
 * @return Dialog
 */
Dialog.load( '成功', false );

/**
 * @prama { string } 消息内容
 * @prama { function } ok button callback
 * @prama { function } cancel button callback
 * @prama { boolean } 可选 mask点击关闭
 * @return Dialog
 */
Dialog.confirm( '成功', function(){}, function(){} );

/**
 * @prama { string } 消息内容
 * @prama { function } ok button callback
 * @prama { boolean } 可选 mask点击关闭
 * @return Dialog
 */
Dialog.alert( '成功', function(){} );

/**
 * @prama { string } 消息内容
 * @prama { number|boolean } 时间延长,false不消失
 * @prama { boolean } mask点击关闭
 * @prama { function } closed callback
 * @return Dialog
 */
Dialog.tip( '成功', 1200, true, function(){} );

/**
 * @prama { string } 消息内容
 * @prama { function } closed callback
 * @prama { boolean } mask点击关闭
 * @return Dialog
 */
Dialog.page( '成功', 1200, true, function(){} );

/**
 * @prama { object } dialog object 设置全局默认参数
 */
Dialog.config( options )

```
### Method
.close()

by calling the unload or hide to the config.
```js
Dialog.tip( '成功', false).close()
```

.unload()

The public destroy() method can be used to free some memory, remove dom and off event.
```js
var tip = Dialog.tip( '成功', false);
tip.unload()
```

.hide()
```js
var tip = Dialog.tip( '成功', false);
tip.hide();
```

.show()
```js
var tip = Dialog.tip( '成功', false);
tip.show()
```
