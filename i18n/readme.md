# i18n.js

一个前端国际化的js库，不依赖于任何其他库，采用原生js编写

## 规定与数据格式

国际化对象：通过new 的方式创建的 i18n对象

```js
var i18n = new i18n();
```

国际化数据对象：指的是请求获取到的国际化json文件转为的js对象，转换后的js对象结构如下

```js
var i18nObj = {
	title:{
		username:"用户名",
		password:"密码"
	},
	input:{
		username:"请输入用户名",
		password:"请输入密码"
	}
}
```

国际化json文件：指的是国际化资源文件，json格式，如下

```json
{
	"title":{
		"username":"用户名",
		"password":"密码"
	},
	"input":{
		"username":"请输入用户名",
		"password":"请输入密码"
	}
}
```

国际化语言：指的是如 'zh_CN','en_US'这样的字符串，可以是手动指定的，也可以是从cookie中读取到的





## 使用示例

此使用示例是建立在 springmvc框架基于cookie进行国际化的基础上的，springmvc框架基于cookie方式的国际化，会在浏览器客户端生成一个如下格式的cookie，键是固定的，具体见 **#如何更改国际化** 推荐的方式

```json
org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=zh_CN
```

springmvc.xml配置文件

```xml
<mvc:interceptors>
    <bean class="org.springframework.web.servlet.i18n.LocaleChangeInterceptor"/>
</mvc:interceptors>
<bean id="localeResolver" class="org.springframework.web.servlet.i18n.CookieLocaleResolver"></bean>
```

### 目录结构和资源

- i18n.js
-  i18n_en_US.json
- i18n_zh_CN.json
- index.html

### 国际化资源

i18n_zh_CN.json

```json
{
	"user":{
		"name":"张三",
		"age":20,
		"password":"请输入密码"
	}
}
```

i18n_zh_CN.json

```json
{
	"user":{
		"name":"zhangsan",
		"age":20,
		"password":"Please enter your password"
	}
}
```

### index.html  和 JavaScript

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
</head>
<body>
	<button onclick="changeLocale('zh_CN')">中文 test.do</button>
	<button onclick="changeLocale('en_US')">English test.do</button><br />
	

	<span class="i18n" i18nkey='title.username' i18ntarget='inner'></span>
	<input type="text" class="i18n" i18nkey='input.username' i18ntarget='placeholder'/><br />
	
	<span class="i18n" i18nkey='title.password' i18ntarget='inner'></span>
	<input type="text" class="i18n" i18nkey='input.password' i18ntarget='placeholder'/><br />
</body>
</html>
<script src="../source/i18n.js"></script>
<script>
	//创建国际化对象
	var i18n = new i18n();
	//获取国际化数据对象
	var data = i18n.getI18nDataFromAjax({
		url:'../demo/i18n_{lang}.json'
	})
	//渲染页面
	i18n.render({});
	
	function changeLocale(locale) {
		//通过携带 locale 请求参数来切换国际化语言，并刷新页面（需要配合后端springmvc 的 基于cookie方式的国际化）
		// var xhr = new XMLHttpRequest();
		// xhr.onreadystatechange = function() {
		// 	if (xhr.readyState == 4 && xhr.status == 200) {
		// 		window.location.reload();
		// 	}
		// }
		// xhr.open("GET", 'test2.do?locale='+locale, false);
		// xhr.send();
		
		//通过更改本地国际化语言cookie的值
		document.cookie='org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE='+locale;
	}
</script>
```



## HTML标签的属性使用

```html
<span class="i18n" i18nkey='user.name' i18ntarget='inner'></span>
<span class="i18n" i18nkey='user.age' i18ntarget='inner'></span>
<input type="text" class="i18n" i18nkey='user.password' i18ntarget='placeholder'/>
```

| 属性       | 必须 | 介绍                                                         |
| ---------- | ---- | ------------------------------------------------------------ |
| class      | 是   | 指定统一的class属性，调用国际化函数时将class属性值传入即可   |
| i18nkey    | 是   | 键值，用来通过此键值获取国际化对应的值，如`i18nkey='user.name'`对应中文可能是 `用户名` |
| i18ntarget | 是   | 指定其内容放到哪里，可选inner（双标签内部），或其他所有属性（标签支持或自定义的属性） |



## 对象的函数

### getI18nDataFromAjax()

从指定的URL获取国际化json文件，解析为js对象（国际化数据对象），存储到当前对象中并返回

```javascript
i18n.getI18nDataFromAjax({
    url:'test/i18n_{lang}.json',
    locale:'zh_CN',
    localeKey:'org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE'
})
//返回值为请求得到的国际化json转为的js对象
```

| 属性      | 类型   | 必须 | 默认值                                                       | 介绍                                                         |
| --------- | ------ | ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| url       | string | 是   |                                                              | 获取国际化文件的URL，如果有两个国际化json文件`i18n_zh_CN.json`和`i18n_en_US.json`，那么你的URL应该是像这样`xxx/i18n_{lang}.json`，函数会获取国际化语言，自动将`{lang}`替换掉，成为这样的URL：`xxx/i18n_zh_CN.json`或`xxx/i18n_en_US.json`，原理为：`url = url.replaceAll("{lang}", locale);` |
| locale    | string | 否   | 从cookie中获取，<br>cookie中获取不到则默认为zh_CN            | 指定语言，如 `zh_CN`,`en_US`                                 |
| localeKey | string | 否   | org.springframework.web.servlet.<br>i18n.CookieLocaleResolver.LOCALE | 指定从本地cookie中获取指定的国际化语言                       |

国际化优先级：

 * 		如果没指定locale，那么通过本地cookie获取cookie中指定的国际化语言
 * 		如果没有指定locale，那么会通过localeKey获取本地cookie，获取其中的值作为国际化语言
 * 		如果没有localeKey所对应的cookie值，那么将采用默认语言 zh_CN
 * 		优先级：参数指定 > cookie指定 > 默认



### render()

将页面进行渲染（将页面进行国际化）

```javascript
i18n.render({
    data:i18nData,
    className:'i18n'
})
```

| 属性      | 类型   | 必须 | 默认               | 介绍                                                         |
| --------- | ------ | ---- | ------------------ | ------------------------------------------------------------ |
| data      | object | 否   | 当前对象的i18nData | 一个js对象，是国际化json文件转化的js对象，当然你也可以自己创建一个js对象，这个js对象结构看起来如同json格式一样 |
| className | string | 否   | i18n               | 要进行国际化的标签的class属性值                              |



### getThisObjI18nData() 

获取当前国际化对象的国际化数据对象，返回一个国际化数据对象

```javascript
var i18nData = i18n.getThisObjI18nData()
```







## 如何更改国际化

1. 调用 `i18nFromAjax({url:'xxxx.json',locale:'zh_CN'})` 时手动指定 locale 属性

2. 调用 `i18nFromAjax({url:'xxxx.json',localeKey:'mycookieKey'})` 时手动指定 localeKey 属性，

   会通过指定的localeKey获取浏览器的此对应的cookie，从cookie中读取到指定的国际化语言

3. 【推荐】此js库是和后端 springmvc基于cookie的国际化（CookieLocaleResolver） 搭配使用的，

   浏览器发起一个请求带有 locale 的参数指定国际化语言（如`deom.do?locale=zh_CN`），之后本地会被写入一个cookie，以中文国际化为例，写入的cookie键值对如下：

   `org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=zh_CN`

   之后刷新浏览器，再次调用 `i18nFromAjax({url:'xxxx.json'})` 仅指定国际化文件的URL，函数会读取这个cookie得到国际化语言，然后请求国际化资源，渲染到页面