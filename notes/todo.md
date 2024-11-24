# pnpm npm yarn

pnpm 通过硬链接、冗余移除、压缩存储、并行安装和锁定文件等机制，实现了高效、可共享的依赖管理方式，有效地减少了磁盘空间占用和重复下载的问题，并提高了安装速度

# apply call bind

```javascript
fn.apply(thisObj, [1, 2, 3]);
fn.call(thisObj, 1, 2, 3);
const a = fn.bind(thisObj, 1, 2, 3);
a();
```
