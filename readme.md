# express-worker

基于 express 的 worker 服务中间件

## 使用方法

```javascript
import middleware from '@wang-dong/express-worker';
...
app.use(middleware(code, { echo: console.log }));
```

参考示例

```javascript
const time = Date.now();

self.addEventListener('fetch', event => {
  // 自定义函数
  echo('fetch', event.request.url);

  // 等待异步操作
  event.waitUntil(new Promise(resolve => setTimeout(resolve, 1000)));

  // 返回响应
  event.respondWith(
    new Response(JSON.stringify({ ok: true, uuid: crypto.randomUUID(), time }, null, 2), {
      'content-type': 'application/json'
    })
  );
});
```
