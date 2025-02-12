import createWorker from './worker.js';

export default function (code, context) {
  const worker = createWorker(code, context);

  return (req, res, next) => {
    const data = [];
    let size = 0;

    req.on('data', chunk => {
      data.push(chunk);
      size += chunk.length;
    });

    req.on('end', async () => {
      try {
        const url = new URL(req.originalUrl || req.url, [req.protocol || 'http', req.headers.host].join('://'));
        const response = await worker.dispatchFetch(url, {
          headers: req.headers,
          method: req.method,
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(data, size)
        });

        res.writeHead(response.status, response.headers);
        const arrayBuffer = await response.arrayBuffer();
        res.end(Buffer.from(arrayBuffer), 'binary');
      } catch (error) {
        if (next instanceof Function) {
          return next(error);
        }
        throw error;
      }
    });
  };
}
