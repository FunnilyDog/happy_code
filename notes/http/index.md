# url uri urn

URI 语法：scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
Scheme：URI 的起始点，并与 URI 协议相关。URI schema 对大小写不敏感，后面带有一个“:”。几个流行的 URI schema 的例子：HTTP、HTTPS、FTP 和 mailto。
Authority（权限）：Authority 字段是位于 schema 字段之后的第二个条目，以两个斜杠(//)开头。这个字段由多个子字段组成：
• authentication（认证信息）-可选的字段和用户名，密码，由冒号隔开，后面跟着“@”符号
• host（主机名）—注册的名称或 IP 地址，出现在“@”符号之后
• port（端口号）-可选字段，后面跟着一个冒号
Path（路径）：Path 是第三个字段，由斜杠分隔的段序列来表示，用来提供资源的位置。注意，不管 authority 部分存在或不存在，path 都应该以一个斜杠开始，而不是双斜杠(//)。
Query（查询）：Query 是第四个字段，是 URI 的可选字段，包含一串非结构数据并以“?”和 Path 隔开。
Fragment（片段）：Fragment 是第五个组成部分，也是一个可选字段，提供指向辅助资源的方向，并以“#”开始。简单来说，Fragment 字段可以用于指向 HTML 页面的特定元素(主资源)。

url（统一资源定位符），用于标示网络资源的位置。URL 是一个给定唯一 Web 资源的地址，表明了这个唯一的 Web 资源的位置，用户可以通过 URL 浏览互联网。如果我们在任何应用程序中点击任何超链接，它会将我们重定向到相关的 URL，这些 URL 也可以很容易的输入到浏览器地址栏中，并可以加载特定的资源。

URN 是一种具有静态名称的互联网资源，即使它的数据被移动到另一个位置也仍然有效。URL 在内容被移动后就失效了，与之不同的是，URN 可以始终跟踪 Web 上某些数据的资源，从而解决了频繁移动数据的问题。
URN 语法：scheme:NID: NSS

# CSP

定义：CSP 是一种用于增强网站安全的策略，他通过限制网页内容的来源和执行的方式来减少恶意攻击。

原理：
· 服务器设置策略：服务器端通过相应头 content-security-policy / content-security-policy-report-only 来设置 CSP 策略。
· 浏览器执行策略：浏览器加载网页时，会根据服务器端返回的 csp 策略限制网页中各种资源的加载和执行，并阻止不符合策略的操作。
· 检查资源来源：浏览器会检查网页中所有资源的来源是否符合 CSP 策略中定义的规则，如果资源的来源于策略不匹配，浏览器组织加载该资源。
· 限制脚本执行：CSP 还可以通过禁止或限制内连脚本的执行来阻止 XSS 攻击。