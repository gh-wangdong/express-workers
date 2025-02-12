import createWorker from './worker';

export default function (code) {
  const worker = createWorker(code);

  return (req, res, next) => {
    const data = [];
    let size = 0;

    req.on('data', chunk => {
      data.push(chunk);
      size += chunk.length;
    });

    req.on('end', async () => {
      try {
        const url = new URL(req.originalUrl, [req.protocol, req.get('host')].join('://'));
        const response = await worker.dispatchFetch(url, {
          headers: req.headers,
          method: req.method,
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(data, size)
        });

        res.writeHead(response.status, response.headers);
        const arrayBuffer = await response.arrayBuffer();
        res.end(Buffer.from(arrayBuffer), 'binary');
      } catch (error) {
        next(error);
      }
    });
  }
}
