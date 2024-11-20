## for...in for...of 区别

for in 遍历键名;for of 遍历键值且只遍历自身 性能相对好一些,只能遍历可迭代对象

## 类型判断

1. typeOf 只能判断基本类型,引用类型判断不出
2. instanceof 可判断引用类型 不可判断基本数据类型
   原理： 在表达式 object instanceof AFunction 中，会检查 object 的原型链是否与 AFunction.prototype 匹配，而不是与 AFunction 本身匹配。

function myInstanceof(Fn, obj) {
// 获取该函数显示原型
const prototype = Fn.prototype;
// 获取 obj 的隐式原型
let proto = obj.**proto**;
// 遍历原型链
while (proto) {
// 检测原型是否相等
if (proto === prototype) {
return true;
}
// 如果不等于则继续往深处查找
proto = proto.**proto**;
}
return false;
}

3. Object.prototype.isPrototypeOf
   原理：在表达式 object.prototype.isPrototypeOf(AFunction) 中，会检查 AFunction 是否在 object 的原型链中
   function myIsPrototypeOf(Fn) {
   // 获取该函数显示原型
   const prototype = Fn.prototype;
   // 获取 obj 的隐式原型
   let proto = this.**proto**;
   // 遍历原型链
   while (proto) {
   // 检测原型是否相等
   if (proto === prototype) {
   return true;
   }
   // 如果不等于则继续往深处查找
   proto = proto.**proto**;
   }
   return false;
   }

4. Object.prototype.toString.apply(obj)
   原理

### 缓存

1. 浏览器缓存

2. http 缓存

强缓存：浏览器会检测缓存时间是否过期，若未过期则不会向服务器发请求转而直接从缓存中读取。
http1 中 由 expires 控制缓存过期时间，该时间受限于本地时间。在 http1.1 后改由请求头 cache-control 控制。
命中强缓存 状态码返回 200 size 为 form disk cache / memory cache。

协商缓存：浏览器优先检测是否命中强缓存，若未命中强缓存则浏览器携带协商缓存标识向服务器发起请求，由服务器根据缓存标识确定是否使用缓存，若生效则返回状态码 304，否则正常返回 200 和请求资源。
缓存是否失效 由 Last-Modified / If-Modified-Since 和 ETag 决定。
浏览器首次请求资源时服务器会在响应头中给到 Last-Modified ，浏览器再次请求该资源时 会在请求头中添加 If-Modified-Since 由服务器判断缓存资源是否失效。
由于 Last-Modified 只能精确到秒级，可能会导致已失效缓存被误判，且如果本地打开缓存文件也会更新 Last-Modified 。因此 Etag 是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，只要资源有变化，Etag 就会重新生成。

## Web 安全

1. XSS（跨站脚本攻击）
   原理： 向目标网站注入脚本以获取用户信息等。
   分类： 存储型（向服务器发送攻击脚本，存储在服务器中，用户正常请求时受到攻击），反射型（恶意链接），基于 DOM
   防御： 浏览器/服务器端做好特殊字符转换校验，重要 cookie 可设置 httpOnly 属性防止被窃取。利用 csp 禁止除安全脚本以外的脚本运行。

2. CSRF(跨站请求伪造)
   原理：诱导用户打开三方网站，利用用户的登录态发起跨站请求。
   分类：
   自动发起 Get 请求(利用 img 等 src 属性 <img src="https://time.geekbang.org/sendcoin?user=hacker&number=100"> )

   自动发起 Post 请求（利用隐藏表单自动提交 <script> document.getElementById ('hacker-form').submit(); </script> ）

   不良链接（ <img width=150 src=http://images.xuejuzi.cn/1612/1-161230185104_1.jpg> </img>
   <a href="https://time.geekbang.org/sendcoin?user=hacker&number=100" taget="\_bla 点击下载美女照片"）

防御：
通过设置 Access-Control-Allow-Origin 不允许或只允许安全域名下发起请求
利用 cookie 的 SameSite 属性 禁止三方请求发送重要 cookie。
利用 token 验证是否为合法三方请求。
