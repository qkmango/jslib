var i18nData=null;function i18nFromAjax({url,locale,asyn=false,className,localeKey='org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE'}){if(locale==undefined){let cookieLocale=getCookie(localeKey);if(cookieLocale!=null){locale=cookieLocale.replaceAll('-','_');}else{locale='zh_CN';}}url=url.replaceAll("{lang}",locale);var xhr;if(window.XMLHttpRequest){xhr=new XMLHttpRequest();}else{xhr=new ActiveXObject("Microsoft.XMLHTTP");}xhr.onreadystatechange=function(){if(xhr.readyState==4&&xhr.status==200){let data=JSON.parse(xhr.responseText);i18nData=data;if(className!=undefined){i18n({data:data,className:className});}}}xhr.open("GET",url,false);xhr.send();return i18nData;}function i18n({data,className}){if(data==undefined){return;}if(className==undefined){return;}var doms=document.getElementsByClassName(className);for(var i=0;i<doms.length;i++){var keys=doms[i].getAttribute('i18nkey').split('.');var value=data;for(var j=0;j<keys.length;j++){value=value[keys[j]];}let i18ntarget=doms[i].getAttribute('i18ntarget');switch(i18ntarget){case'inner':doms[i].innerText=value;break;default:doms[i].setAttribute(i18ntarget,value);}}}function getI18nData(url){if(i18nData!=null){return i18nData;}if(url!=undefined){i18nFromAjax({url:url,asyn:false});return i18nData;}return null;}function getCookie(name){var strcookie=document.cookie;var arrcookie=strcookie.split("; ");for(var i=0;i<arrcookie.length;i++){var arr=arrcookie[i].split("=");if(arr[0]==name){return arr[1];}}return null;}