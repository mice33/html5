var sockjs_url="http://172.16.150.196:9999/echo",sockjs=new SockJS(sockjs_url);window.console={},window.console.log=function(a){if("string"==typeof a)try{sockjs.send(a)}catch(b){}else if("object"==typeof a)try{var c=JSON.stringify(a);try{sockjs.send(c)}catch(b){}}catch(b){try{sockjs.send("Error: stringify error")}catch(b){}}};